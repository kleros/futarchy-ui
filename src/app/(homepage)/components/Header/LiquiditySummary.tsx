"use client";

import { useMemo } from "react";

import { Button, Modal } from "@kleros/ui-components-library";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useToggle } from "react-use";

import LightButton from "@/components/LightButton";
import WithHelpTooltip from "@/components/WithHelpTooltip";

import StatsBarIcon from "@/assets/svg/stats-bar.svg";

import { formatBigNumbers } from "@/utils";

type PoolBalance = {
  token0: { symbol: string; balance: number };
  token1: { symbol: string; balance: number };
};

type MarketLiquidity = {
  name: string;
  liquidityUSD: number;
  poolBalance: Array<PoolBalance | null>;
};

type MarketsLiquidityResponse = {
  data: MarketLiquidity[];
  averageLiquidityUSD: number;
};

function formatPoolBalance(pool: PoolBalance): string {
  // eslint-disable-next-line max-len
  return `${formatBigNumbers(pool.token0.balance)} ${pool.token0.symbol} / ${formatBigNumbers(pool.token1.balance)} ${pool.token1.symbol}`;
}

interface ILiquidityModal {
  isOpen: boolean;
  toggleIsOpen: () => void;
  markets: MarketLiquidity[];
  averageLiquidityUSD: number;
}

const LiquidityModal: React.FC<ILiquidityModal> = ({
  isOpen,
  toggleIsOpen,
  markets,
  averageLiquidityUSD,
}) => (
  <Modal
    className="relative h-fit w-full overflow-x-hidden p-8 px-2 md:w-162.5 md:px-8"
    onOpenChange={toggleIsOpen}
    {...{ isOpen }}
  >
    <div className="flex size-full flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-klerosUIComponentsPrimaryText text-2xl font-semibold">
          Liquidity by market
        </h2>
        <p className="text-klerosUIComponentsSecondaryText text-sm">
          Average: ${formatBigNumbers(averageLiquidityUSD)}
        </p>
      </div>

      <ul className="flex max-h-96 flex-col gap-3 overflow-y-auto pr-1">
        {markets.map((market) => {
          const pools = market.poolBalance
            .filter((pool): pool is PoolBalance => pool !== null)
            .map(formatPoolBalance);

          return (
            <li
              key={market.name}
              className="border-klerosUIComponentsStroke rounded-base border p-3"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-klerosUIComponentsPrimaryText text-sm font-semibold">
                  {market.name}
                </span>
                <span className="text-klerosUIComponentsPrimaryText shrink-0 text-sm font-semibold">
                  ${formatBigNumbers(market.liquidityUSD)}
                </span>
              </div>
              {pools.length > 0 ? (
                <ul className="mt-2 space-y-1">
                  {pools.map((pool, index) => (
                    <li
                      key={`${market.name}-${index}`}
                      className="text-klerosUIComponentsSecondaryText text-xs"
                    >
                      {pool}
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>

      <div className="flex w-full justify-center">
        <Button text="Close" small variant="secondary" onPress={toggleIsOpen} />
      </div>
    </div>
  </Modal>
);

const LiquiditySummary: React.FC = () => {
  const [isOpen, toggleIsOpen] = useToggle(false);

  const {
    data: liquidityData,
    isLoading,
    isError,
  } = useQuery<MarketsLiquidityResponse>({
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

  const averageLabel = useMemo(() => {
    if (isLoading) return "...";
    if (isError || !liquidityData) return "N/A";
    return `$${formatBigNumbers(liquidityData.averageLiquidityUSD)}`;
  }, [liquidityData, isError, isLoading]);

  const markets = liquidityData?.data ?? [];
  const canOpen = markets.length > 0;

  return (
    <div className="flex items-center gap-2">
      <StatsBarIcon className="size-3.5" />
      <span className="text-klerosUIComponentsSecondaryText text-sm">
        Liquidity (avg):
      </span>
      <WithHelpTooltip tooltipMsg="Click for detailed breakdown">
        <LightButton
          text={averageLabel}
          small
          isDisabled={!canOpen}
          onPress={() => toggleIsOpen(true)}
          className={clsx(
            "h-auto !p-0",
            canOpen &&
              "[&_.button-text]:underline [&_.button-text]:decoration-dotted",
            // eslint-disable-next-line max-len
            "[&_.button-text]:text-klerosUIComponentsPrimaryText [&_.button-text]:text-sm [&_.button-text]:font-semibold",
            "hover:[&_.button-text]:text-klerosUIComponentsPrimaryBlue hover:!bg-transparent",
          )}
        />
      </WithHelpTooltip>

      <LiquidityModal
        isOpen={isOpen}
        toggleIsOpen={toggleIsOpen}
        markets={markets}
        averageLiquidityUSD={liquidityData?.averageLiquidityUSD ?? 0}
      />
    </div>
  );
};

export default LiquiditySummary;
