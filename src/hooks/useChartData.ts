"use client";

import { useQuery } from "@tanstack/react-query";
import { formatUnits } from "viem";

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

const getSqrtPrices = (
  sqrtPrice: string,
): { token0Price: `${number}`; token1Price: `${number}` } => {
  const sqrtPriceBigInt = BigInt(sqrtPrice);
  const token0Price = formatUnits(
    (2n ** 192n * 10n ** 18n) / (sqrtPriceBigInt * sqrtPriceBigInt),
    18,
  ) as `${number}`;
  const token1Price = formatUnits(
    (sqrtPriceBigInt * sqrtPriceBigInt * 10n ** 18n) / 2n ** 192n,
    18,
  ) as `${number}`;
  return { token0Price, token1Price };
};

export const useChartData = (markets: Array<IMarket>) =>
  useQuery<IChartData[]>({
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
            (dataPoint) => {
              let token0Price = dataPoint.token0Price;
              let token1Price = dataPoint.token1Price;
              const sqrtPrice = dataPoint.sqrtPrice;
              if (
                token0Price === "0" &&
                token1Price === "0" &&
                sqrtPrice &&
                sqrtPrice !== "0"
              ) {
                ({ token0Price, token1Price } = getSqrtPrices(sqrtPrice));
              }
              return {
                timestamp: dataPoint.periodStartUnix,
                value:
                  parseFloat(
                    (dataPoint.pool.token0.id.toLowerCase() ===
                    underlyingToken.toLowerCase()
                      ? token0Price
                      : token1Price
                    ).slice(0, 9),
                  ) * maxValue,
              };
            },
          );

          return { [name]: { market, data: processed } };
        }),
      );
    },
  });
