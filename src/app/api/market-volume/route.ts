export const revalidate = 300;

import { GraphQLClient } from "graphql-request";
import { NextResponse } from "next/server";
import { Address } from "viem";

import {
  OrderDirection,
  Pool_OrderBy,
  getSdk as getSwaprSdk,
  GetPoolsQuery,
} from "@/hooks/liquidity/gql/gql";
import { getGraphUrl, getToken0Token1 } from "@/hooks/liquidity/utils";

import { underlyingToSessionSDai } from "@/utils/calculateLiquidity";

import { markets } from "@/consts/markets";

type PoolRow = GetPoolsQuery["pools"][number];

type OutcomeNotionalVolume = {
  outcome: "UP" | "DOWN";
  /** Outcome tokens traded. */
  volume: number;
  notionalSDai: number;
};

export type MarketNotionalVolume = {
  name: string;
  notionalSDai: number;
  outcomes: OutcomeNotionalVolume[];
};

export type MarketVolumeResponse = {
  totalVolumeSDai: number;
  totalNotionalSDai: number;
  data: MarketNotionalVolume[];
};

function pairKey(tokenA: Address, tokenB: Address) {
  const { token0, token1 } = getToken0Token1(tokenA, tokenB);
  return `${token0.toLowerCase()}-${token1.toLowerCase()}`;
}

function poolVolumeLegs(pool: PoolRow | undefined, underlying: Address) {
  if (!pool) return { underlying: 0, outcome: 0 };

  const volume0 = Number(pool.volumeToken0);
  const volume1 = Number(pool.volumeToken1);
  return pool.token0.id.toLowerCase() === underlying.toLowerCase()
    ? { underlying: volume0, outcome: volume1 }
    : { underlying: volume1, outcome: volume0 };
}

async function getMarketVolumes(): Promise<MarketVolumeResponse> {
  const subgraphUrl = getGraphUrl();
  if (!subgraphUrl.startsWith("http")) {
    throw new Error("Swapr subgraph URL is not configured");
  }

  const tokenPairs = markets.flatMap((market) => [
    getToken0Token1(market.underlyingToken, market.upToken),
    getToken0Token1(market.underlyingToken, market.downToken),
  ]);

  const client = new GraphQLClient(subgraphUrl, {
    fetch: (url, options) =>
      fetch(url, { ...options, next: { revalidate: 300 } }),
  });

  const { pools } = await getSwaprSdk(client).GetPools({
    where: {
      or: tokenPairs.map((pair) => ({
        token0: pair.token0.toLowerCase(),
        token1: pair.token1.toLowerCase(),
      })),
    },
    orderBy: Pool_OrderBy.TotalValueLockedUsd,
    orderDirection: OrderDirection.Desc,
    first: 1000,
  });

  const poolsByPair = new Map(
    pools.map((pool) => [
      `${pool.token0.id.toLowerCase()}-${pool.token1.id.toLowerCase()}`,
      pool,
    ]),
  );

  let totalVolumeSDai = 0;
  let totalNotionalSDai = 0;

  const data = markets.map((market): MarketNotionalVolume => {
    const up = poolVolumeLegs(
      poolsByPair.get(pairKey(market.underlyingToken, market.upToken)),
      market.underlyingToken,
    );
    const down = poolVolumeLegs(
      poolsByPair.get(pairKey(market.underlyingToken, market.downToken)),
      market.underlyingToken,
    );

    // An UP or DOWN token redeems for at most one underlying, so its notional
    // is one underlying.
    const outcomes: OutcomeNotionalVolume[] = [
      {
        outcome: "UP",
        volume: up.outcome,
        notionalSDai: underlyingToSessionSDai(up.outcome),
      },
      {
        outcome: "DOWN",
        volume: down.outcome,
        notionalSDai: underlyingToSessionSDai(down.outcome),
      },
    ];
    const notionalSDai = underlyingToSessionSDai(up.outcome + down.outcome);

    totalVolumeSDai += underlyingToSessionSDai(up.underlying + down.underlying);
    totalNotionalSDai += notionalSDai;

    return { name: market.name, notionalSDai, outcomes };
  });

  return { totalVolumeSDai, totalNotionalSDai, data };
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function GET() {
  try {
    const res = NextResponse.json(await getMarketVolumes());
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set(
      "Netlify-CDN-Cache-Control",
      "public, max-age=60, stale-while-revalidate=300, durable",
    );
    res.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
    return res;
  } catch (error) {
    console.error("market-volume", error);
    return NextResponse.json(
      { error: "Failed to fetch market volume" },
      { status: 500 },
    );
  }
}
