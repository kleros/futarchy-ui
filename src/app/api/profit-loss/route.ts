export const revalidate = 300;

import { NextRequest, NextResponse } from "next/server";
import { Address, isAddress } from "viem";

import { markets } from "@/consts/markets";

const CHAIN_ID = 100;

type SeerPortfolioPlResponse = {
  account: Address;
  chainId: number;
  period: string;
  marketId: Address;
  marketName: string;
  startTime: number;
  endTime: number;
  valueStart: number;
  valueEnd: number;
  tradingCollateralNetOut: number;
  routerPrimaryCollateralNetInWindow: number;
  events: unknown[];
  pnl: number;
};

type MarketProfitLoss = {
  name: string;
  marketId: Address;
  pnl: number;
  portfolio: SeerPortfolioPlResponse | null;
};

export type ProfitLossResponse = {
  markets: MarketProfitLoss[];
};

async function fetchMarketProfitLoss(
  tradeExecutor: Address,
  marketId: Address,
): Promise<SeerPortfolioPlResponse | null> {
  const params = new URLSearchParams({
    account: tradeExecutor,
    chainId: String(CHAIN_ID),
    period: "all",
    collateralProfile: "default",
    marketId,
  });

  const response = await fetch(
    `https://app.seer.pm/.netlify/functions/get-portfolio-pl?${params.toString()}`,
    { next: { revalidate: 300 } },
  );

  if (!response.ok) {
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

export async function GET(req: NextRequest) {
  const tradeExecutor = req.nextUrl.searchParams.get("tradeExecutor");

  if (!tradeExecutor || !isAddress(tradeExecutor)) {
    return NextResponse.json(
      { error: "A valid tradeExecutor address is required" },
      { status: 400 },
    );
  }

  try {
    const marketsPnl = await Promise.all(
      markets.map(async (market): Promise<MarketProfitLoss> => {
        const portfolio = await fetchMarketProfitLoss(
          tradeExecutor,
          market.marketId,
        );

        return {
          name: market.name,
          marketId: market.marketId,
          pnl: portfolio?.pnl ?? 0,
          portfolio,
        };
      }),
    );

    const res = NextResponse.json({ markets: marketsPnl });
    res.headers.set("Access-Control-Allow-Origin", "*");
    return res;
  } catch (error) {
    console.error("profit-loss", error);
    return NextResponse.json(
      { error: "Failed to fetch profit and loss data" },
      { status: 500 },
    );
  }
}
