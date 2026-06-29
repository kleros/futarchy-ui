import { NextResponse } from "next/server";

import { fetchMarketChartData } from "../fetchMarketChartData";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function GET() {
  const data = await fetchMarketChartData(true);

  const res = NextResponse.json({ data });
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Netlify-CDN-Cache-Control", "no-store");
  res.headers.set("CDN-Cache-Control", "no-store");
  res.headers.set("Cache-Control", "no-store");
  return res;
}
