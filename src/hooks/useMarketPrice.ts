import { JSBI } from "@swapr/sdk";
import { useQuery } from "@tanstack/react-query";
import { Price, Token } from "@uniswap/sdk-core";
import { Address } from "viem";
import { gnosis } from "viem/chains";
import { usePublicClient } from "wagmi";

import { computePoolAddress } from "@/utils/swapr";

import { SwaprPoolAbi } from "@/abi/SwaprPool";

export const useMarketPrice = (
  outcomeToken: Address,
  collateralToken: Address,
) => {
  const publicClient = usePublicClient();
  return useQuery({
    queryKey: ["market-price", outcomeToken, collateralToken],
    refetchInterval: 10_000,
    queryFn: async () => {
      try {
        if (!publicClient) return "0";

        const tokenA = new Token(gnosis.id, outcomeToken, 18);
        const tokenB = new Token(gnosis.id, collateralToken, 18);
        const { address } = computePoolAddress({
          tokenA,
          tokenB,
        });

        const [price] = await publicClient.readContract({
          address,
          abi: SwaprPoolAbi,
          functionName: "globalState",
        });

        const Q96 = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(96));
        const Q192 = JSBI.exponentiate(Q96, JSBI.BigInt(2));

        const SQ = JSBI.multiply(
          JSBI.BigInt(price.toString()),
          JSBI.BigInt(price.toString()),
        );
        const wasSorted = tokenB.sortsBefore(tokenA);
        const tokenPrice = new Price(
          tokenA,
          tokenB,
          wasSorted ? Q192 : SQ,
          wasSorted ? SQ : Q192,
        );

        return tokenPrice.toFixed();
      } catch {
        return "0";
      }
    },
  });
};
