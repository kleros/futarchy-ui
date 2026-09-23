"use client";

import { useLayoutEffect, useState, useSyncExternalStore } from "react";

import {
  type QueryClient,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { type IChartData } from "@/lib/chartData";

import { type IMarket } from "@/consts/markets";

export type { IChartData } from "@/lib/chartData";

export const CHART_DATA_QUERY_KEY = ["chart-data"] as const;
const CHART_DATA_FRESH_QUERY_KEY = ["chart-data", "fresh"] as const;
const CHART_DATA_STORAGE_KEY = "chart-data-cache-v2";

const CHART_DATA_REFETCH_INTERVAL_MS = 5 * 60 * 1000;
const CHART_POLL_INTERVAL_MS = 3_000;
const CHART_POLL_MAX_ATTEMPTS = 20;

async function fetchChartData(fresh = false) {
  const url = fresh ? "api/market-chart/fresh" : "api/market-chart";
  const { data }: { data: IChartData[] } = await fetch(
    url,
    fresh ? { cache: "no-store" } : undefined,
  ).then((res) => res.json());
  return data;
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

/**
 * Per market, keeps whichever series ends on the later timestamp. A trade that
 * lands inside the current bucket revises that bucket's value without moving
 * its timestamp, so a tie is broken towards the uncached response.
 */
function mergeChartData(
  previous: IChartData[] | undefined,
  next: IChartData[],
  nextIsFresh: boolean,
): IChartData[] {
  if (!previous?.length) return next;

  return next.map((entry) =>
    Object.fromEntries(
      Object.entries(entry).map(([marketName, nextMarket]) => {
        const previousMarket = previous.find((item) => item[marketName])?.[
          marketName
        ];
        if (!previousMarket) return [marketName, nextMarket];

        const previousTimestamp = previousMarket.data.at(-1)?.timestamp;
        const nextTimestamp = nextMarket.data.at(-1)?.timestamp;

        if (nextTimestamp === undefined) return [marketName, previousMarket];
        if (previousTimestamp === undefined) return [marketName, nextMarket];
        if (nextTimestamp !== previousTimestamp) {
          return [
            marketName,
            nextTimestamp > previousTimestamp ? nextMarket : previousMarket,
          ];
        }
        return [marketName, nextIsFresh ? nextMarket : previousMarket];
      }),
    ),
  );
}

/**
 * Folds a response into what is already on screen and persists the result.
 */
function mergeWithCurrent(
  queryClient: QueryClient,
  next: IChartData[],
  nextIsFresh: boolean,
): IChartData[] {
  const previous =
    queryClient.getQueryData<IChartData[]>(CHART_DATA_QUERY_KEY) ??
    readChartCache();
  const merged = mergeChartData(previous, next, nextIsFresh);
  writeChartCache(merged);
  return merged;
}

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

// first poll to finish must not clear the flag for the one still running.
let activeChartPolls = 0;
const chartPollListeners = new Set<() => void>();

function setActiveChartPolls(delta: number) {
  activeChartPolls += delta;
  chartPollListeners.forEach((listener) => listener());
}

function subscribeToChartPolling(listener: () => void) {
  chartPollListeners.add(listener);
  return () => {
    chartPollListeners.delete(listener);
  };
}

const getChartPollingSnapshot = () => activeChartPolls > 0;
const getChartPollingServerSnapshot = () => false;

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
  if (marketNames.length === 0) return;

  const baseline = queryClient.getQueryData<IChartData[]>(CHART_DATA_QUERY_KEY);
  const previousByMarket = Object.fromEntries(
    marketNames.map((name) => [name, getMarketChartSnapshot(baseline, name)]),
  );
  const pendingMarkets = new Set(marketNames);

  setActiveChartPolls(1);
  try {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const data = await fetchChartData(true);
      const merged = mergeWithCurrent(queryClient, data, true);
      queryClient.setQueryData(CHART_DATA_QUERY_KEY, merged);

      // Keep updating the chart as new data for each pending market arrives.
      for (const name of marketNames) {
        if (
          pendingMarkets.has(name) &&
          hasMarketChartUpdated(previousByMarket[name], merged, name)
        ) {
          pendingMarkets.delete(name);
        }
      }

      if (pendingMarkets.size === 0) return;

      if (attempt < maxAttempts - 1) {
        await sleep(intervalMs);
      }
    }
  } finally {
    setActiveChartPolls(-1);
  }
}

export const useChartData = (
  _markets: Array<IMarket>,
  options?: { initialPlaceholder?: IChartData[] },
) => {
  const queryClient = useQueryClient();
  const [placeholderData, setPlaceholderData] = useState<
    IChartData[] | undefined
  >(options?.initialPlaceholder);

  useLayoutEffect(() => {
    if (placeholderData) return;
    const cached = readChartCache();
    if (cached) setPlaceholderData(cached);
  }, [placeholderData]);

  const query = useQuery<IChartData[]>({
    queryKey: CHART_DATA_QUERY_KEY,
    queryFn: async () => {
      const data = await fetchChartData();
      return mergeWithCurrent(queryClient, data, false);
    },
    placeholderData,
    staleTime: CHART_DATA_REFETCH_INTERVAL_MS,
    refetchInterval: CHART_DATA_REFETCH_INTERVAL_MS,
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
  });

  const { isFetching: isRefreshing } = useQuery<IChartData[]>({
    queryKey: CHART_DATA_FRESH_QUERY_KEY,
    queryFn: async () => {
      const data = await fetchChartData(true);
      queryClient.setQueryData(
        CHART_DATA_QUERY_KEY,
        mergeWithCurrent(queryClient, data, true),
      );
      return data;
    },
    staleTime: CHART_DATA_REFETCH_INTERVAL_MS,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const isPollingAfterTrade = useSyncExternalStore(
    subscribeToChartPolling,
    getChartPollingSnapshot,
    getChartPollingServerSnapshot,
  );

  return {
    data: query.data,
    isRefreshing: isRefreshing || isPollingAfterTrade,
  };
};
