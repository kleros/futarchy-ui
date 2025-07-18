"use client";

import React, {
  type ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import { SwaprV3Trade } from "@swapr/sdk";
import { formatUnits } from "viem";

import { useAlternateRoute } from "@/hooks/useAlternateRoute";
import { useBalance } from "@/hooks/useBalance";
import { useMarketQuote } from "@/hooks/useMarketQuote";

import { isUndefined } from "@/utils";

import { IMarket } from "@/consts/markets";

interface IMarketContext {
  upPrice: number;
  downPrice: number;
  marketEstimate: number;
  marketQuote: SwaprV3Trade | null | undefined;
  marketDownQuote: SwaprV3Trade | null | undefined;
  mintSellQuote: SwaprV3Trade | null | undefined;
  mintReBuyQuote: SwaprV3Trade | null | undefined;
  expectedFromMintRoute?: number;
  percentageIncrease: string;
  isUpPredict: boolean;
  differenceBetweenRoutes: number;
  prediction: number;
  setPrediction: (prediction: number) => void;
  market: IMarket;
}

const MarketContext = createContext<IMarketContext | undefined>(undefined);

interface IMarketContextProvider extends IMarket {
  children: ReactNode;
}

const MarketContextProvider: React.FC<IMarketContextProvider> = ({
  children,
  ...market
}) => {
  const { underlyingToken, upToken, downToken, maxValue, precision } = market;

  const [prediction, setPrediction] = useState(0);

  const { data: underlyingBalance } = useBalance(underlyingToken);

  const { data: marketQuote } = useMarketQuote(
    upToken,
    underlyingToken,
    underlyingBalance ? formatUnits(underlyingBalance, 18) : "1",
  );

  const upPrice = useMemo(
    () => 1 / parseFloat(marketQuote?.executionPrice.toFixed(4) ?? "0"),
    [marketQuote],
  );

  const marketPrice = upPrice;

  const { data: marketDownQuote } = useMarketQuote(
    downToken,
    underlyingToken,
    underlyingBalance ? formatUnits(underlyingBalance, 18) : "1",
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

  const isUpPredict = prediction > marketEstimate;

  const { data: upToDownAlternateRoute } = useAlternateRoute(
    upToken,
    downToken,
    underlyingToken,
    formatUnits(underlyingBalance ?? 0n, 18),
  );

  const { data: downToUpAlternateRoute } = useAlternateRoute(
    downToken,
    upToken,
    underlyingToken,
    formatUnits(underlyingBalance ?? 0n, 18),
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

  const value = useMemo(
    () => ({
      upPrice,
      downPrice,
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
    }),
    [
      upPrice,
      downPrice,
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
