export const revalidate = 300;

import { NextResponse } from "next/server";
import { Address } from "viem";

import {
  calculateMarketLiquidity,
  PoolBalance,
} from "@/utils/calculateLiquidity";

import { markets } from "@/consts/markets";

import { applyCdnCacheHeaders } from "../applyCdnCacheHeaders";

const CHAIN_ID = 100;

type SeerMarketResponse = {
  poolBalance: Array<PoolBalance | null>;
};

async function fetchSeerMarket(
  marketId: Address,
): Promise<SeerMarketResponse | null> {
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
    return null;
  }

  return response.json();
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
      markets.map(async (market) => {
        const seerMarket = await fetchSeerMarket(market.marketId);
        const poolBalance = seerMarket?.poolBalance ?? [];
        const liquidity = await calculateMarketLiquidity(market, poolBalance);

        return {
          name: market.name,
          poolBalance,
          ...liquidity,
        };
      }),
    );

    const totalLiquiditySDai = data.reduce(
      (sum, market) => sum + market.liquiditySDai,
      0,
    );

    const res = NextResponse.json({
      data,
      totalLiquiditySDai,
      parentOutcomeCount: markets.length,
    });
    res.headers.set("Access-Control-Allow-Origin", "*");
    applyCdnCacheHeaders(res);
    return res;
  } catch (error) {
    console.error("markets-liquidity", error);
    return NextResponse.json(
      { error: "Failed to fetch markets liquidity" },
      { status: 500 },
    );
  }
}
