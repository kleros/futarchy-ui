import { useMemo } from "react";

import { Address, formatEther, formatUnits } from "viem";

import { useMarketContext } from "@/context/MarketContext";

import { isUndefined } from "@/utils";

import { projectsChosen } from "@/consts/markets";

import { useMarketPrice } from "./useMarketPrice";
import { useTokenBalance } from "./useTokenBalance";

export const useTokenPositionValue = (
  token: Address,
  underlyingToken: Address,
  address: Address,
  config?: { isUp?: boolean },
) => {
  const { hasLiquidity, marketPrice } = useMarketContext();

  const { data: balanceData } = useTokenBalance({
    token: token,
    address: address,
  });
  const balance = balanceData?.value;

  const { data } = useMarketPrice(
    token,
    underlyingToken,
    formatEther(balance ?? 0n),
  );

  const price = useMemo(() => {
    if (hasLiquidity) {
      return !isUndefined(data) ? parseFloat(data.price) / projectsChosen : 0;
    } else {
      return config?.isUp ? marketPrice : 1 - marketPrice;
    }
  }, [data, hasLiquidity, marketPrice, config]);

  const normalizedBalance = useMemo(
    () => parseFloat(formatUnits(balance ?? 0n, 18)),
    [balance],
  );

  const value = useMemo(
    () => normalizedBalance * (price ?? 0),
    [normalizedBalance, price],
  );

  return { balance, value, price };
};
