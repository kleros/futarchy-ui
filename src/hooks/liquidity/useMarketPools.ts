import * as batshit from "@yornaath/batshit";
import memoize from "micro-memoize";
import { Address } from "viem";

import {
  OrderDirection,
  Pool_OrderBy as SwaprPool_OrderBy,
  getSdk as getSwaprSdk,
  GetPoolsQuery,
} from "./gql/gql";

import { getSwaprClient } from "./utils";

export interface PoolInfo {
  id: Address;
  dex: string;
  fee: number;
  token0: Address;
  token1: Address;
  token0Price: number;
  token1Price: number;
  token0Symbol: string;
  token1Symbol: string;
  totalValueLockedToken0: number;
  totalValueLockedToken1: number;
  liquidity: bigint;
  tick: number;
  tickSpacing: number;
}

async function getSwaprPools(
  tokens: { token0: Address; token1: Address }[],
): Promise<PoolInfo[]> {
  const algebraClient = getSwaprClient();

  if (!algebraClient) {
    throw new Error("Subgraph not available");
  }

  const { pools } = await getSwaprSdk(algebraClient).GetPools({
    where: {
      or: tokens.map((t) => ({
        token0: t.token0.toLocaleLowerCase(),
        token1: t.token1.toLocaleLowerCase(),
      })),
    },
    orderBy: SwaprPool_OrderBy.TotalValueLockedUsd,
    orderDirection: OrderDirection.Desc,
    first: 1000,
  });

  return await Promise.all(
    pools.map(async (pool: GetPoolsQuery["pools"][number]) => ({
      id: pool.id as Address,
      dex: "Swapr",
      fee: Number(pool.fee),
      token0: pool.token0.id as Address,
      token1: pool.token1.id as Address,
      token0Price: Number(pool.token0Price),
      token1Price: Number(pool.token1Price),
      liquidity: BigInt(pool.liquidity),
      tick: Number(pool.tick),
      tickSpacing: Number(pool.tickSpacing),
      token0Symbol: pool.token0.symbol,
      token1Symbol: pool.token1.symbol,
      totalValueLockedToken0: Number(pool.totalValueLockedToken0),
      totalValueLockedToken1: Number(pool.totalValueLockedToken1),
    })),
  );
}

export const getPools = memoize(() => {
  return batshit.create({
    name: "getPools",
    fetcher: async (tokens: { token0: Address; token1: Address }[]) => {
      return getSwaprPools(tokens);
    },
    scheduler: batshit.windowScheduler(10),
    resolver: (pools, tokens) =>
      pools.filter(
        (p) =>
          p.token0 === tokens.token0.toLocaleLowerCase() &&
          p.token1 === tokens.token1.toLocaleLowerCase(),
      ),
  });
});
