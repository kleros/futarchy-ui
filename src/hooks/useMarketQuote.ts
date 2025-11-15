import { useQuery } from "@tanstack/react-query";
import { gnosis } from "viem/chains";
import { useAccount } from "wagmi";

import { getSwaprQuote } from "@/utils/swapr";

export const useMarketQuote = (
  token: string,
  collateralToken: string,
  amount?: string,
  enabled: boolean = true,
) => {
  const { address } = useAccount();
  return useQuery({
    enabled,
    queryKey: [`market`, token, collateralToken, amount],
    staleTime: 10000,
    retry: (failureCount) => failureCount < 3,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));

      return await getSwaprQuote({
        address,
        chain: gnosis.id,
        outcomeToken: token,
        collateralToken,
        amount: amount ?? "1",
      });
    },
  });
};
