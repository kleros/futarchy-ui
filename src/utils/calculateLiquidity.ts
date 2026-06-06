import { getPoolAndTicksData } from "@/hooks/liquidity/getTicksData";
import { tickToPrice, isTwoStringsEqual } from "@/hooks/liquidity/utils";

import { IMarket, markets } from "@/consts/markets";

export type PoolBalance = {
  token0: { symbol: string; balance: number };
  token1: { symbol: string; balance: number };
};

export async function calculateMarketLiquidity(
  market: IMarket,
  poolBalance: Array<PoolBalance | null>,
) {
  const poolData = await Promise.all([
    getPoolAndTicksData(market.underlyingToken, market.upToken),
    getPoolAndTicksData(market.underlyingToken, market.downToken),
  ]);

  const upPoolEntry = Object.values(poolData[0])[0];
  const downPoolEntry = Object.values(poolData[1])[0];

  const upPrice = upPoolEntry
    ? Number(
        tickToPrice(upPoolEntry.poolInfo.tick)[
          isTwoStringsEqual(upPoolEntry.poolInfo.token0, market.upToken) ? 0 : 1
        ],
      )
    : 0.5;

  const downPrice = downPoolEntry
    ? Number(
        tickToPrice(downPoolEntry.poolInfo.tick)[
          isTwoStringsEqual(downPoolEntry.poolInfo.token0, market.downToken)
            ? 0
            : 1
        ],
      )
    : 0.5;

  let liquidityUnderlying = 0;

  for (const [outcome, price] of [
    ["UP", upPrice],
    ["DOWN", downPrice],
  ] as const) {
    const pool = poolBalance.find(
      (entry) =>
        entry &&
        (entry.token0.symbol.toUpperCase() === outcome ||
          entry.token1.symbol.toUpperCase() === outcome),
    );

    if (!pool) continue;

    const outcomeIsToken0 = pool.token0.symbol.toUpperCase() === outcome;
    const outcomeBalance = outcomeIsToken0
      ? pool.token0.balance
      : pool.token1.balance;
    const underlyingBalance = outcomeIsToken0
      ? pool.token1.balance
      : pool.token0.balance;

    liquidityUnderlying += outcomeBalance * price + underlyingBalance;
  }

  const liquiditySDai = liquidityUnderlying / markets.length;

  return { liquidityUnderlying, liquiditySDai };
}
