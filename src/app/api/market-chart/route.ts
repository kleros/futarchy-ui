import { NextResponse } from "next/server";

import { markets } from "@/consts/markets";

const chainId = "100";
const CHART_CDN_MAX_AGE_SECONDS = 60;
const CHART_CDN_STALE_WHILE_REVALIDATE_SECONDS = 300;

const chartResponseCacheHeaders = (fresh: boolean) => {
  if (fresh) {
    return {
      "Netlify-CDN-Cache-Control": "no-store",
      "Cache-Control": "no-store",
    };
  }

  return {
    "Netlify-CDN-Cache-Control":
      `public, max-age=${CHART_CDN_MAX_AGE_SECONDS}, ` +
      `stale-while-revalidate=${CHART_CDN_STALE_WHILE_REVALIDATE_SECONDS}, durable`,
    "Cache-Control": "public, max-age=0, must-revalidate",
  };
};

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

      const upstream = await fetch(
        upstreamUrl,
        fresh
          ? { cache: "no-store" }
          : { next: { revalidate: CHART_CDN_MAX_AGE_SECONDS } },
      );
      return await upstream.json();
    }),
  );

  const res = NextResponse.json({ data });
  res.headers.set("Access-Control-Allow-Origin", "*");
  for (const [header, value] of Object.entries(
    chartResponseCacheHeaders(fresh),
  )) {
    res.headers.set(header, value);
  }
  return res;
}
