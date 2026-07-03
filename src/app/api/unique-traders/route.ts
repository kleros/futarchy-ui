export const revalidate = 300;

import { NextResponse } from "next/server";
import type { Address, Hex } from "viem";

import { parentMarket } from "@/consts/markets";

const CHAIN_ID = 100;

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

type TokenDataResponse = {
  topHolders: Record<Hex, Array<{ address: Address; balance: number }>>;
};

export type UniqueTradersResponse = {
  uniqueTraders: number;
};

async function fetchTokensData(): Promise<TokenDataResponse> {
  const res = await fetch(
    `https://app.seer.pm/.netlify/functions/get-token-transactions?chainId=${CHAIN_ID}&marketId=${parentMarket}`,
    { next: { revalidate: 300 } },
  );

  if (!res.ok) {
    throw new Error(`Seer token data request failed: ${res.status}`);
  }

  return res.json();
}

export async function GET() {
  try {
    const data = await fetchTokensData();
    const traders = new Set<string>();

    if (data.topHolders) {
      for (const balances of Object.values(data.topHolders)) {
        for (const entry of balances) {
          traders.add(entry.address.toLowerCase());
        }
      }
    }

    const res = NextResponse.json({
      uniqueTraders: traders.size,
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
      { error: "Failed to fetch tokens data" },
      { status: 500 },
    );
  }
}
