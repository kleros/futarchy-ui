import { useQuery } from "@tanstack/react-query";
import { gnosis } from "viem/chains";
import { useAccount } from "wagmi";

import { getSwaprQuoteExactOut } from "@/utils/swapr";

export const useMarketLimitQuote = (
  token: string,
  collateralToken: string,
  amountOut?: string,
  enabled: boolean = true,
) => {
  const { address } = useAccount();
  return useQuery({
    enabled,
    queryKey: [`market-limit`, token, collateralToken, amountOut],
    staleTime: 10000,
    retry: (failureCount) => failureCount < 3,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));

      return await getSwaprQuoteExactOut({
        address,
        chain: gnosis.id,
        outcomeToken: token,
        collateralToken,
        amount: amountOut ?? "1",
      });
    },
  });
};
