"use client";

import React, { useMemo } from "react";

import { useTheme } from "next-themes";

import { format } from "date-fns";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { type IChartData } from "@/hooks/useChartData";

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

  const [series, maxYDomain, marketsData] = useMemo(() => {
    if (!data.length) return [[], 0];
    let maxYAxis = 0;
    // Combine all market data
    const marketsData: MarketsData = {};
    data.forEach((marketData) => {
      Object.entries(marketData).forEach(([marketName, marketInfo]) => {
        marketsData[marketName] = marketInfo;
      });
    });

    // Find the earliest timestamp across all markets
    const earliestTimestamp = Math.min(
      ...Object.values(marketsData).map((market) =>
        market.data.length > 0 ? market.data[0].timestamp : Infinity,
      ),
    );

    // Find the latest timestamp across all markets
    const latestTimestamp = Date.now() / 1000;

    // Generate common timestamps for all markets
    const timestamps = getTimestamps(earliestTimestamp, latestTimestamp);

    // Process data for each market
    const processedData = timestamps.map((timestamp) => {
      const dataPoint: Record<string, number> = { timestamp };

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
          dataPoint[marketName] = 0;
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
        if (closestDataPoint.value > maxYAxis)
          maxYAxis = closestDataPoint.value;
        dataPoint[marketName] = closestDataPoint.value;
      });

      return dataPoint;
    });

    maxYAxis = Math.ceil(maxYAxis);
    return [processedData, maxYAxis, marketsData];
  }, [data]);

  const accentColor = useMemo(() => {
    if (theme === "light") return "#999";
    else return "#BECCE5";
  }, [theme]);

  return (
    <div className="mt-6 flex size-full flex-col">
      <Legend {...{ marketsData }} />
      <h2 className="text-klerosUIComponentsPrimaryText mt-6 mb-4 text-base font-semibold">
        Market Estimate Scores
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={series}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          {marketNames.map((marketName) => (
            <Line
              key={marketName}
              dataKey={marketName}
              type="monotone"
              stroke={marketsData?.[marketName].market.color ?? "#009AFF"}
              dot={false}
            />
          ))}
          <XAxis
            dataKey="timestamp"
            type="number"
            scale="time"
            tickFormatter={(timestamp) =>
              format(new Date(timestamp * 1000), "dd LLL")
            }
            tick={{ fill: accentColor, fontSize: "12px" }}
            domain={["dataMin", "dataMax"]}
            axisLine={false}
            tickSize={0}
            tickMargin={16}
          />
          <YAxis
            // scale is required to be 'linear' for Tooltip position calculation to work.
            scale="linear"
            domain={[0, maxYDomain ?? "auto"]}
            axisLine={false}
            tickSize={0}
            tickMargin={16}
            width={30}
            tick={{ fill: accentColor, fontSize: "12px" }}
          />
          <Tooltip
            defaultIndex={series.length - 1}
            cursor={{ stroke: accentColor, strokeWidth: 1, opacity: 0.5 }}
            content={({ active, payload: payloads, viewBox, coordinate }) => {
              const isVisible =
                active && payloads && payloads.length && viewBox?.height;

              return isVisible
                ? payloads.map(({ color, value }, index) => (
                    <div
                      key={`tooltip-${index}`}
                      className="rounded-base absolute top-0 left-0 -translate-x-full -translate-y-1/2 px-2 py-0.75"
                      style={{
                        visibility: isVisible ? "visible" : "hidden",
                        backgroundColor: isVisible ? color : "transparent",
                        top:
                          viewBox?.height && value && maxYDomain
                            ? viewBox?.height -
                              ((value as number) / maxYDomain) * viewBox?.height
                            : coordinate?.y,
                        left: coordinate?.x,
                      }}
                    >
                      {isVisible ? (
                        <p className="text-klerosUIComponentsLightBackground text-right text-xs">
                          {Number(value).toFixed(2)}
                        </p>
                      ) : null}
                    </div>
                  ))
                : null;
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const getTimestamps = (firstTimestamp: number, lastTimestamp: number) => {
  let currentTimestamp = firstTimestamp;
  const timestamps: Array<number> = [];
  while (currentTimestamp <= lastTimestamp) {
    timestamps.push(currentTimestamp);
    currentTimestamp += 60 * 60 * 12;
  }
  return timestamps;
};

export default Chart;
