export const revalidate = 300;

import { NextResponse } from "next/server";

import { markets } from "@/consts/markets";

const chainId = "100";

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
  const data = await Promise.all(
    markets.map(async (market) => {
      const { marketId } = market;

      const upstream = await fetch(
        `https://app.seer.pm/.netlify/functions/market-chart?marketId=${marketId}&chainId=${chainId}`,
        { next: { revalidate: 300 } },
      );
      return await upstream.json();
    }),
  );

  const res = NextResponse.json({ data });
  res.headers.set("Access-Control-Allow-Origin", "*");
  return res;
}
