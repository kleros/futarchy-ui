import { NextResponse } from "next/server";

import { fetchMarketChartData } from "./fetchMarketChartData";

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
  res.headers.set(
    "Netlify-CDN-Cache-Control",
    "public, max-age=60, stale-while-revalidate=300, durable",
  );
  res.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
  return res;
}
