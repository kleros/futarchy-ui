import { TickMath, encodeSqrtRatioX96 } from "@uniswap/v3-sdk";
import { Address, formatUnits } from "viem";

import { clamp, isUndefined } from "@/utils";

import { useTicksData } from "./useTicksData";
import { decimalToFraction, isTwoStringsEqual, tickToPrice } from "./utils";

const MIN_PRICE = 0.0001;
const MAX_PRICE = 0.9999;

function getVolumeWithinRangeDual(
  currentSqrtPriceX96: bigint,
  targetSqrtPriceX96: bigint,
  liquidity: bigint,
  isOutcomeToken0: boolean,
  swapType: "buy" | "sell",
): { outcomeVolume: number; collateralVolume: number } {
  // initialize both to zero
  let outcomeVolume = 0;
  let collateralVolume = 0;

  if (swapType === "buy") {
    if (isOutcomeToken0) {
      // Buying token0 (outcome), paying token1 (collateral)
      // Δx (outcome bought) = L * (√P_target - √P_current) / (√P_target * √P_current)
      // Δy (collateral spent) = L * (√P_target - √P_current)
      const deltaSqrt = targetSqrtPriceX96 - currentSqrtPriceX96;
      const amountOutcome =
        (liquidity * (1n << 96n) * deltaSqrt) /
        (targetSqrtPriceX96 * currentSqrtPriceX96);
      const amountCollateral = (liquidity * deltaSqrt) / (1n << 96n);

      outcomeVolume = Number(formatUnits(amountOutcome, 18));
      collateralVolume = Number(formatUnits(amountCollateral, 18));
    } else {
      // Buying token1 (outcome), paying token0 (collateral)
      // Δy (outcome bought) = L * (√P_current - √P_target) / (2^96)
      // Δx (collateral spent) = L * (√P_current - √P_target) / (√P_current * √P_target)
      const deltaSqrt = currentSqrtPriceX96 - targetSqrtPriceX96;
      const amountOutcome = (liquidity * deltaSqrt) / (1n << 96n);
      const amountCollateral =
        (liquidity * (1n << 96n) * deltaSqrt) /
        (targetSqrtPriceX96 * currentSqrtPriceX96);

      outcomeVolume = Number(formatUnits(amountOutcome, 18));
      collateralVolume = Number(formatUnits(amountCollateral, 18));
    }
  } else {
    if (isOutcomeToken0) {
      // Selling token0 (outcome), receiving token1 (collateral)
      // Δx (outcome sold) = L * (√P_current - √P_target) / (√P_target * √P_current)
      // Δy (collateral received) = L * (√P_current - √P_target)
      const deltaSqrt = currentSqrtPriceX96 - targetSqrtPriceX96;
      const amountOutcome =
        (liquidity * (1n << 96n) * deltaSqrt) /
        (targetSqrtPriceX96 * currentSqrtPriceX96);
      const amountCollateral = (liquidity * deltaSqrt) / (1n << 96n);

      outcomeVolume = Number(formatUnits(amountOutcome, 18));
      collateralVolume = Number(formatUnits(amountCollateral, 18));
    } else {
      // Selling token1 (outcome), receiving token0 (collateral)
      // Δy (outcome sold) = L * (√P_target - √P_current) / (2^96)
      // Δx (collateral received) = L * (√P_target - √P_current) / (√P_target * √P_current)
      const deltaSqrt = targetSqrtPriceX96 - currentSqrtPriceX96;
      const amountOutcome = (liquidity * deltaSqrt) / (1n << 96n);
      const amountCollateral =
        (liquidity * (1n << 96n) * deltaSqrt) /
        (targetSqrtPriceX96 * currentSqrtPriceX96);

      outcomeVolume = Number(formatUnits(amountOutcome, 18));
      collateralVolume = Number(formatUnits(amountCollateral, 18));
    }
  }

  return { outcomeVolume, collateralVolume };
}

export function getVolumeUntilPriceDual(
  pool: {
    liquidity: bigint;
    tickSpacing: number;
    tick: number;
    token0: Address;
    token1: Address;
  },
  ticks: { liquidityNet: string; tickIdx: string }[],
  targetPrice: number,
  outcome: Address,
  swapType: "buy" | "sell",
): { outcomeVolume: number; collateralVolume: number } {
  const clampedTarget = clamp(targetPrice, MIN_PRICE, MAX_PRICE);

  const isOutcomeToken0 = isTwoStringsEqual(pool.token0, outcome);
  let currentSqrtPriceX96 = BigInt(
    TickMath.getSqrtRatioAtTick(pool.tick).toString(),
  );
  const [num, den] = decimalToFraction(
    isOutcomeToken0 ? clampedTarget : 1 / clampedTarget,
  );
  const targetSqrtPriceX96 = BigInt(encodeSqrtRatioX96(num, den).toString());

  const movingUp =
    (isOutcomeToken0 && swapType === "buy") ||
    (!isOutcomeToken0 && swapType === "sell");
  if (movingUp && targetSqrtPriceX96 <= currentSqrtPriceX96)
    return { outcomeVolume: 0, collateralVolume: 0 };
  if (!movingUp && targetSqrtPriceX96 >= currentSqrtPriceX96)
    return { outcomeVolume: 0, collateralVolume: 0 };

  const relevantTicks = ticks
    .filter((tick) =>
      movingUp
        ? Number(tick.tickIdx) > pool.tick
        : Number(tick.tickIdx) < pool.tick,
    )
    .sort((a, b) =>
      movingUp
        ? Number(a.tickIdx) - Number(b.tickIdx)
        : Number(b.tickIdx) - Number(a.tickIdx),
    );

  let totalOutcome = 0;
  let totalCollateral = 0;
  let liquidity = pool.liquidity;

  for (let i = 0; i < relevantTicks.length; i++) {
    const tick = Number(relevantTicks[i].tickIdx);
    const sqrtAtTick = BigInt(TickMath.getSqrtRatioAtTick(tick).toString());

    const targetWithinRange = movingUp
      ? targetSqrtPriceX96 <= sqrtAtTick
      : targetSqrtPriceX96 >= sqrtAtTick;

    const rangeEnd = targetWithinRange ? targetSqrtPriceX96 : sqrtAtTick;
    const { outcomeVolume, collateralVolume } = getVolumeWithinRangeDual(
      currentSqrtPriceX96,
      rangeEnd,
      liquidity,
      isOutcomeToken0,
      swapType,
    );

    totalOutcome += outcomeVolume;
    totalCollateral += collateralVolume;

    if (targetWithinRange) break;

    currentSqrtPriceX96 = sqrtAtTick;
    liquidity += BigInt(relevantTicks[i].liquidityNet) * (movingUp ? 1n : -1n);
  }

  return { outcomeVolume: totalOutcome, collateralVolume: totalCollateral };
}

/**
 * @returns "{collateral, outcome}" - Gives the amount of collateral and outcome volume/token
 *                                  you would need to reach the target price, whether it's buy or sell
 */
export function useVolumeUntilPriceDual(
  underlying: Address,
  outcome: Address,
  swapType: "buy" | "sell",
  targetPrice: number | undefined,
) {
  const { data: ticksByPool } = useTicksData(underlying, outcome);
  if (
    !ticksByPool ||
    isUndefined(targetPrice) ||
    targetPrice > 1 ||
    targetPrice < 0
  ) {
    return;
  }

  const { ticks, poolInfo } = Object.values(ticksByPool)[0];
  const currentPrice = Number(
    tickToPrice(poolInfo.tick)[
      isTwoStringsEqual(poolInfo.token0, outcome) ? 0 : 1
    ],
  );
  if (currentPrice === targetPrice) {
    return;
  }
  return getVolumeUntilPriceDual(
    poolInfo,
    ticks,
    targetPrice,
    outcome,
    swapType,
  );
}
