"use client";

import React, { useMemo, useState } from "react";

import { useTheme } from "next-themes";

import { Card } from "@kleros/ui-components-library";
import clsx from "clsx";
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const earliestTimestamp = Math.min(
      ...Object.values(marketsData).map((market) =>
        market.data.length > 0 ? market.data[0].timestamp : Infinity,
      ),
    );

    // Find the latest timestamp across all markets
    const latestTimestamp = Date.now() / 1000;

    // Generate common timestamps for all markets
    const timestamps = getTimestamps(1751328000, latestTimestamp);

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
      <Legend
        marketsData={marketsData}
        visibleMarkets={visibleMarkets}
        onToggleMarket={handleToggleMarket}
      />
      <h2 className="text-klerosUIComponentsPrimaryText mt-6 mb-4 text-base font-semibold">
        Market Estimate Scores
      </h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart
          data={series}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          {marketNames
            .filter((marketName) => visibleMarkets.has(marketName))
            .map((marketName) => (
              <Line
                key={marketName}
                dataKey={marketName}
                type="monotone"
                stroke={marketsData?.[marketName].market.color ?? "#009AFF"}
                // shown when tooltip is visible
                activeDot={{ strokeWidth: 0 }}
                dot={false}
                strokeWidth={1.5}
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
            domain={["auto", "auto"]}
            axisLine={false}
            tickSize={0}
            tickMargin={16}
            width={40}
            tick={{ fill: accentColor, fontSize: "12px" }}
          />
          <Tooltip
            wrapperStyle={{ zIndex: 10 }}
            cursor={{
              stroke: accentColor,
              strokeDasharray: "4",
              strokeWidth: 1,
              opacity: 0.5,
            }}
            content={({ active, payload: payloads, viewBox, label }) => {
              const isVisible =
                active && payloads && payloads?.length && viewBox?.height;

              return isVisible ? (
                <Card
                  className={clsx(
                    "h-fit w-fit p-2 px-3 shadow-md",
                    "flex flex-col gap-4",
                  )}
                >
                  <h3 className="text-klerosUIComponentsPrimaryText text-sm font-semibold">
                    {new Date(Number(label) * 1000).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "2-digit",
                        hour: "numeric",
                        minute: "numeric",
                        timeZone: "GMT",
                      },
                    )}
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {payloads.map(({ color, value, name }, index) => (
                      <li
                        className="flex items-center gap-2"
                        key={`${index}-${name}`}
                      >
                        <div
                          className="size-2 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <p className="text-klerosUIComponentsPrimaryText flex-1 grow text-sm">
                          {name}
                        </p>
                        <p className="text-klerosUIComponentsPrimaryText text-sm font-semibold">
                          {Number(value).toFixed(2)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </Card>
              ) : null;
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
    currentTimestamp += 60 * 60 * 4;
  }
  timestamps.push(lastTimestamp);
  return timestamps;
};

export default Chart;
