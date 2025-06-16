import { useQuery } from "@tanstack/react-query";

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

export type IChartData = Array<{ timestamp: number; value: number }>;

export const useChartData = (marketId: string, maxValue: number) =>
  useQuery({
    queryKey: [`chart-${marketId}`],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("marketId", marketId);
      params.append("chainId", "100");

      const rawData: IReturn = await fetch(
        `/api/market-chart?${params.toString()}`,
      ).then((res) => res.json());

      const processed: IChartData = rawData[1].map((dataPoint) => ({
        timestamp: dataPoint.periodStartUnix,
        value: parseFloat(dataPoint.token1Price.slice(0, 9)) * maxValue,
      }));

      return processed;
    },
  });
