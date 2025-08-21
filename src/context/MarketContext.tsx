"use client";

import React, {
  type ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

import { SwaprV3Trade } from "@swapr/sdk";
import { formatUnits } from "viem";

import { useAlternateRoute } from "@/hooks/useAlternateRoute";
import { useBalance } from "@/hooks/useBalance";
import { useMarketPrice } from "@/hooks/useMarketPrice";
import { useMarketQuote } from "@/hooks/useMarketQuote";

import { isUndefined } from "@/utils";

import { IMarket } from "@/consts/markets";

import { useCardInteraction } from "./CardInteractionContext";

interface IMarketContext {
  upPrice: number;
  downPrice: number;
  marketPrice: number;
  marketEstimate: number;
  marketQuote: SwaprV3Trade | null | undefined;
  marketDownQuote: SwaprV3Trade | null | undefined;
  mintSellQuote: SwaprV3Trade | null | undefined;
  mintReBuyQuote: SwaprV3Trade | null | undefined;
  expectedFromMintRoute?: number;
  expectedFromDefaultRoute?: number;
  percentageIncrease: string;
  isUpPredict: boolean;
  differenceBetweenRoutes: number;
  prediction: number | undefined;
  setPrediction: (prediction: number) => void;
  market: IMarket;
  isLoading: boolean;
  isLoadingMarketPrice: boolean;
  showEstimateVariant: boolean;
}

const MarketContext = createContext<IMarketContext | undefined>(undefined);

interface IMarketContextProvider extends IMarket {
  children: ReactNode;
}

const MarketContextProvider: React.FC<IMarketContextProvider> = ({
  children,
  ...market
}) => {
  const { activeCardId } = useCardInteraction();

  const { underlyingToken, upToken, downToken, maxValue, precision, marketId } =
    market;

  const [prediction, setPrediction] = useState<number | undefined>(undefined);

  const { data: underlyingBalance } = useBalance(underlyingToken);

  const shouldFetch =
    marketId === activeCardId &&
    !isUndefined(underlyingBalance) &&
    underlyingBalance !== 0n;

  const { data: marketPriceRaw, isLoading: isLoadingMarketPrice } =
    useMarketPrice(upToken, underlyingToken);
  const { data: marketQuote, isLoading: isLoadingMarketQuote } = useMarketQuote(
    upToken,
    underlyingToken,
    underlyingBalance ? formatUnits(underlyingBalance, 18) : "1",
    shouldFetch,
  );

  const upPrice = useMemo(
    () => 1 / parseFloat(marketQuote?.executionPrice.toFixed(4) ?? "0"),
    [marketQuote],
  );

  const marketPrice = useMemo(
    () => parseFloat(marketPriceRaw ?? "0"),
    [marketPriceRaw],
  );

  const { data: marketDownQuote, isLoading: isLoadingMarketDownQuote } =
    useMarketQuote(
      downToken,
      underlyingToken,
      underlyingBalance ? formatUnits(underlyingBalance, 18) : "1",
      shouldFetch,
    );

  const downPrice = useMemo(
    () => 1 / parseFloat(marketDownQuote?.executionPrice.toFixed(4) ?? "0"),
    [marketDownQuote],
  );

  const marketEstimate = useMemo(
    () =>
      typeof marketPrice !== "undefined"
        ? +(marketPrice * maxValue * precision).toFixed(1)
        : 0,
    [marketPrice, maxValue, precision],
  );

  useEffect(() => {
    if (isUndefined(prediction) && !isUndefined(marketEstimate)) {
      setPrediction(
        Math.round(marketEstimate * market.precision) / market.precision,
      );
    }
  }, [prediction, marketEstimate, market.precision]);

  const isUpPredict = (prediction ?? 0) > marketEstimate;

  const showEstimateVariant = useMemo(() => {
    if (isUndefined(prediction)) return false;
    return (
      Math.abs(prediction - marketEstimate) >
      market.maxValue / market.precision / 100
    );
  }, [prediction, market, marketEstimate]);

  const { data: upToDownAlternateRoute, isLoading: isLoadingUpAlternateRoute } =
    useAlternateRoute(
      upToken,
      downToken,
      underlyingToken,
      formatUnits(underlyingBalance ?? 0n, 18),
      shouldFetch,
    );

  const {
    data: downToUpAlternateRoute,
    isLoading: isLoadingDownAlternateRoute,
  } = useAlternateRoute(
    downToken,
    upToken,
    underlyingToken,
    formatUnits(underlyingBalance ?? 0n, 18),
    shouldFetch,
  );

  const expectedFromMintRoute = useMemo(
    () =>
      isUpPredict
        ? upToDownAlternateRoute?.amountAcquired
        : downToUpAlternateRoute?.amountAcquired,
    [isUpPredict, upToDownAlternateRoute, downToUpAlternateRoute],
  );

  const expectedFromDefaultRoute = useMemo(
    () =>
      isUpPredict
        ? Number(marketQuote?.outputAmount.toExact())
        : Number(marketDownQuote?.outputAmount.toExact()),
    [isUpPredict, marketQuote, marketDownQuote],
  );

  const mintSellQuote = useMemo(
    () =>
      isUpPredict
        ? upToDownAlternateRoute?.sellQuote
        : downToUpAlternateRoute?.sellQuote,
    [isUpPredict, upToDownAlternateRoute, downToUpAlternateRoute],
  );

  const mintReBuyQuote = useMemo(
    () =>
      isUpPredict
        ? upToDownAlternateRoute?.reBuyQuote
        : downToUpAlternateRoute?.reBuyQuote,
    [isUpPredict, upToDownAlternateRoute, downToUpAlternateRoute],
  );

  const percentageIncrease = useMemo(() => {
    if (
      isUndefined(expectedFromMintRoute) ||
      isUndefined(expectedFromDefaultRoute)
    )
      return "0%";
    return (
      ((expectedFromMintRoute - expectedFromDefaultRoute) /
        expectedFromDefaultRoute) *
      100
    ).toFixed(2);
  }, [expectedFromMintRoute, expectedFromDefaultRoute]);

  const differenceBetweenRoutes = useMemo(() => {
    if (
      isUndefined(expectedFromMintRoute) ||
      isUndefined(expectedFromDefaultRoute)
    )
      return 0;
    return expectedFromMintRoute - expectedFromDefaultRoute;
  }, [expectedFromMintRoute, expectedFromDefaultRoute]);

  const isLoading =
    isLoadingMarketQuote ||
    isLoadingMarketDownQuote ||
    isLoadingUpAlternateRoute ||
    isLoadingDownAlternateRoute;

  const value = useMemo(
    () => ({
      upPrice,
      downPrice,
      marketPrice,
      marketEstimate,
      marketQuote,
      marketDownQuote,
      mintSellQuote,
      mintReBuyQuote,
      expectedFromMintRoute,
      percentageIncrease,
      isUpPredict,
      differenceBetweenRoutes,
      prediction,
      setPrediction,
      market,
      isLoading,
      isLoadingMarketPrice,
      expectedFromDefaultRoute,
      showEstimateVariant,
    }),
    [
      upPrice,
      downPrice,
      marketPrice,
      marketEstimate,
      marketQuote,
      marketDownQuote,
      mintSellQuote,
      mintReBuyQuote,
      expectedFromMintRoute,
      percentageIncrease,
      isUpPredict,
      differenceBetweenRoutes,
      prediction,
      setPrediction,
      market,
      isLoading,
      isLoadingMarketPrice,
      expectedFromDefaultRoute,
      showEstimateVariant,
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
