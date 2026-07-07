"use client";

import { useRef } from "react";

import { readChartCache, useChartData } from "@/hooks/useChartData";

import Loader from "@/components/Loader";

import { isUndefined } from "@/utils";

import { markets } from "@/consts/markets";

import Chart from "./Chart";

const ChartSection: React.FC = () => {
  const initialPlaceholder = useRef(readChartCache()).current;
  const { data: chartData } = useChartData(markets, { initialPlaceholder });

  if (isUndefined(chartData)) {
    return (
      <div className="flex h-100 w-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  return <Chart data={chartData} />;
};

export default ChartSection;
