"use client";

import { useMemo } from "react";

import { useTheme } from "next-themes";

import { Slider } from "@kleros/ui-components-library";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { useSize } from "react-use";

import { isMarketReviewed, useMarketsStore } from "@/store/markets";

import { useMarketContext } from "@/context/MarketContext";
import { useIsTradingPeriodEnded } from "@/hooks/useIsTradingPeriodEnded";
import { useWinningAnswers } from "@/hooks/useWinningAnswers";

import { Skeleton } from "@/components/Skeleton";

import { formatWithPrecision, isUndefined } from "@/utils";
import { getReadableTextColor } from "@/utils/getReadableTextColor";

const NEAR_MARKET_THRESHOLD_PERCENT = 5;

const LoadingSkeleton: React.FC = () => (
  <div className="relative w-full">
    <Skeleton className="h-2 w-full rounded-[30px]" />
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3">
      <Skeleton className="h-[22px] w-[42px]" />
      <Skeleton
        className="mx-auto h-9 w-0.75 rounded-b-full"
        variant="secondary"
      />
    </div>
  </div>
);

const PredictionSliderContent: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const {
    isUpPredict,
    marketPrice,
    prediction,
    setPrediction,
    marketEstimate,
    market,
    isLoadingMarketPrice,
    showEstimateVariant,
    hasLiquidity,
  } = useMarketContext();
  const { maxValue, minValue, precision, color, marketId } = market;
  const { winningMarkets } = useWinningAnswers();
  const isTradingPeriodEnded = useIsTradingPeriodEnded();
  const isReviewed = useMarketsStore(
    (state) => state.markets[marketId]?.isReviewed,
  );

  const resolvedMarket = useMemo(() => {
    if (winningMarkets.length === 0) return undefined;
    return winningMarkets.find(
      (winningMarket) => winningMarket.market.marketId === market.marketId,
    );
  }, [winningMarkets, market]);

  const sliderTheme = useMemo(() => {
    if (resolvedTheme === "light") return isUpPredict ? "#3FEC65" : "#F75C7B";
    else return isUpPredict ? "#D2FFDC" : "#FFD2DB";
  }, [resolvedTheme, isUpPredict]);

  const isPredictionNearMarket = useMemo(() => {
    if (isUndefined(prediction)) return false;
    const threshold =
      (maxValue * precision * NEAR_MARKET_THRESHOLD_PERCENT) / 100;
    return Math.abs(prediction - marketEstimate) <= threshold;
  }, [prediction, marketEstimate, maxValue, precision]);

  const hasActivePrediction = useMemo(
    () =>
      isMarketReviewed({
        prediction,
        marketEstimate,
        isReviewed,
      }),
    [prediction, marketEstimate, isReviewed],
  );

  const shouldRepositionMarketPin =
    isPredictionNearMarket && hasActivePrediction;

  const [sized] = useSize(
    ({ width }) => (
      <div className="relative w-full">
        <Slider
          className={clsx(
            "w-full",
            "[&_#slider-label]:!text-klerosUIComponentsPrimaryText [&_#slider-label]:font-semibold",
          )}
          maxValue={maxValue * precision}
          minValue={minValue * precision}
          value={prediction}
          leftLabel=""
          rightLabel=""
          aria-label="Slider"
          callback={setPrediction}
          formatter={(value) => `${formatWithPrecision(value, precision)}`}
          // @ts-expect-error other values not needed
          theme={
            showEstimateVariant
              ? {
                  sliderColor: sliderTheme,
                  thumbColor: sliderTheme,
                }
              : undefined
          }
          isDisabled={!hasLiquidity || isTradingPeriodEnded}
        />
        <div
          className={clsx(
            "pointer-events-none absolute bottom-0 flex flex-col transition-transform",
            shouldRepositionMarketPin && "flex-col-reverse",
          )}
          style={{
            transform: `translateX(calc(${!isUndefined(marketPrice) && width ? marketPrice * width : 0}px - 50%)) translateY(${shouldRepositionMarketPin ? "32px" : "0"})`,
          }}
        >
          <label className="text-klerosUIComponentsPrimaryText block w-full text-center text-xs">
            Market
          </label>
          <div
            className={clsx(
              "rounded-base px-2 py-0.75 text-center text-xs",
              isLoadingMarketPrice && "animate-pulse",
            )}
            style={{
              backgroundColor: color,
              color: getReadableTextColor(color),
            }}
          >
            {/* TODO: updates for individual experiments */}
            {`${formatWithPrecision(marketEstimate, precision)}%`}
          </div>
          <span
            className={clsx(
              "bg-klerosUIComponentsPrimaryText mx-auto block h-9 w-0.75",
              shouldRepositionMarketPin ? "hidden" : "rounded-b-full",
            )}
          />
        </div>

        {isUndefined(resolvedMarket) ? null : (
          <div
            className="pointer-events-none absolute bottom-0"
            // TODO: updates for individual experiment
            style={{
              transform: `translateX(calc(${!isUndefined(resolvedMarket.finalAnswer) && width ? (resolvedMarket.finalAnswer / 100) * width : 0}px - 50%))`,
            }}
          >
            <label className="text-klerosUIComponentsPrimaryText block w-full text-center text-xs">
              Resolved
            </label>
            <div
              className={clsx(
                "bg-klerosUIComponentsSuccess rounded-base px-2 py-0.75",
                "text-center text-xs text-black",
              )}
            >
              {/* TODO: updates for individual experiments */}
              {`${resolvedMarket.finalAnswer}%`}
            </div>
            <span className="bg-klerosUIComponentsPrimaryText mx-auto block h-9 w-0.75 rounded-b-full" />
          </div>
        )}
      </div>
    ),
    { width: 300 },
  );

  return isUndefined(marketEstimate) ? <LoadingSkeleton /> : sized;
};

const PredictionSlider = dynamic(
  () => Promise.resolve(PredictionSliderContent),
  {
    ssr: false,
    loading: () => <LoadingSkeleton />,
  },
);

export default PredictionSlider;
