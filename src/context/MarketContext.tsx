"use client";

import React, {
  type ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";

import { SwaprV3Trade } from "@swapr/sdk";
import { formatUnits } from "viem";

import { useAlternateRoute } from "@/hooks/useAlternateRoute";
import { useBalance } from "@/hooks/useBalance";
import { IChartData } from "@/hooks/useChartData";
import { useGetWinningOutcomes } from "@/hooks/useGetWinningOutcomes";
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
  hasLiquidity: boolean | undefined;
  refetchQuotes: () => void;
  isResolved: boolean;
}

const MarketContext = createContext<IMarketContext | undefined>(undefined);

interface IMarketContextProvider extends IMarket {
  children: ReactNode;
  lastDataPoint: IChartData[string]["data"][number] | undefined;
}

const MarketContextProvider: React.FC<IMarketContextProvider> = ({
  children,
  lastDataPoint,
  ...market
}) => {
  const { activeCardId } = useCardInteraction();

  const { underlyingToken, upToken, downToken, maxValue, precision, marketId } =
    market;

  const [prediction, setPrediction] = useState<number | undefined>(undefined);
  const [isRefetching, setIsRefetching] = useState(false);

  const { data: underlyingBalance, refetch: refetchUnderlyingBalance } =
    useBalance(underlyingToken);

  const shouldFetch =
    marketId === activeCardId &&
    !isUndefined(underlyingBalance) &&
    underlyingBalance !== 0n;

  const { data: marketPriceRaw, isLoading: isLoadingMarketPrice } =
    useMarketPrice(upToken, underlyingToken);
  const {
    data: marketQuote,
    isLoading: isLoadingMarketQuote,
    refetch: refetchMarktetUpQuote,
  } = useMarketQuote(
    upToken,
    underlyingToken,
    underlyingBalance ? formatUnits(underlyingBalance, 18) : "1",
    shouldFetch,
  );

  const upPrice = useMemo(
    () => 1 / parseFloat(marketQuote?.executionPrice.toFixed(4) ?? "0"),
    [marketQuote],
  );

  const hasLiquidity = useMemo(() => marketPriceRaw?.status, [marketPriceRaw]);

  const marketPrice = useMemo(() => {
    if (hasLiquidity) {
      return parseFloat(marketPriceRaw?.price ?? "0");
    } else if (!isUndefined(lastDataPoint?.value)) {
      return lastDataPoint?.value / maxValue;
    } else {
      return 0;
    }
  }, [marketPriceRaw, hasLiquidity, lastDataPoint, maxValue]);

  const {
    data: marketDownQuote,
    isLoading: isLoadingMarketDownQuote,
    refetch: refetchMarktetDownQuote,
  } = useMarketQuote(
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

  const isUpPredict = (prediction ?? 0) > marketEstimate;

  const showEstimateVariant = useMemo(() => {
    if (isUndefined(prediction) || !hasLiquidity) return false;
    return (
      Math.abs(prediction - marketEstimate) >
      market.maxValue / market.precision / 100
    );
  }, [prediction, market, marketEstimate, hasLiquidity]);

  const {
    data: upToDownAlternateRoute,
    isLoading: isLoadingUpAlternateRoute,
    refetch: refetchUpAlternateRoute,
  } = useAlternateRoute(
    upToken,
    downToken,
    underlyingToken,
    formatUnits(underlyingBalance ?? 0n, 18),
    shouldFetch,
  );

  const {
    data: downToUpAlternateRoute,
    isLoading: isLoadingDownAlternateRoute,
    refetch: refetchDownAlternateRoute,
  } = useAlternateRoute(
    downToken,
    upToken,
    underlyingToken,
    formatUnits(underlyingBalance ?? 0n, 18),
    shouldFetch,
  );

  const refetchQuotes = useCallback(() => {
    setIsRefetching(true);
    refetchUnderlyingBalance().then(async () => {
      await Promise.all([
        refetchUpAlternateRoute(),
        refetchDownAlternateRoute(),
        refetchMarktetUpQuote(),
        refetchMarktetDownQuote(),
      ]);

      setIsRefetching(false);
    });
  }, [
    refetchUnderlyingBalance,
    refetchDownAlternateRoute,
    refetchUpAlternateRoute,
    refetchMarktetDownQuote,
    refetchMarktetUpQuote,
  ]);

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
    isLoadingDownAlternateRoute ||
    isRefetching;

  const { data: winningOutcomes } = useGetWinningOutcomes(market.conditionId);
  const isResolved = useMemo(
    () =>
      isUndefined(winningOutcomes)
        ? false
        : winningOutcomes.some((val) => val === true),
    [winningOutcomes],
  );

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
      hasLiquidity,
      refetchQuotes,
      isResolved,
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
      hasLiquidity,
      refetchQuotes,
      isResolved,
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
