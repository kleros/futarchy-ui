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

import { shortenName } from "@/utils";

import { IMarket, startTime, endTime } from "@/consts/markets";

import Legend from "./Legend";

export type MarketsData = Record<
  string,
  {
    market: IMarket;
    data: Array<{ timestamp: number; value: number }>;
  }
>;

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
  const seriesOrderRef = useRef<Record<string, number>>({});

  const handleHoverMarket = React.useCallback(
    (marketName: string | null) => {
      const map = seriesRefMap.current;
      const colors = seriesColorsRef.current;
      const orders = seriesOrderRef.current;
      const strokeColor = gridLinesColor;
      const isResetting = marketName === null;
      Object.entries(map).forEach(([name, s]) => {
        const isHovered = name === marketName;
        s.applyOptions({
          lineWidth: isHovered ? 4 : 2,
          color:
            (isResetting || isHovered ? colors[name] : strokeColor) ??
            strokeColor,
        });
        s.setSeriesOrder(isHovered ? 999 : (orders[name] ?? 0));
      });
    },
    [gridLinesColor],
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
      height: 400,
      autoSize: true,
      rightPriceScale: {
        borderVisible: false,
        visible: true,
        ensureEdgeTickMarksVisible: true,
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
    seriesOrderRef.current = {};
    let orderIndex = 0;
    Object.entries(series).forEach(([marketName, marketData]) => {
      if (visibleMarkets.has(marketData.info.name)) {
        const lineSeries = chart.addSeries(LineSeries, {
          color: marketData.info.color,
          lineWidth: 2,
          title: shortenName(marketName),
        });
        lineSeries.setData(
          marketData.data as Array<{ time: UTCTimestamp; value: number }>,
        );
        seriesRefMap.current[marketName] = lineSeries;
        seriesColorsRef.current[marketName] = marketData.info.color;
        seriesOrderRef.current[marketName] = orderIndex++;
      }
    });

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      seriesRefMap.current = {};
      seriesColorsRef.current = {};
      seriesOrderRef.current = {};
      chart.remove();
    };
  }, [series, accentColor, visibleMarkets, gridLinesColor]);

  return (
    <div className="mt-6 flex size-full flex-col">
      <Legend
        marketsData={marketsData}
        visibleMarkets={visibleMarkets}
        onToggleMarket={handleToggleMarket}
        onHoverMarket={handleHoverMarket}
      />
      <h2 className="text-klerosUIComponentsPrimaryText mt-6 mb-4 text-base font-semibold">
        Market Estimate Scores
      </h2>
      <div ref={chartContainerRef} />
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
