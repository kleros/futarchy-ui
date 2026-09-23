"use client";

import { useRef } from "react";

import { readChartCache, useChartData } from "@/hooks/useChartData";

import { isUndefined } from "@/utils";

import { markets } from "@/consts/markets";

import Chart from "./Chart";
import ChartSkeleton from "./ChartSkeleton";

const ChartSection: React.FC = () => {
  const initialPlaceholder = useRef(readChartCache()).current;
  const { data: chartData, isRefreshing } = useChartData(markets, {
    initialPlaceholder,
  });

  if (isUndefined(chartData)) return <ChartSkeleton />;

  return <Chart data={chartData} {...{ isRefreshing }} />;
};

export default ChartSection;
