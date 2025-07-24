import { Price, Token, TokenAmount } from "@swapr/sdk";
import { useQuery } from "@tanstack/react-query";
import { Address, parseEther } from "viem";
import { gnosis } from "viem/chains";
import { usePublicClient } from "wagmi";

import { SWAPR_QUOTER_ADDRESS } from "@/utils/swapr";
import { getCurrenciesFromTokens } from "@/utils/trade";

import { SwaprQuoter } from "@/abi/SwaprQuoter";

// NOTE: assumes there is only one route, which is through the Outcome-Collateral token pool
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

        const simulation = await publicClient.simulateContract({
          address: SWAPR_QUOTER_ADDRESS,
          abi: SwaprQuoter,
          functionName: "quoteExactInputSingle",
          args: [collateralToken, outcomeToken, parseEther("1"), 0n],
        });

        const { currencyIn, currencyOut, currencyAmountIn } =
          getCurrenciesFromTokens(
            gnosis.id,
            outcomeToken,
            collateralToken,
            "1",
          );

        const simulationPrice = new Price({
          baseCurrency: currencyIn,
          quoteCurrency: currencyOut,
          denominator: currencyAmountIn.raw,
          numerator: new TokenAmount(
            new Token(gnosis.id, collateralToken, 18),
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
