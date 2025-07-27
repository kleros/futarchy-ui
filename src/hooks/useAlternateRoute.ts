import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

import { isUndefined } from "@/utils";
import { getSwaprQuote } from "@/utils/swapr";

export const useAlternateRoute = (
  targetToken: string,
  oppositeToken: string,
  underlyingToken: string,
  amount?: string,
  enabled: boolean = true,
) => {
  const { address } = useAccount();
  return useQuery({
    enabled: enabled && !isUndefined(amount) && !isUndefined(address),
    queryKey: [
      `market-alternate-route-${targetToken.toLowerCase()}-${oppositeToken.toLowerCase()}`,
    ],
    // we only call this once while determining best route and use the quote from this query too
    staleTime: Infinity,
    retry: (failureCount) => failureCount < 3,
    queryFn: async () => {
      const sellQuote = await getSwaprQuote({
        address,
        outcomeToken: underlyingToken,
        collateralToken: oppositeToken,
        amount: amount,
      });
      const reBuyQuote = await getSwaprQuote({
        address,
        outcomeToken: targetToken,
        collateralToken: underlyingToken,
        amount: sellQuote?.outputAmount.toExact(),
      });

      const amountAcquired =
        Number(amount) + Number(reBuyQuote?.outputAmount.toExact());
      return { amountAcquired, sellQuote, reBuyQuote };
    },
  });
};
