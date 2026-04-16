import type { IMarket } from "@/consts/markets";

type MarketRangeFields = Pick<IMarket, "minValue" | "maxValue">;

/**
 * Min/max USD from investment: −50% / +100% (rounded to whole dollars).
 * @note RealT specific
 */
export function deriveMarketRangeFromInvestment(initialInvestmentUsd: number) {
  return {
    minValue: Math.round(0.5 * initialInvestmentUsd),
    maxValue: Math.round(2 * initialInvestmentUsd),
  };
}

/**
 * `predictedPrice` in [0, 1] from stored USD prediction (for AMM / target price).
 */
export function predictionToNormalizedPrice(
  predictionUsd: number,
  market: MarketRangeFields,
) {
  const range = market.maxValue - market.minValue;
  if (range <= 0) {
    return 0;
  }
  return (predictionUsd - market.minValue) / range;
}

/** Inverse of {@link predictionToNormalizedPrice} (whole USD). */
export function normalizedPriceToPrediction(
  normalized: number,
  market: MarketRangeFields,
) {
  const range = market.maxValue - market.minValue;
  if (range <= 0) {
    return market.minValue;
  }
  return Math.round(market.minValue + normalized * range);
}

export function formatUsd(dollars: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(dollars));
}

export function formatUsdPlain(dollars: number) {
  return String(Math.round(dollars));
}

export function outcomeRangeSpan(market: MarketRangeFields) {
  return Math.max(0, market.maxValue - market.minValue);
}

export function outcomeFromPoolPrice(
  poolPriceUp: number,
  market: MarketRangeFields,
) {
  const range = market.maxValue - market.minValue;
  if (range <= 0) {
    return market.minValue;
  }
  return Math.round(market.minValue + poolPriceUp * range);
}

export function chartValueFromPoolPrice(
  poolPriceUp: number,
  market: MarketRangeFields,
) {
  const valueSpan = market.maxValue - market.minValue;
  if (valueSpan === 0) {
    return market.minValue;
  }
  return market.minValue + poolPriceUp * valueSpan;
}
