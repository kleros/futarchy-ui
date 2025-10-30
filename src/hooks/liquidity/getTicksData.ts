import { Address } from "viem";

import {
  OrderDirection,
  Tick_OrderBy,
  getSdk as getSwaprSdk,
  GetTicksQuery,
} from "./gql/gql";

import { PoolInfo, getPools } from "./useMarketPools";
import { getSwaprClient } from "./utils";

async function getTicks(poolId: string) {
  const graphQLClient = getSwaprClient();
  if (!graphQLClient) {
    throw new Error("Subgraph not available");
  }

  const graphQLSdk = getSwaprSdk;
  let total: GetTicksQuery["ticks"] = [];
  let tickIdx = "";
  while (true) {
    const { ticks } = await graphQLSdk(graphQLClient).GetTicks({
      first: 1000,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      orderBy: Tick_OrderBy.TickIdx as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      orderDirection: OrderDirection.Asc as any,
      where: {
        poolAddress: poolId,
        // liquidityNet_not: "0",
        ...(tickIdx && { tickIdx_gt: tickIdx }),
      },
    });
    total = total.concat(ticks);
    tickIdx = ticks[ticks.length - 1]?.tickIdx;
    if (ticks.length < 1000) {
      break;
    }
  }
  return total;
}

export async function getPoolAndTicksData(token0: Address, token1: Address) {
  try {
    const pools = await getPools().fetch({ token0, token1 });

    const ticksByPool = await Promise.all(
      pools.map((pool) => getTicks(pool.id)),
    );

    return pools.reduce(
      (acc, curr, index) => {
        acc[curr.id] = {
          ticks: ticksByPool[index],
          poolInfo: pools[index],
        };
        return acc;
      },
      {} as {
        [key: string]: {
          ticks: {
            tickIdx: string;
            liquidityNet: string;
          }[];
          poolInfo: PoolInfo;
        };
      },
    );
  } catch (e) {
    console.error("getTicksData", e);
    return {};
  }
}
