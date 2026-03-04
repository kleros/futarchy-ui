import { useMemo } from "react";

import { useMarketsStore } from "@/store/markets";

/**
 * @returns Markets with active predictions (prediction !== marketEstimate) for Predict All
 */
export const usePredictionMarkets = () => {
  const markets = useMarketsStore((s) => s.markets);
  return useMemo(
    () =>
      Object.values(markets).filter(
        (market) => market.prediction !== market?.marketEstimate,
      ),
    [markets],
  );
};
