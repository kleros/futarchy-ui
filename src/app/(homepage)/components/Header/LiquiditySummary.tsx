"use client";

import { useMemo } from "react";

import { Button, Modal } from "@kleros/ui-components-library";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useToggle } from "react-use";

import { useSDaiPrice } from "@/hooks/useSDaiPrice";

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
  liquidityUnderlying: number;
  liquiditySDai: number;
  liquidityUSD: number;
  poolBalance: Array<PoolBalance | null>;
};

type MarketsLiquidityResponse = {
  data: Omit<MarketLiquidity, "liquidityUSD">[];
  totalLiquiditySDai: number;
};

function formatPoolBalance(pool: PoolBalance): string {
  const token0IsOutcome = ["UP", "DOWN"].includes(
    pool.token0.symbol.toUpperCase(),
  );
  const outcome = token0IsOutcome ? pool.token0 : pool.token1;
  const underlying = token0IsOutcome ? pool.token1 : pool.token0;

  // eslint-disable-next-line max-len
  return `${formatBigNumbers(outcome.balance)} ${outcome.symbol} / ${formatBigNumbers(underlying.balance)} ${underlying.symbol}`;
}

interface ILiquidityModal {
  isOpen: boolean;
  toggleIsOpen: () => void;
  markets: MarketLiquidity[];
  totalLiquidityUSD: number;
  totalLiquiditySDai: number;
}

const LiquidityModal: React.FC<ILiquidityModal> = ({
  isOpen,
  toggleIsOpen,
  markets,
  totalLiquidityUSD,
  totalLiquiditySDai,
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
          Total: {formatBigNumbers(totalLiquiditySDai)} sDAI ($
          {formatBigNumbers(totalLiquidityUSD)})
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
                <span className="text-klerosUIComponentsPrimaryText shrink-0 text-right text-sm font-semibold">
                  {formatBigNumbers(market.liquiditySDai)} sDAI
                  <span className="text-klerosUIComponentsSecondaryText block text-xs font-normal">
                    ${formatBigNumbers(market.liquidityUSD)}
                  </span>
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
  const { price: sDaiPrice } = useSDaiPrice();

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

  const totalLabel = useMemo(() => {
    if (isLoading) return "...";
    if (isError || !liquidityData) return "N/A";
    return `${formatBigNumbers(liquidityData.totalLiquiditySDai)} sDAI`;
  }, [liquidityData, isError, isLoading]);

  const markets = useMemo(
    (): MarketLiquidity[] =>
      (liquidityData?.data ?? []).map((market) => ({
        ...market,
        liquidityUSD: market.liquiditySDai * sDaiPrice,
      })),
    [liquidityData, sDaiPrice],
  );

  const totalLiquiditySDai = liquidityData?.totalLiquiditySDai ?? 0;
  const totalLiquidityUSD = totalLiquiditySDai * sDaiPrice;
  const canOpen = markets.length > 0;

  return (
    <div className="flex items-center gap-2">
      <StatsBarIcon className="size-3.5" />
      <span className="text-klerosUIComponentsSecondaryText text-sm">
        Liquidity:
      </span>
      <WithHelpTooltip tooltipMsg="Click for detailed breakdown">
        <LightButton
          text={totalLabel}
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
        totalLiquidityUSD={totalLiquidityUSD}
        totalLiquiditySDai={totalLiquiditySDai}
      />
    </div>
  );
};

export default LiquiditySummary;
