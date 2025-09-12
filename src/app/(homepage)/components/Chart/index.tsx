"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

import { useTheme } from "next-themes";

import {
  createChart,
  LineSeries,
  LineStyle,
  UTCTimestamp,
} from "lightweight-charts";

import { type IChartData } from "@/hooks/useChartData";

import { shortenName } from "@/utils";

import { IMarket } from "@/consts/markets";

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
    const latestTimestamp = Date.now() / 1000;

    // Generate common timestamps for all markets
    const timestamps = getTimestamps(1751328000, latestTimestamp);

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
      height: 300,
      autoSize: true,
      rightPriceScale: {
        borderVisible: false,
        visible: true,
      },
      leftPriceScale: {
        borderVisible: false,
        visible: false,
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
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

    Object.entries(series).forEach(([marketName, marketData]) => {
      if (visibleMarkets.has(marketData.info.name)) {
        const series = chart.addSeries(LineSeries, {
          color: marketData.info.color,
          lineWidth: 2,
          title: shortenName(marketName),
        });
        series.setData(
          marketData.data as Array<{ time: UTCTimestamp; value: number }>,
        );
      }
    });

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      chart.remove();
    };
  }, [series, accentColor, visibleMarkets, gridLinesColor]);

  return (
    <div className="mt-6 flex size-full flex-col">
      <Legend
        marketsData={marketsData}
        visibleMarkets={visibleMarkets}
        onToggleMarket={handleToggleMarket}
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
  timestamps.push(lastTimestamp);
  return timestamps;
};

export default Chart;
