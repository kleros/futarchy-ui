import { useMutation, useQueryClient } from "@tanstack/react-query";
import { writeContract } from "@wagmi/core";
import { Address, erc20Abi } from "viem";

import { sDaiAdapterAddress } from "@/generated";
import { config } from "@/wagmiConfig";

import { waitForTransaction } from "@/utils/waitForTransaction";

import { sDAIAdapterAbi } from "@/abi/sDAIAdapter";
import { DEFAULT_CHAIN } from "@/consts";

interface DepositProps {
  tradeExecutor: Address;
  token: Address;
  amount: bigint;
  isXDai: boolean;
}

async function depositToTradeExecutor({
  tradeExecutor,
  token,
  amount,
  isXDai,
}: DepositProps) {
  const writePromise = isXDai
    ? writeContract(config, {
        address: sDaiAdapterAddress,
        abi: sDAIAdapterAbi,
        functionName: "depositXDAI",
        chainId: DEFAULT_CHAIN.id,
        args: [tradeExecutor],
        value: amount,
      })
    : writeContract(config, {
        address: token,
        abi: erc20Abi,
        functionName: "transfer",
        chainId: DEFAULT_CHAIN.id,
        args: [tradeExecutor, amount],
      });

  const result = await waitForTransaction(() => writePromise);
  if (!result.status) {
    throw result.error;
  }
  return result;
}

export const useDepositToTradeExecutor = (onSuccess?: () => unknown) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (props: DepositProps) => depositToTradeExecutor(props),
    onSuccess() {
      onSuccess?.();
      queryClient.refetchQueries({ queryKey: ["useTokenBalance"] });
    },
  });
};
