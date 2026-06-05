"use client";

import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import WithHelpTooltip from "@/components/WithHelpTooltip";

import StatsBarIcon from "@/assets/svg/stats-bar.svg";

import { formatBigNumbers } from "@/utils";

type MarketsLiquidityResponse = {
  data: { name: string; id: string; liquidityUSD: number }[];
  averageLiquidityUSD: number;
};

const LiquiditySummary: React.FC = () => {
  const { data, isLoading, isError } = useQuery<MarketsLiquidityResponse>({
    queryKey: ["markets-liquidity"],
    queryFn: async () => {
      const response = await fetch("api/markets-liquidity");

      if (!response.ok) {
        throw new Error("Failed to fetch markets liquidity");
      }

      return response.json();
    },
    staleTime: 300_000,
  });

  const tooltipText = useMemo(() => {
    if (!data?.data.length) return "Liquidity data unavailable";

    const lines = data.data.map(
      (market) => `${market.name}: $${formatBigNumbers(market.liquidityUSD)}`,
    );

    return ["Liquidity by market:", "", ...lines].join("\n");
  }, [data]);

  const averageLabel = useMemo(() => {
    if (isLoading) return "...";
    if (isError || !data) return "N/A";
    return `$${formatBigNumbers(data.averageLiquidityUSD)}`;
  }, [data, isError, isLoading]);

  return (
    <div className="flex items-center gap-2">
      <StatsBarIcon className="size-3.5" />
      <span className="text-klerosUIComponentsSecondaryText text-sm">
        Liquidity (avg):
      </span>
      <WithHelpTooltip
        tooltipMsg={tooltipText}
        tooltipProps={{
          delay: 0,
          closeDelay: 300,
          className: "max-w-94 [&>small]:text-xs [&>small]:whitespace-pre-line",
        }}
      >
        <span className="text-klerosUIComponentsPrimaryText cursor-default text-sm font-semibold">
          {averageLabel}
        </span>
      </WithHelpTooltip>
    </div>
  );
};

export default LiquiditySummary;
