import { useMemo } from "react";

import { Address } from "viem";

import { useMarketContext } from "@/context/MarketContext";

import { isUndefined } from "@/utils";

import { useVolumeUntilPriceDual } from "./liquidity/useVolumeUntilPriceDual";

import { useTokenBalance } from "./useTokenBalance";

export type ProcessedMarket = {
  action: string;
  underlyingBalance: bigint;
  balance: bigint;
  volumeUntilPrice: {
    outcomeVolume: number;
    collateralVolume: number;
  };
  underlyingToken: Address;
  token: Address;
  difference: number;
};

interface IProcessMarkets {
  tradeExecutor?: Address;
  enabled?: boolean;
}

export const useProcessMarkets = ({
  tradeExecutor,
  enabled = true,
}: IProcessMarkets): ProcessedMarket[] | undefined => {
  const { predictedPrice, market, upPrice, downPrice } = useMarketContext();
  const { underlyingToken, upToken, downToken } = market;
  const { data: underlyingBalanceData } = useTokenBalance({
    address: tradeExecutor,
    token: underlyingToken,
  });
  const { data: upBalanceData } = useTokenBalance({
    address: tradeExecutor,
    token: upToken,
  });
  const { data: downBalanceData } = useTokenBalance({
    address: tradeExecutor,
    token: downToken,
  });

  // tells if we should buy or sell UP/DOWN based on predictionPrice
  const upDirection = predictedPrice > upPrice ? "buy" : "sell";
  const downDirection = 1 - predictedPrice > downPrice ? "buy" : "sell";

  // gives us the amount of collateral
  const { data: upMarketVolumeData } = useVolumeUntilPriceDual(
    underlyingToken,
    upToken,
    upDirection,
    predictedPrice,
    enabled,
  );

  const { data: downMarketVolumeData } = useVolumeUntilPriceDual(
    underlyingToken,
    downToken,
    downDirection,
    1 - predictedPrice,
    enabled,
  );

  const isReady =
    upPrice !== Infinity &&
    downPrice !== Infinity &&
    !isUndefined(underlyingBalanceData?.value) &&
    !isUndefined(upBalanceData?.value) &&
    !isUndefined(downBalanceData?.value) &&
    !isUndefined(upMarketVolumeData) &&
    !isUndefined(downMarketVolumeData);

  return useMemo(() => {
    if (!isReady) return;
    return [
      {
        action: upDirection,
        underlyingBalance: underlyingBalanceData.value,
        balance: upBalanceData.value,
        volumeUntilPrice: upMarketVolumeData,
        underlyingToken,
        token: upToken,
        difference: Math.abs(upPrice - predictedPrice),
      },
      {
        action: downDirection,
        underlyingBalance: underlyingBalanceData.value,
        balance: downBalanceData.value,
        volumeUntilPrice: downMarketVolumeData,
        underlyingToken,
        token: downToken,
        difference: Math.abs(downPrice - (1 - predictedPrice)),
      },
    ];
  }, [
    isReady,
    downDirection,
    upDirection,
    upBalanceData?.value,
    downBalanceData?.value,
    underlyingBalanceData?.value,
    underlyingToken,
    upToken,
    downToken,
    downMarketVolumeData,
    upMarketVolumeData,
    upPrice,
    downPrice,
    predictedPrice,
  ]);
};
