"use client";

import { useWinningAnswers } from "@/hooks/useWinningAnswers";

import { cn } from "@/utils";
import { getReadableTextColor } from "@/utils/getReadableTextColor";

const ResolvedMarketsBanner: React.FC = () => {
  const { winningMarkets, isLoading } = useWinningAnswers();

  if (isLoading || winningMarkets.length === 0) {
    return null;
  }

  return (
    <div className="border-b-klerosUIComponentsStroke w-full space-y-2 border-b pb-8">
      <h2 className="text-klerosUIComponentsPrimaryText text-base font-semibold">
        Market resolved:
      </h2>
      <div className="flex flex-row flex-wrap items-center gap-2">
        {winningMarkets.map(({ market, finalAnswer }) => (
          <div
            className={cn(
              "rounded-base h-fit px-1 py-0.5",
              "flex flex-row gap-2",
            )}
            key={market.marketId}
            style={{
              backgroundColor: market.color,
            }}
          >
            <p
              className="text-xs"
              style={{ color: getReadableTextColor(market.color) }}
            >
              {market.name}
              <span
                className="mx-1 text-xs"
                style={{ color: getReadableTextColor(market.color) }}
              >
                |
              </span>
              {finalAnswer}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResolvedMarketsBanner;
