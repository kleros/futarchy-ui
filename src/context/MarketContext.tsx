"use client";

import React, {
  type ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

import { useDebounce } from "react-use";

import { useCurrentMarketPrices } from "@/hooks/liquidity/useCurrentMarketPrices";
import { useGetWinningOutcomes } from "@/hooks/useGetWinningOutcomes";
import { useMarketPrice } from "@/hooks/useMarketPrice";

import { isUndefined } from "@/utils";

import { IMarket, parentConditionId } from "@/consts/markets";

interface IMarketContext {
  upPrice: number;
  downPrice: number;
  marketPrice: number;
  marketEstimate: number;
  isUpPredict: boolean;
  prediction: number | undefined;
  setPrediction: (prediction: number) => void;
  market: IMarket;
  isLoadingMarketPrice: boolean;
  showEstimateVariant: boolean;
  hasLiquidity: boolean | undefined;
  isResolved: boolean;
  isParentResolved: boolean;
  // if this market was selected
  selected?: boolean;
  predictedPrice: number;
}

const MarketContext = createContext<IMarketContext | undefined>(undefined);

interface IMarketContextProvider extends IMarket {
  children: ReactNode;
  selected?: boolean;
}

const MarketContextProvider: React.FC<IMarketContextProvider> = ({
  children,
  selected,
  ...market
}) => {
  // const { activeCardId } = useCardInteraction();

  const { underlyingToken, upToken, downToken, maxValue, precision } = market;

  const [prediction, setPrediction] = useState<number | undefined>(undefined);
  const [debouncedPrediction, setDebouncedPrediction] = useState<number>();

  useDebounce(
    () => {
      setDebouncedPrediction(prediction);
    },
    500,
    [prediction],
  );

  // const { data: underlyingBalance } = useBalance(underlyingToken);

  // const shouldFetch =
  //   marketId === activeCardId &&
  //   !isUndefined(underlyingBalance) &&
  //   underlyingBalance !== 0n;

  const { data: marketPriceRaw } = useMarketPrice(upToken, underlyingToken);

  const currentPrices = useCurrentMarketPrices(
    underlyingToken,
    upToken,
    downToken,
  );

  const isLoadingMarketPrice = isUndefined(currentPrices);

  const marketPrice = currentPrices?.upPrice ?? 0;

  const hasLiquidity = useMemo(() => marketPriceRaw?.status, [marketPriceRaw]);

  const upPrice = marketPrice;
  const downPrice = currentPrices?.downPrice ?? 0;

  const marketEstimate = useMemo(
    () =>
      typeof marketPrice !== "undefined"
        ? +(marketPrice * maxValue * precision).toFixed(1)
        : 0,
    [marketPrice, maxValue, precision],
  );

  const isUpPredict = (prediction ?? 0) > marketEstimate;

  // adjusts the price based on predicted direction, for DOWN predictedPrice = 1 - estimateMade
  const predictedPrice = useMemo(() => {
    if (typeof debouncedPrediction === "undefined") return 0;

    return debouncedPrediction / (maxValue * precision);
  }, [debouncedPrediction, maxValue, precision]);

  useEffect(() => {
    if (
      isUndefined(prediction) &&
      !isUndefined(marketEstimate) &&
      isFinite(marketEstimate)
    ) {
      setPrediction(
        Math.round(marketEstimate * market.precision) / market.precision,
      );
    }
  }, [prediction, marketEstimate, market.precision]);

  const showEstimateVariant = useMemo(() => {
    if (isUndefined(prediction) || !hasLiquidity) return false;
    return (
      Math.abs(prediction - marketEstimate) >
      market.maxValue / market.precision / 100
    );
  }, [prediction, market, marketEstimate, hasLiquidity]);

  const { data: winningOutcomes } = useGetWinningOutcomes(market.conditionId);
  const isResolved = useMemo(
    () =>
      isUndefined(winningOutcomes)
        ? false
        : winningOutcomes.some((val) => val === true),
    [winningOutcomes],
  );

  const { data: parentWinningOutcomes } =
    useGetWinningOutcomes(parentConditionId);
  const isParentResolved = useMemo(
    () =>
      isUndefined(parentWinningOutcomes)
        ? false
        : parentWinningOutcomes.some((val) => val === true),
    [parentWinningOutcomes],
  );

  const value = useMemo(
    () => ({
      upPrice,
      downPrice,
      marketPrice,
      marketEstimate,
      isUpPredict,
      prediction,
      setPrediction,
      market,
      isLoadingMarketPrice,
      showEstimateVariant,
      hasLiquidity,
      isResolved,
      isParentResolved,
      selected,
      predictedPrice,
    }),
    [
      upPrice,
      downPrice,
      marketPrice,
      marketEstimate,
      isUpPredict,
      prediction,
      setPrediction,
      market,
      isLoadingMarketPrice,
      showEstimateVariant,
      hasLiquidity,
      isResolved,
      isParentResolved,
      selected,
      predictedPrice,
    ],
  );

  return (
    <MarketContext.Provider {...{ value }}>{children}</MarketContext.Provider>
  );
};

export const useMarketContext = (): IMarketContext => {
  const context = useContext(MarketContext);
  if (!context) throw Error("Market not initialized");

  return context;
};

export default MarketContextProvider;
