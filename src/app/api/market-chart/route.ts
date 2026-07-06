import { NextResponse } from "next/server";

import { applyCdnCacheHeaders } from "../applyCdnCacheHeaders";

import { fetchMarketChartData } from "./fetchMarketChartData";

export const revalidate = 300;

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
  const data = await fetchMarketChartData(false);

  const res = NextResponse.json({ data });
  res.headers.set("Access-Control-Allow-Origin", "*");
  applyCdnCacheHeaders(res);
  return res;
}
