export const runtime = "edge";

import { NextResponse, NextRequest } from "next/server";

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
  const { searchParams } = new URL(req.url);
  const marketId = searchParams.get("marketId");
  const chainId = searchParams.get("chainId");

  const upstream = await fetch(
    `https://app.seer.pm/.netlify/functions/market-chart?marketId=${marketId}&chainId=${chainId}`,
  );
  const data = await upstream.json();

  const res = NextResponse.json(data, { status: upstream.status });
  res.headers.set("Access-Control-Allow-Origin", "*");
  return res;
}
