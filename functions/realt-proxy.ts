import { getStore } from "@netlify/blobs";

/**
 * Cache TTL in milliseconds (24 hours).
 */
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

/**
 * Edge route that proxies a rate-limited upstream API
 * (allowed to be called once per 24 hours), caches the
 * response using Netlify Blobs, and serves cached data
 * to all clients.
 *
 * @returns RealT properties data
 */
export default async function handler(): Promise<Response> {
  const store = getStore("realt-api-cache");
  const now = Date.now();

  type CachedResponse = {
    data: unknown;
    fetchedAt: number;
  };

  const apiUrl = process.env.REALT_API_URL;
  const apiKey = process.env.REALT_API_KEY;

  if (!apiUrl || !apiKey) {
    console.error("[realt-proxy] Missing required env vars", {
      UPSTREAM_API_URL: !!apiUrl,
      UPSTREAM_API_KEY: !!apiKey,
    });

    return new Response("Server misconfigured", { status: 500 });
  }

  // Read cached response
  const cached = (await store.get("response", {
    type: "json",
  })) as CachedResponse | null;

  // Serve cached response if still valid
  if (cached && now - cached.fetchedAt < CACHE_TTL_MS) {
    console.log("[realt-proxy] Serving from cache");
    return Response.json(cached.data, {
      headers: {
        "Cache-Control": "public, max-age=86400",
      },
    });
  }

  try {
    // Call realT API (should happen ~once per day)
    console.log("[realt-proxy] Calling RealT API");

    const res = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!res.ok) {
      throw new Error(`RealT API failed with status ${res.status}`);
    }

    const data = await res.json();

    // Persist fresh response
    await store.setJSON("response", {
      data,
      fetchedAt: now,
    } satisfies CachedResponse);

    return Response.json(data, {
      headers: {
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("[realt-proxy] RealT API fetch failed:", error);

    // serve stale cache if available
    if (cached) {
      return Response.json(cached.data, {
        headers: {
          "Cache-Control": "public, max-age=300",
        },
      });
    }

    return new Response("RealT API unavailable", { status: 502 });
  }
}
