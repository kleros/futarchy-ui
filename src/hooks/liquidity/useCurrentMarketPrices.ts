import { useMemo } from "react";

import { Address } from "viem";

import { isUndefined } from "@/utils";

import { useMarketPrice } from "../useMarketPrice";

import { useTicksData } from "./useTicksData";
import { getChartMarketPrice, quoterToChartPrice } from "./utils";

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
  enabled = true,
): MarketPrices | undefined {
  const { data: upPoolData } = useTicksData(underlying, upToken, enabled);
  const { data: downPoolData } = useTicksData(underlying, downToken, enabled);

  const { data: upOnChainPrice } = useMarketPrice(
    upToken,
    underlying,
    "0.001",
    enabled,
  );
  const { data: downOnChainPrice } = useMarketPrice(
    downToken,
    underlying,
    "0.001",
    enabled,
  );

  return useMemo(() => {
    if (isUndefined(upPoolData) || isUndefined(downPoolData)) {
      return undefined;
    }

    const upPoolEntry = Object.values(upPoolData)[0];
    const downPoolEntry = Object.values(downPoolData)[0];

    // Pool missing or subgraph empty — fall back to on-chain quoter
    if (isUndefined(upPoolEntry) || isUndefined(downPoolEntry)) {
      if (
        isUndefined(upOnChainPrice?.price) ||
        isUndefined(downOnChainPrice?.price) ||
        !upOnChainPrice.status ||
        !downOnChainPrice.status
      ) {
        return undefined;
      }

      return {
        upPrice: quoterToChartPrice(upOnChainPrice.price),
        downPrice: quoterToChartPrice(downOnChainPrice.price),
      };
    }

    const { poolInfo: upPool } = upPoolEntry;
    const { poolInfo: downPool } = downPoolEntry;

    const upPrice = getChartMarketPrice(upPool, underlying);
    const downPrice = getChartMarketPrice(downPool, underlying);

    return { upPrice, downPrice };
  }, [
    underlying,
    upPoolData,
    downPoolData,
    upOnChainPrice?.price,
    upOnChainPrice?.status,
    downOnChainPrice?.price,
    downOnChainPrice?.status,
  ]);
}
