import { Price, Token, TokenAmount } from "@swapr/sdk";
import { useQuery } from "@tanstack/react-query";
import { Address, parseEther } from "viem";
import { gnosis } from "viem/chains";
import { usePublicClient } from "wagmi";

import { SWAPR_QUOTER_ADDRESS } from "@/utils/swapr";
import { getCurrenciesFromTokens } from "@/utils/trade";

import { SwaprQuoter } from "@/abi/SwaprQuoter";

/**
 * @param targetToken The token you want the price of, in terms of baseToken
 * @param baseToken The token you want to get the price in terms of
 * @param amount optional defaults to "1"
 * @returns The price of targetToken in terms of baseToken. targetTokens per baseToken. Ex:- 1 TARGET = 4 BASE
 * @note assumes there is only one route, which is through the target-base token pool
 */
export const useMarketPrice = (
  targetToken: Address,
  baseToken: Address,
  amount = "1",
) => {
  const publicClient = usePublicClient();
  return useQuery({
    queryKey: ["market-price", baseToken, targetToken, amount],
    refetchInterval: 10_000,
    enabled: amount !== "0",
    queryFn: async () => {
      try {
        if (!publicClient) return "0";

        const simulation = await publicClient.simulateContract({
          address: SWAPR_QUOTER_ADDRESS,
          abi: SwaprQuoter,
          functionName: "quoteExactInputSingle",
          args: [targetToken, baseToken, parseEther(amount), 0n],
        });

        const { currencyIn, currencyOut, currencyAmountIn } =
          getCurrenciesFromTokens(gnosis.id, baseToken, targetToken, amount);

        const simulationPrice = new Price({
          baseCurrency: currencyIn,
          quoteCurrency: currencyOut,
          denominator: currencyAmountIn.raw,
          numerator: new TokenAmount(
            new Token(gnosis.id, targetToken, 18),
            simulation.result[0],
          ).raw,
        });

        return simulationPrice.toFixed();
      } catch {
        return "0";
      }
    },
  });
};
