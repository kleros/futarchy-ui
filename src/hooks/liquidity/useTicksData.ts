import { useQuery } from "@tanstack/react-query";
import { Address } from "viem";

import { getPoolAndTicksData } from "./getTicksData";
import { PoolInfo } from "./useMarketPools";
import { getToken0Token1 } from "./utils";

export const useTicksData = (underlying: Address, outcome: Address) => {
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
    queryFn: async () => {
      const { token0, token1 } = getToken0Token1(underlying, outcome);
      return await getPoolAndTicksData(token0, token1);
    },
  });
};
