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

export async function GET(request: Request) {
  const fresh = new URL(request.url).searchParams.get("fresh") === "true";

  const data = await Promise.all(
    markets.map(async (market) => {
      const { marketId } = market;

      const upstreamUrl =
        `https://app.seer.pm/.netlify/functions/market-chart` +
        `?marketId=${marketId}&chainId=${chainId}${fresh ? "&fresh=true" : ""}`;

      const upstream = await fetch(upstreamUrl, { cache: "no-store" });
      return await upstream.json();
    }),
  );

  const res = NextResponse.json({ data });
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Cache-Control", "no-store");
  return res;
}
