import { NextResponse } from "next/server";

export function applyCdnCacheHeaders(res: NextResponse) {
  res.headers.set(
    "Netlify-CDN-Cache-Control",
    "public, max-age=300, stale-while-revalidate=86400, durable",
  );
  res.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
}
