"use client";

import { useLayoutEffect, useState } from "react";

import { type QueryClient, useQuery } from "@tanstack/react-query";
import { formatUnits } from "viem";

import { IMarket, markets as chartMarkets } from "@/consts/markets";

interface IDataPoint {
  pool: {
    id: string;
    token0: {
      id: string;
      name: string;
    };
    token1: {
      id: string;
      name: string;
    };
    liquidity: `${number}`;
  };
  liquidity: `${number}`;
  sqrtPrice: `${number}`;
  token0Price: `${number}`;
  token1Price: `${number}`;
  periodStartUnix: number;
}

type IReturn = Array<Array<IDataPoint>>;

export type IChartData = Record<
  string,
  { market: IMarket; data: Array<{ timestamp: number; value: number }> }
>;

export const CHART_DATA_QUERY_KEY = ["chart-data"] as const;
const CHART_DATA_STORAGE_KEY = "chart-data-cache";

const CHART_DATA_REFETCH_INTERVAL_MS = 5 * 60 * 1000;
const CHART_POLL_INTERVAL_MS = 3_000;
const CHART_POLL_MAX_ATTEMPTS = 20;

const getSqrtPrices = (
  sqrtPrice: string,
): { token0Price: `${number}`; token1Price: `${number}` } => {
  const sqrtPriceBigInt = BigInt(sqrtPrice);
  const token0Price = formatUnits(
    (2n ** 192n * 10n ** 18n) / (sqrtPriceBigInt * sqrtPriceBigInt),
    18,
  ) as `${number}`;
  const token1Price = formatUnits(
    (sqrtPriceBigInt * sqrtPriceBigInt * 10n ** 18n) / 2n ** 192n,
    18,
  ) as `${number}`;
  return { token0Price, token1Price };
};

async function fetchChartData(markets: Array<IMarket>, fresh = false) {
  const url = fresh ? "api/market-chart/fresh" : "api/market-chart";
  const { data }: { data: IReturn[] } = await fetch(
    url,
    fresh ? { cache: "no-store" } : undefined,
  ).then((res) => res.json());
  return data.map((rawData: IReturn, i: number) => {
    const market = markets[i];

    const processed: IChartData[""]["data"] = rawData[1].map((dataPoint) => {
      let token0Price = dataPoint.token0Price;
      let token1Price = dataPoint.token1Price;
      const sqrtPrice = dataPoint.sqrtPrice;
      if (
        token0Price === "0" &&
        token1Price === "0" &&
        sqrtPrice &&
        sqrtPrice !== "0"
      ) {
        ({ token0Price, token1Price } = getSqrtPrices(sqrtPrice));
      }
      return {
        timestamp: dataPoint.periodStartUnix,
        value:
          parseFloat(
            (dataPoint.pool.token0.id.toLowerCase() ===
            market.underlyingToken.toLowerCase()
              ? token0Price
              : token1Price
            ).slice(0, 9),
          ) * market.maxValue,
      };
    });
    return { [market.name]: { market, data: processed } };
  });
}

export function readChartCache(): IChartData[] | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = localStorage.getItem(CHART_DATA_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as IChartData[]) : undefined;
  } catch {
    return undefined;
  }
}

function writeChartCache(data: IChartData[]) {
  try {
    localStorage.setItem(CHART_DATA_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore quota errors
  }
}

type ChartPointSnapshot = { timestamp: number; value: number };

function getMarketChartSnapshot(
  data: IChartData[] | undefined,
  marketName: string,
) {
  const entry = data?.find((item) => item[marketName])?.[marketName];
  const lastPoint = entry?.data.at(-1);
  if (!lastPoint) return null;
  return { timestamp: lastPoint.timestamp, value: lastPoint.value };
}

function hasMarketChartUpdated(
  previous: ChartPointSnapshot | null,
  next: IChartData[],
  marketName: string,
) {
  const nextSnapshot = getMarketChartSnapshot(next, marketName);
  if (!nextSnapshot) return false;
  if (!previous) return true;

  return (
    nextSnapshot.timestamp > previous.timestamp ||
    nextSnapshot.value !== previous.value
  );
}

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

interface PollChartDataUntilUpdatedOptions {
  queryClient: QueryClient;
  marketNames: string[];
  intervalMs?: number;
  maxAttempts?: number;
}

export async function pollChartDataUntilUpdated({
  queryClient,
  marketNames,
  intervalMs = CHART_POLL_INTERVAL_MS,
  maxAttempts = CHART_POLL_MAX_ATTEMPTS,
}: PollChartDataUntilUpdatedOptions): Promise<void> {
  console.log("Starting chart poll");

  if (marketNames.length === 0) return;

  const baseline = queryClient.getQueryData<IChartData[]>(CHART_DATA_QUERY_KEY);
  const previousByMarket = Object.fromEntries(
    marketNames.map((name) => [name, getMarketChartSnapshot(baseline, name)]),
  );
  const pendingMarkets = new Set(marketNames);

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    console.log("Chart poll attempt:", attempt);

    const data = await fetchChartData(chartMarkets, true);
    writeChartCache(data);
    queryClient.setQueryData(CHART_DATA_QUERY_KEY, data);

    // will keep updating the chart as new data for each pending market arrives
    for (const name of marketNames) {
      if (
        pendingMarkets.has(name) &&
        hasMarketChartUpdated(previousByMarket[name], data, name)
      ) {
        pendingMarkets.delete(name);
      }
    }

    if (pendingMarkets.size === 0) {
      console.log("Chart polling finished.");

      return;
    }

    if (attempt < maxAttempts - 1) {
      await sleep(intervalMs);
    }
  }
}

export const useChartData = (
  markets: Array<IMarket>,
  options?: { initialPlaceholder?: IChartData[] },
) => {
  const [placeholderData, setPlaceholderData] = useState<
    IChartData[] | undefined
  >(options?.initialPlaceholder);

  useLayoutEffect(() => {
    if (placeholderData) return;
    const cached = readChartCache();
    if (cached) setPlaceholderData(cached);
  }, [placeholderData]);

  return useQuery<IChartData[]>({
    queryKey: CHART_DATA_QUERY_KEY,
    queryFn: async () => {
      const data = await fetchChartData(markets);
      writeChartCache(data);
      return data;
    },
    placeholderData,
    staleTime: CHART_DATA_REFETCH_INTERVAL_MS,
    refetchInterval: CHART_DATA_REFETCH_INTERVAL_MS,
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
  });
};
