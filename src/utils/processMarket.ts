import { Address } from "viem";

import { getPoolAndTicksData } from "@/hooks/liquidity/getTicksData";
import { getVolumeUntilPriceDual } from "@/hooks/liquidity/useVolumeUntilPriceDual";
import {
  getToken0Token1,
  isTwoStringsEqual,
  tickToPrice,
} from "@/hooks/liquidity/utils";
import { fetchTokenBalance } from "@/hooks/useTokenBalance";

interface IProcessMarket {
  underlying: Address;
  outcome: Address;
  targetPrice: number;
  tradeExecutor: Address;
  mintAmount?: bigint;
}

export const processMarket = async ({
  underlying,
  outcome,
  targetPrice,
  tradeExecutor,
  mintAmount,
}: IProcessMarket) => {
  try {
    const { token0, token1 } = getToken0Token1(underlying, outcome);
    const ticksData = await getPoolAndTicksData(token0, token1);
    const { ticks, poolInfo } = Object.values(ticksData)[0];

    const underlyingBalance = await fetchTokenBalance(
      tradeExecutor,
      underlying,
    );
    const outcomeBalance = await fetchTokenBalance(tradeExecutor, outcome);

    // calculate overshoot parameters
    let volumeData;
    const currentPrice = Number(
      tickToPrice(poolInfo.tick)[
        isTwoStringsEqual(poolInfo.token0, outcome) ? 0 : 1
      ],
    );

    const direction = targetPrice > currentPrice ? "buy" : "sell";

    if (currentPrice === targetPrice) {
      volumeData = { outcomeVolume: 0, collateralVolume: 0 };
    } else {
      volumeData = getVolumeUntilPriceDual(
        poolInfo,
        ticks,
        targetPrice!,
        outcome,
        direction,
      );
    }

    return {
      action: direction,
      underlyingBalance: underlyingBalance.value + (mintAmount ?? 0n),
      balance: outcomeBalance.value,
      volumeUntilPrice: volumeData,
      underlyingToken: underlying,
      token: outcome,
      difference: Math.abs(currentPrice - targetPrice),
    };
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`Error processing market: ${e.message}`);
    } else {
      throw e;
    }
  }
};
