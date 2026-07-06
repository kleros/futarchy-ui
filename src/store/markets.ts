import { create } from "zustand";
import { persist } from "zustand/middleware";

import { isUndefined } from "@/utils";

import { IMarket } from "@/consts/markets";

export interface PredictionMarket extends IMarket {
  prediction?: number;
  predictedPrice?: number;
  marketEstimate?: number;
  isReviewed?: boolean;
}

export const isMarketReviewed = (
  market?: Pick<
    PredictionMarket,
    "isReviewed" | "prediction" | "marketEstimate"
  >,
) =>
  !!market?.isReviewed ||
  (!isUndefined(market?.prediction) &&
    market.prediction !== market.marketEstimate);

interface MarketsStore {
  markets: Record<string, PredictionMarket>;
  setMarket: (market: PredictionMarket) => void;
  setPrediction: (
    marketId: string,
    prediction: number,
    options?: { reviewed?: boolean },
  ) => void;
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

      setPrediction: (marketId, prediction, options) =>
        set((state) => {
          const market = state.markets[marketId];
          if (isUndefined(market)) return state;

          const predictedPrice =
            prediction / (market.maxValue * market.precision);
          return {
            markets: {
              ...state.markets,
              [marketId]: {
                ...market,
                prediction,
                predictedPrice,
                isReviewed: options?.reviewed ? true : market.isReviewed,
              },
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
        set((state) => ({
          markets: Object.fromEntries(
            Object.entries(state.markets).map(([marketId, market]) => [
              marketId,
              {
                ...market,
                prediction: undefined,
                predictedPrice: undefined,
                isReviewed: false,
              },
            ]),
          ),
        })),

      removeMarket: (marketId) =>
        set((state) => {
          const market = state.markets[marketId];
          if (isUndefined(market)) return state;

          return {
            markets: {
              ...state.markets,
              // Setting the prediction to marketEstimate,
              // removes it from the predicable markets (@/hooks/usePredictionMarkets)
              [marketId]: {
                ...market,
                prediction: market?.marketEstimate,
                isReviewed: false,
              },
            },
          };
        }),
    }),
    {
      name: "futarchy-predictions",
      skipHydration: true,
      partialize: (state) => ({
        markets: Object.fromEntries(
          Object.entries(state.markets)
            .filter(
              ([, m]) =>
                !isUndefined(m.prediction) &&
                (m.prediction !== m.marketEstimate || m.isReviewed),
            )
            .map(([id, m]) => [
              id,
              {
                prediction: m.prediction,
                predictedPrice: m.predictedPrice,
                isReviewed: m.isReviewed,
              },
            ]),
        ),
      }),
    },
  ),
);
