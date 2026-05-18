import { useMemo } from "react";

import { Address } from "viem";

import { isUndefined } from "@/utils";

import { useMarketPrice } from "../useMarketPrice";

import { useTicksData } from "./useTicksData";
import { tickToPrice, isTwoStringsEqual } from "./utils";

interface MarketPrices {
  upPrice: number;
  downPrice: number;
}

/**
 * Returns current UP and DOWN market prices from Uniswap pool.
 *
 * @param underlying  The collateral/underlying token address.
 * @param upToken     The UP outcome token address.
 * @param downToken   The DOWN outcome token address.
 */
export function useCurrentMarketPrices(
  underlying: Address,
  upToken: Address,
  downToken: Address,
): MarketPrices | undefined {
  const { data: upPoolData } = useTicksData(underlying, upToken);
  const { data: downPoolData } = useTicksData(underlying, downToken);

  const { data: upOnChainPrice } = useMarketPrice(upToken, underlying);
  const { data: downOnChainPrice } = useMarketPrice(downToken, underlying);

  return useMemo(() => {
    if (isUndefined(upPoolData) || isUndefined(downPoolData)) return undefined;

    // returning mid price in case market is not yet traded on
    if (
      isUndefined(Object.values(upPoolData)[0]) ||
      isUndefined(Object.values(downPoolData)[0])
    ) {
      return !isUndefined(upOnChainPrice?.price) &&
        !isUndefined(downOnChainPrice?.price)
        ? {
            upPrice: parseFloat(upOnChainPrice.price),
            downPrice: parseFloat(downOnChainPrice.price),
          }
        : undefined;
    }
    const { poolInfo: upPool } = Object.values(upPoolData)[0];
    const { poolInfo: downPool } = Object.values(downPoolData)[0];

    const upPriceArr = tickToPrice(upPool.tick);
    const downPriceArr = tickToPrice(downPool.tick);

    const upPrice = Number(
      upPriceArr[isTwoStringsEqual(upPool.token0, upToken) ? 0 : 1],
    );
    const downPrice = Number(
      downPriceArr[isTwoStringsEqual(downPool.token0, downToken) ? 0 : 1],
    );

    return { upPrice, downPrice };
  }, [upToken, downToken, upPoolData, downPoolData]);
}
