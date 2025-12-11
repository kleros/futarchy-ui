import { useMemo } from "react";

import { useMarketsStore } from "@/store/markets";

/**
 *
 * @returns Returns the markets for predictAll, excludes the one's with prediction === marketEstimate
 */
export const usePredictionMarkets = () => {
  const markets = useMarketsStore((s) => s.markets);
  const predictionMarkets = useMemo(() => {
    return Object.values(markets).filter(
      (market) => market.prediction !== market?.marketEstimate,
    );
  }, [markets]);
  return predictionMarkets;
};
