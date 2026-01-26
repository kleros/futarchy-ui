import { useMemo } from "react";

import { Address, formatEther, formatUnits } from "viem";

import { useMarketContext } from "@/context/MarketContext";

import { isUndefined } from "@/utils";

import { projectsChosen } from "@/consts/markets";

import { useMarketPrice } from "./useMarketPrice";
import { useSDaiPrice } from "./useSDaiPrice";
import { useTokenBalance } from "./useTokenBalance";

/**
 * @returns price of token in xDai/ dollar
 */
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

  const { price: sDaiPrice } = useSDaiPrice();

  const price = useMemo(() => {
    let price = 0;
    if (hasLiquidity) {
      price = !isUndefined(data) ? parseFloat(data.price) : 0;
    } else {
      price = config?.isUp ? marketPrice : 1 - marketPrice;
    }
    return (price * sDaiPrice) / projectsChosen;
  }, [data, hasLiquidity, marketPrice, config, sDaiPrice]);

  const normalizedBalance = useMemo(
    () => parseFloat(formatUnits(balance ?? 0n, 18)),
    [balance],
  );

  const value = useMemo(
    () => normalizedBalance * price,
    [normalizedBalance, price],
  );

  return { balance, value, price };
};
