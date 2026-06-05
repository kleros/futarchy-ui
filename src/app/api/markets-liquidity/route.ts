export const revalidate = 300;

import { NextResponse } from "next/server";
import { Address } from "viem";

import { markets } from "@/consts/markets";

const CHAIN_ID = 100;

type SeerMarketResponse = {
  liquidityUSD: number;
};

async function fetchSeerMarketLiquidity(marketId: Address): Promise<number> {
  const response = await fetch(
    "https://app.seer.pm/.netlify/functions/get-market",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chainId: CHAIN_ID, id: marketId }),
      next: { revalidate: 300 },
    },
  );

  if (response.status !== 200) {
    return 0;
  }

  const market: SeerMarketResponse = await response.json();
  return market.liquidityUSD ?? 0;
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
    const data = await Promise.all(
      markets.map(async (market) => ({
        name: market.name,
        id: market.marketId,
        liquidityUSD: await fetchSeerMarketLiquidity(market.marketId),
      })),
    );

    const averageLiquidityUSD =
      data.length > 0
        ? data.reduce((sum, market) => sum + market.liquidityUSD, 0) /
          data.length
        : 0;

    const res = NextResponse.json({ data, averageLiquidityUSD });
    res.headers.set("Access-Control-Allow-Origin", "*");
    return res;
  } catch (error) {
    console.error("markets-liquidity", error);
    return NextResponse.json(
      { error: "Failed to fetch markets liquidity" },
      { status: 500 },
    );
  }
}
