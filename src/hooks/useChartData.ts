"use client";

import { useQuery } from "@tanstack/react-query";

import { IMarket } from "@/consts/markets";

interface IDataPoint {
  pool: {
    id: string;
    token0: {
      id: string;
      name: string;
    };
    token1: {
      id: string;
      name: string;
    };
    liquidity: `${number}`;
  };
  liquidity: `${number}`;
  sqrtPrice: `${number}`;
  token0Price: `${number}`;
  token1Price: `${number}`;
  periodStartUnix: number;
}

type IReturn = Array<Array<IDataPoint>>;

export type IChartData = Record<
  string,
  { market: IMarket; data: Array<{ timestamp: number; value: number }> }
>;

export const useChartData = (markets: Array<IMarket>) =>
  useQuery({
    queryKey: [`chart-${markets.map(({ marketId }) => marketId).join("-")}`],
    queryFn: async () => {
      return await Promise.all(
        markets.map(async (market) => {
          const { marketId, maxValue, name, underlyingToken } = market;
          const params = new URLSearchParams();
          params.append("marketId", marketId);
          params.append("chainId", "100");

          const rawData: IReturn = await fetch(
            `/api/market-chart?${params.toString()}`,
          ).then((res) => res.json());

          const processed: IChartData[""]["data"] = rawData[1].map(
            (dataPoint) => ({
              timestamp: dataPoint.periodStartUnix,
              value:
                parseFloat(
                  (dataPoint.pool.token0.id.toLowerCase() ===
                  underlyingToken.toLowerCase()
                    ? dataPoint.token0Price
                    : dataPoint.token1Price
                  ).slice(0, 9),
                ) * maxValue,
            }),
          );

          return { [name]: { market, data: processed } };
        }),
      );
    },
  });
