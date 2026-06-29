import { markets } from "@/consts/markets";

const chainId = "100";

export async function fetchMarketChartData(fresh: boolean) {
  return Promise.all(
    markets.map(async (market) => {
      const upstreamUrl =
        `https://app.seer.pm/.netlify/functions/market-chart` +
        `?marketId=${market.marketId}&chainId=${chainId}${fresh ? "&fresh=true" : ""}`;

      const upstream = await fetch(upstreamUrl, { cache: "no-store" });
      return await upstream.json();
    }),
  );
}
