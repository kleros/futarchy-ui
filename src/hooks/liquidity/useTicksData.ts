import { useQuery } from "@tanstack/react-query";
import { Address } from "viem";

import { getPoolAndTicksData } from "./getTicksData";
import { PoolInfo } from "./useMarketPools";
import { getToken0Token1 } from "./utils";

export const useTicksData = (
  underlying: Address,
  outcome: Address,
  enabled = true,
) => {
  return useQuery<
    | {
        [key: string]: {
          ticks: {
            tickIdx: string;
            liquidityNet: string;
          }[];
          poolInfo: PoolInfo;
        };
      }
    | undefined,
    Error
  >({
    queryKey: ["useTicksData", underlying, outcome],
    enabled,
    staleTime: 60_000,
    retry: 2,
    queryFn: async () => {
      const { token0, token1 } = getToken0Token1(underlying, outcome);
      return await getPoolAndTicksData(token0, token1);
    },
  });
};
