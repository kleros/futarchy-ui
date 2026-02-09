import { getStore } from "@netlify/blobs";

/**
 * Cache TTL in milliseconds (24 hours).
 */
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

/**
 * RealT property UUIDs to fetch.
 */
const REALT_UUIDS = [
  "0x0f388d7e65a969dbcbfab21bc3ab6629af78f4cf",
  "0x5c4e3fa9704d4212c6434190af6379cfbda47e13",
  "0x854a0cfa24012937d3d15682ecc3d5b474bfa97e",
  "0xd8b19f31186fc7350be018651aa1383175923bb3",
  "0xc7697f5e86a102eaf4000719a2dc477d65beea7d",
  "0x4ae9d3343bbc6a894b7ee7f843c224c953f1661b",
  "0x90d280b6456f8233e115e6aabb2ca89249dafd39",
  "0x19f824662ba9df78e368022f085b708fccc201c8",
  "0xa83cbd26964ea953f86c741871a1ab2a256cb82d",
] as const;

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

    const results = await Promise.all(
      REALT_UUIDS.map(async (uuid) => {
        const res = await fetch(`${apiUrl}/${uuid}`, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        });

        if (!res.ok) {
          throw new Error(`RealT API failed for ${uuid}: ${res.status}`);
        }

        const data = await res.json();
        return [uuid, data] as const;
      }),
    );

    // Merge into a single object keyed by UUID
    const mergedData = Object.fromEntries(results);
    // Persist fresh response
    await store.setJSON("response", {
      data: mergedData,
      fetchedAt: now,
    } satisfies CachedResponse);

    return Response.json(mergedData, {
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
