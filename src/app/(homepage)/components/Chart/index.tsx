"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

import { useTheme } from "next-themes";

import {
  createChart,
  type ISeriesApi,
  LineSeries,
  LineStyle,
  UTCTimestamp,
} from "lightweight-charts";

import { type IChartData } from "@/hooks/useChartData";

import { cn, shortenName } from "@/utils";

import { IMarket, startTime, endTime } from "@/consts/markets";

import Legend from "./Legend";

export type MarketsData = Record<
  string,
  {
    market: IMarket;
    data: Array<{ timestamp: number; value: number }>;
  }
>;

const withAlpha = (hex: string, alpha: number) => {
  const normalized = hex.replace("#", "");
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const Chart: React.FC<{ data: IChartData[] }> = ({ data }) => {
  const { theme } = useTheme();
  const marketNames = useMemo(() => {
    // Extract all market names from the data
    return data.flatMap((marketData) => Object.keys(marketData));
  }, [data]);

  const [visibleMarkets, setVisibleMarkets] = useState<Set<string>>(
    new Set(marketNames),
  );

  React.useEffect(() => {
    setVisibleMarkets(new Set(marketNames));
  }, [marketNames]);

  const handleToggleMarket = (marketName: string) => {
    setVisibleMarkets((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(marketName)) {
        newSet.delete(marketName);
      } else {
        newSet.add(marketName);
      }
      return newSet;
    });
  };

  const accentColor = useMemo(() => {
    if (theme === "light") return "#999";
    else return "#BECCE5";
  }, [theme]);

  const gridLinesColor = useMemo(() => {
    if (theme === "light") return "#e5e5e5";
    else return "#392C74";
  }, [theme]);

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const seriesRefMap = useRef<Record<string, ISeriesApi<"Line">>>({});
  const seriesColorsRef = useRef<Record<string, string>>({});
  const seriesTitlesRef = useRef<Record<string, string>>({});
  const seriesOrderRef = useRef<Record<string, number>>({});
  const hoveredMarketRef = useRef<string | null>(null);
  const [hoveredMarket, setHoveredMarket] = useState<string | null>(null);

  const applySeriesHighlight = React.useCallback(
    (marketName: string | null) => {
      const map = seriesRefMap.current;
      const colors = seriesColorsRef.current;
      const orders = seriesOrderRef.current;
      const isResetting = marketName === null;

      Object.entries(map).forEach(([name, s]) => {
        const baseColor = colors[name];
        if (!baseColor) return;

        const isHovered = name === marketName;
        s.applyOptions({
          lineWidth: isResetting ? 2 : isHovered ? 3 : 1,
          color:
            isResetting || isHovered ? baseColor : withAlpha(baseColor, 0.2),
          title: isHovered ? (seriesTitlesRef.current[name] ?? name) : "",
          lastValueVisible: isHovered,
          priceLineVisible: isHovered,
          priceLineStyle: LineStyle.Dashed,
        });
        s.setSeriesOrder(isHovered ? 999 : (orders[name] ?? 0));
      });
    },
    [],
  );

  const handleHoverMarket = React.useCallback(
    (marketName: string | null) => {
      hoveredMarketRef.current = marketName;
      setHoveredMarket(marketName);
      applySeriesHighlight(marketName);
    },
    [applySeriesHighlight],
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [series, marketsData] = useMemo(() => {
    if (!data.length) return [[], {}];
    // Combine all market data
    const marketsData: MarketsData = {};
    data.forEach((marketData) => {
      Object.entries(marketData).forEach(([marketName, marketInfo]) => {
        marketsData[marketName] = marketInfo;
      });
    });

    // Find the latest timestamp across all markets
    const latestTimestamp = Math.min(Date.now() / 1000, endTime);

    // Generate common timestamps for all markets
    // DEV: chart start time
    const timestamps = getTimestamps(startTime, latestTimestamp);

    const seriesData: Record<
      string,
      { info: IMarket; data: Array<{ time: UTCTimestamp; value: number }> }
    > = {};

    Object.entries(marketsData).forEach(([marketName, marketInfo]) => {
      seriesData[marketName] = { info: marketInfo.market, data: [] };
    });

    // Process data for each market
    timestamps.forEach((timestamp) => {
      Object.entries(marketsData).forEach(([marketName, marketInfo]) => {
        const { data, market } = marketInfo;

        const maxValue = market.maxValue;

        // Find valid start index (skip extreme values)
        let validStartIndex = 0;
        for (let i = 0; i < data.length; i++) {
          const isExtreme = data[i].value === maxValue || data[i].value < 0.1;
          if (!isExtreme && i > 0) {
            validStartIndex = i;
            break;
          }
        }

        const normalizedData = data.slice(validStartIndex);

        if (normalizedData.length === 0) {
          seriesData[marketName].data.push({
            time: timestamp as UTCTimestamp,
            value: 0,
          });
          return;
        }

        // Find the closest data point for this timestamp
        let closestDataPoint = normalizedData[0];
        for (const point of normalizedData) {
          if (point.timestamp <= timestamp) {
            closestDataPoint = point;
          } else {
            break;
          }
        }

        seriesData[marketName].data.push({
          time: timestamp as UTCTimestamp,
          value: closestDataPoint.value,
        });
      });
    });

    return [seriesData, marketsData];
  }, [data]);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef?.current?.clientWidth });
    };

    const chart = createChart(chartContainerRef?.current, {
      layout: {
        background: {
          color: "transparent",
        },
        textColor: accentColor,
      },
      width: chartContainerRef?.current?.clientWidth,
      height: chartContainerRef?.current?.clientHeight ?? 400,
      autoSize: true,
      rightPriceScale: {
        borderVisible: false,
        visible: true,
        ensureEdgeTickMarksVisible: true,
        minimumWidth: 52,
      },
      localization: {
        priceFormatter: (val: number) => `${val.toFixed(2)}%`,
      },
      leftPriceScale: {
        borderVisible: false,
        visible: false,
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        rightOffset: 25,
      },
      grid: {
        vertLines: {
          color: gridLinesColor,
          style: LineStyle.SparseDotted,
        },
        horzLines: {
          color: gridLinesColor,
          style: LineStyle.SparseDotted,
        },
      },
    });
    chart.timeScale().fitContent();

    seriesRefMap.current = {};
    seriesColorsRef.current = {};
    seriesTitlesRef.current = {};
    seriesOrderRef.current = {};
    const visibleSeriesEntries = Object.entries(series)
      .filter(([, marketData]) => visibleMarkets.has(marketData.info.name))
      .sort(([, a], [, b]) => {
        const aValue = a.data.at(-1)?.value ?? 0;
        const bValue = b.data.at(-1)?.value ?? 0;
        if (aValue !== bValue) return aValue - bValue;
        return a.info.name.localeCompare(b.info.name);
      });

    visibleSeriesEntries.forEach(([marketName, marketData], orderIndex) => {
      const lineSeries = chart.addSeries(LineSeries, {
        color: marketData.info.color,
        lineWidth: 2,
        lastValueVisible: false,
        priceLineVisible: false,
      });
      lineSeries.setData(
        marketData.data as Array<{ time: UTCTimestamp; value: number }>,
      );
      lineSeries.setSeriesOrder(orderIndex);
      seriesRefMap.current[marketName] = lineSeries;
      seriesColorsRef.current[marketName] = marketData.info.color;
      seriesTitlesRef.current[marketName] = shortenName(marketName);
      seriesOrderRef.current[marketName] = orderIndex;
    });

    applySeriesHighlight(hoveredMarketRef.current);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      seriesRefMap.current = {};
      seriesColorsRef.current = {};
      seriesTitlesRef.current = {};
      seriesOrderRef.current = {};
      chart.remove();
    };
  }, [
    series,
    accentColor,
    visibleMarkets,
    gridLinesColor,
    applySeriesHighlight,
  ]);

  return (
    <div className="mt-6 flex size-full flex-col">
      <h2 className="text-klerosUIComponentsPrimaryText text-base font-semibold">
        Market Estimate Scores
      </h2>
      <div className="flex flex-col gap-2 md:h-[400px] md:flex-row">
        <div className="h-[280px] min-w-0 md:h-full md:min-h-0 md:flex-1">
          <div ref={chartContainerRef} className="size-full" />
        </div>
        <div
          className={cn(
            "bg-klerosUIComponentsWhiteBackground rounded-base flex min-h-0 flex-col",
            "overflow-hidden p-2 max-md:h-32 md:h-full md:w-44 md:shrink-0",
          )}
        >
          <Legend
            marketsData={marketsData}
            visibleMarkets={visibleMarkets}
            hoveredMarket={hoveredMarket}
            onToggleMarket={handleToggleMarket}
            onHoverMarket={handleHoverMarket}
          />
        </div>
      </div>
    </div>
  );
};

const getTimestamps = (firstTimestamp: number, lastTimestamp: number) => {
  let currentTimestamp = firstTimestamp;
  const timestamps: Array<number> = [];
  while (currentTimestamp <= lastTimestamp) {
    timestamps.push(currentTimestamp);
    currentTimestamp += 60 * 60 * 4;
  }
  // if the startTime is in future
  if (firstTimestamp < lastTimestamp) {
    timestamps.push(lastTimestamp);
  }
  return timestamps;
};

export default Chart;
