"use client";

import React, {
  type ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
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
  marketEstimate: number | undefined;
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
  const isUserInitiatedRef = useRef(false);

  const setUserPrediction = useCallback((prediction: number) => {
    isUserInitiatedRef.current = true;
    setLocalPrediction(prediction);
  }, []);

  useDebounce(
    () => {
      if (!isUndefined(localPrediction)) {
        setPrediction(market.marketId, localPrediction, {
          reviewed: isUserInitiatedRef.current,
        });
        isUserInitiatedRef.current = false;
      }
    },
    500,
    [localPrediction, market.marketId, setPrediction],
  );

  // initialize market
  useEffect(() => {
    setMarket(market);
  }, []);

  //sync global prediction to local (ui)
  useEffect(() => {
    if (isUndefined(prediction)) {
      setLocalPrediction(undefined);
      return;
    }
    if (prediction !== localPrediction) {
      setLocalPrediction(prediction);
    }
  }, [prediction]);

  const { data: marketPriceRaw } = useMarketPrice(
    upToken,
    underlyingToken,
    "0.001",
  );

  const currentPrices = useCurrentMarketPrices(
    underlyingToken,
    upToken,
    downToken,
  );

  const isLoadingMarketPrice = isUndefined(currentPrices);

  const marketPrice = currentPrices?.upPrice;

  const hasLiquidity = useMemo(() => marketPriceRaw?.status, [marketPriceRaw]);

  const upPrice = marketPrice ?? 0;
  const downPrice = currentPrices?.downPrice ?? 0;

  const marketEstimate = useMemo(() => {
    if (isUndefined(currentPrices) || isUndefined(marketPrice)) {
      return undefined;
    }
    return Math.round(marketPrice * maxValue * precision);
  }, [currentPrices, marketPrice, maxValue, precision]);

  useEffect(() => {
    if (!isUndefined(marketEstimate)) {
      setMarketEstimate(market.marketId, marketEstimate);
    }
  }, [marketEstimate, market.marketId, setMarketEstimate]);

  const isUpPredict =
    !isUndefined(marketEstimate) && (localPrediction ?? 0) > marketEstimate;

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
    if (
      isUndefined(localPrediction) ||
      isUndefined(marketEstimate) ||
      !hasLiquidity
    ) {
      return false;
    }
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
      marketPrice: marketPrice ?? 0,
      marketEstimate,
      isUpPredict,
      prediction: localPrediction,
      setPrediction: setUserPrediction,
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
      setUserPrediction,
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
