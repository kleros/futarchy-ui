import { useQuery } from "@tanstack/react-query";
import { Address } from "viem";

import { checkTradeExecutorCreated } from "@/utils/tradeWallet/deployTradeExecutor";

export const useCheckTradeExecutorCreated = (account: Address | undefined) => {
  return useQuery({
    enabled: !!account,
    queryKey: ["useCheckTradeExecutorCreated", account],
    staleTime: Infinity,
    queryFn: () => checkTradeExecutorCreated(account!),
  });
};
