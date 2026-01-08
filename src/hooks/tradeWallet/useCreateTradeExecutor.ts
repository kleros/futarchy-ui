import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Address } from "viem";

import { initTradeExecutor } from "@/utils/tradeWallet/deployTradeExecutor";

export const useCreateTradeExecutor = (onSuccess?: () => unknown) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ account }: { account: Address }) =>
      initTradeExecutor(account),
    onSuccess() {
      onSuccess?.();
      queryClient.refetchQueries({
        queryKey: ["useCheckTradeExecutorCreated"],
      });
    },
  });
};
