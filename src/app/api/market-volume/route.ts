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

import { applyCdnCacheHeaders } from "../applyCdnCacheHeaders";
import { markets } from "@/consts/markets";

type PoolRow = GetPoolsQuery["pools"][number];

export type MarketVolumeResponse = {
  totalVolumeSDai: number;
};

function pairKey(tokenA: Address, tokenB: Address) {
  const { token0, token1 } = getToken0Token1(tokenA, tokenB);
  return `${token0.toLowerCase()}-${token1.toLowerCase()}`;
}

function poolUnderlyingVolume(pool: PoolRow, underlying: Address) {
  const address = underlying.toLowerCase();
  if (pool.token0.id.toLowerCase() === address) {
    return Number(pool.volumeToken0);
  }
  if (pool.token1.id.toLowerCase() === address) {
    return Number(pool.volumeToken1);
  }
  return 0;
}

async function getTotalVolumeSDai() {
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

  return markets.reduce((total, market) => {
    const upPool = poolsByPair.get(
      pairKey(market.underlyingToken, market.upToken),
    );
    const downPool = poolsByPair.get(
      pairKey(market.underlyingToken, market.downToken),
    );
    // we only want underlying volume to ltr convert to sDAI
    const underlyingVolume =
      (upPool ? poolUnderlyingVolume(upPool, market.underlyingToken) : 0) +
      (downPool ? poolUnderlyingVolume(downPool, market.underlyingToken) : 0);

    return total + underlyingToSessionSDai(underlyingVolume);
  }, 0);
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
    const totalVolumeSDai = await getTotalVolumeSDai();

    const res = NextResponse.json({
      totalVolumeSDai,
    } satisfies MarketVolumeResponse);
    res.headers.set("Access-Control-Allow-Origin", "*");
    applyCdnCacheHeaders(res);
    return res;
  } catch (error) {
    console.error("market-volume", error);
    return NextResponse.json(
      { error: "Failed to fetch market volume" },
      { status: 500 },
    );
  }
}
