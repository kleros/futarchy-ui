export const revalidate = 300;

import { GraphQLClient } from "graphql-request";
import { NextResponse } from "next/server";
import type { Address } from "viem";

import {
  OrderDirection,
  Swap_OrderBy,
  getSdk as getSwaprSdk,
} from "@/hooks/liquidity/gql/gql";
import { getGraphUrl, getToken0Token1 } from "@/hooks/liquidity/utils";

import { markets } from "@/consts/markets";

const PAGE_SIZE = 1000;

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

export type UniqueTradersResponse = {
  uniqueTraders: number;
  traders: Address[];
};

async function getUniqueTraders() {
  const subgraphUrl = getGraphUrl();
  if (!subgraphUrl.startsWith("http")) {
    throw new Error("Swapr subgraph URL is not configured");
  }

  const client = new GraphQLClient(subgraphUrl, {
    fetch: (url, options) =>
      fetch(url, { ...options, next: { revalidate: 300 } }),
  });
  const sdk = getSwaprSdk(client);

  const tokenPairs = markets.flatMap((market) => [
    getToken0Token1(market.underlyingToken, market.upToken),
    getToken0Token1(market.underlyingToken, market.downToken),
  ]);

  const { pools } = await sdk.GetPools({
    where: {
      or: tokenPairs.map((pair) => ({
        token0: pair.token0.toLowerCase(),
        token1: pair.token1.toLowerCase(),
      })),
    },
    first: PAGE_SIZE,
  });
  const poolIds = pools.map((pool) => pool.id.toLowerCase());

  // a swap's origin is the EOA that sent the transaction, so unlike token
  // holders it never points at pools, routers or trade executors
  const traders = new Set<string>();
  let cursor = "";
  for (;;) {
    const { swaps } = await sdk.GetSwaps({
      where: { pool_in: poolIds, id_gt: cursor },
      orderBy: Swap_OrderBy.Id,
      orderDirection: OrderDirection.Asc,
      first: PAGE_SIZE,
    });
    for (const swap of swaps) {
      traders.add(swap.origin.toLowerCase());
    }
    if (swaps.length < PAGE_SIZE) break;
    cursor = swaps[swaps.length - 1].id;
  }

  return [...traders].sort() as Address[];
}

export async function GET() {
  try {
    const traders = await getUniqueTraders();

    const res = NextResponse.json({
      uniqueTraders: traders.length,
      traders,
    } satisfies UniqueTradersResponse);

    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set(
      "Netlify-CDN-Cache-Control",
      "public, max-age=60, stale-while-revalidate=300, durable",
    );
    res.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
    return res;
  } catch (error) {
    console.error("unique-traders", error);
    return NextResponse.json(
      { error: "Failed to fetch traders data" },
      { status: 500 },
    );
  }
}
