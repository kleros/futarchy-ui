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

import { useMarketsStore } from "@/store/markets";

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
  // globale store
  const prediction = useMarketsStore(
    (state) => state.markets[market.marketId]?.prediction,
  );
  const predictedPrice = useMarketsStore(
    (s) => s.markets[market.marketId]?.predictedPrice ?? 0,
  );

  const setMarket = useMarketsStore((state) => state.setMarket);
  const setPrediction = useMarketsStore((state) => state.setPrediction);

  const setMarketEstimate = useMarketsStore((state) => state.setMarketEstimate);

  const { underlyingToken, upToken, downToken, maxValue, precision } = market;

  const [localPrediction, setLocalPrediction] = useState<number | undefined>(
    undefined,
  );

  useDebounce(
    () => {
      if (!isUndefined(localPrediction)) {
        setPrediction(market.marketId, localPrediction);
      }
    },
    500,
    [localPrediction],
  );

  // initialize market
  useEffect(() => {
    setMarket(market);
  }, []);

  //sync global prediction to local (ui)
  useEffect(() => {
    if (!isUndefined(prediction) && prediction !== localPrediction) {
      setLocalPrediction(prediction);
    }
  }, [prediction]);

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
        ? Math.round(marketPrice * maxValue * precision)
        : 0,
    [marketPrice, maxValue, precision],
  );

  useEffect(() => {
    setMarketEstimate(market.marketId, marketEstimate);
  }, [marketEstimate]);

  const isUpPredict = (localPrediction ?? 0) > marketEstimate;

  useEffect(() => {
    if (
      isUndefined(localPrediction) &&
      !isUndefined(marketEstimate) &&
      isFinite(marketEstimate) &&
      !isUndefined(currentPrices)
    ) {
      setLocalPrediction(marketEstimate);
    }
  }, [localPrediction, marketEstimate, market.precision, currentPrices]);

  const showEstimateVariant = useMemo(() => {
    if (isUndefined(localPrediction) || !hasLiquidity) return false;
    return (
      Math.abs(localPrediction - marketEstimate) >
      market.maxValue / market.precision / 100
    );
  }, [localPrediction, market, marketEstimate, hasLiquidity]);

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
      prediction: localPrediction,
      setPrediction: setLocalPrediction,
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
      localPrediction,
      setLocalPrediction,
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
