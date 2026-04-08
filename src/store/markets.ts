import { create } from "zustand";
import { persist } from "zustand/middleware";

import { isUndefined } from "@/utils";
import { predictionToNormalizedPrice } from "@/utils/marketRange";

import { IMarket, parentMarket } from "@/consts/markets";

export interface PredictionMarket extends IMarket {
  prediction?: number;
  predictedPrice?: number;
  marketEstimate?: number;
}

interface MarketsStore {
  markets: Record<string, PredictionMarket>;
  setMarket: (market: PredictionMarket) => void;
  setPrediction: (marketId: string, prediction: number) => void;
  setMarketEstimate: (marketId: string, estimate: number) => void;
  resetPredictionMarkets: () => void;
  removeMarket: (marketId: string) => void;
}

export const useMarketsStore = create<MarketsStore>()(
  persist(
    (set) => ({
      markets: {},

      setMarket: (market) =>
        set((state) => ({
          markets: {
            ...state.markets,
            [market.marketId]: {
              ...state.markets[market.marketId],
              ...market,
            },
          },
        })),

      setPrediction: (marketId, prediction) =>
        set((state) => {
          const market = state.markets[marketId];
          if (isUndefined(market)) return state;

          const predictedPrice = predictionToNormalizedPrice(
            prediction,
            market,
          );
          return {
            markets: {
              ...state.markets,
              [marketId]: { ...market, prediction, predictedPrice },
            },
          };
        }),

      setMarketEstimate: (marketId, estimate) =>
        set((state) => ({
          markets: {
            ...state.markets,
            [marketId]: {
              ...state.markets[marketId],
              marketEstimate: estimate,
            },
          },
        })),

      resetPredictionMarkets: () =>
        set((state) => {
          const markets = state.markets;
          const updatedMarkets = Object.fromEntries(
            Object.entries(markets).map(([marketId, market]) => {
              const estimate = state.markets[marketId].marketEstimate ?? 0;

              return [
                marketId,
                {
                  ...market,
                  prediction: estimate,
                  predictedPrice: predictionToNormalizedPrice(estimate, market),
                },
              ];
            }),
          );

          return { markets: updatedMarkets };
        }),

      removeMarket: (marketId) =>
        set((state) => {
          const market = state.markets[marketId];
          if (isUndefined(market)) return state;

          const estimate = market.marketEstimate;
          return {
            markets: {
              ...state.markets,
              // Setting the prediction to marketEstimate,
              // removes it from the predicable markets (@/hooks/usePredictionMarkets)
              [marketId]: {
                ...market,
                prediction: estimate,
                predictedPrice: isUndefined(estimate)
                  ? undefined
                  : predictionToNormalizedPrice(estimate, market),
              },
            },
          };
        }),
    }),
    {
      name: `futarchy-realt-predictions-${parentMarket}`,
      partialize: (state) => ({
        markets: Object.fromEntries(
          Object.entries(state.markets)
            .filter(
              ([, m]) =>
                !isUndefined(m.prediction) && m.prediction !== m.marketEstimate,
            )
            .map(([id, m]) => [
              id,
              { prediction: m.prediction, predictedPrice: m.predictedPrice },
            ]),
        ),
      }),
    },
  ),
);
