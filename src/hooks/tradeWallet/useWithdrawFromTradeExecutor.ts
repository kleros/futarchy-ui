import { useMutation, useQueryClient } from "@tanstack/react-query";
import { writeContract } from "@wagmi/core";
import { Address, encodeFunctionData, erc20Abi } from "viem";

import { TradeExecutorAbi } from "@/contracts/abis/TradeExecutorAbi";
import { config } from "@/wagmiConfig";

import { waitForTransaction } from "@/utils/waitForTransaction";

import { DEFAULT_CHAIN } from "@/consts";

interface WithdrawProps {
  account: Address;
  tradeExecutor: Address;
  tokens: Address[];
  amounts: bigint[];
  isXDai?: boolean;
}

async function withdrawFromTradeExecutor({
  account,
  tradeExecutor,
  tokens,
  amounts,
  isXDai = false,
}: WithdrawProps) {
  const calls = isXDai
    ? [
        {
          to: account,
          data: "0x",
          value: amounts[0],
        },
      ]
    : tokens.map((token, index) => {
        return {
          to: token,
          data: encodeFunctionData({
            abi: erc20Abi,
            functionName: "transfer",
            args: [account, amounts[index]],
          }),
        };
      });
  const writePromise = writeContract(config, {
    address: tradeExecutor,
    abi: TradeExecutorAbi,
    functionName: isXDai ? "batchValueExecute" : "batchExecute",
    args: [calls],
    value: 0n,
    chainId: DEFAULT_CHAIN.id,
  });

  const result = await waitForTransaction(() => writePromise);
  if (!result.status) {
    throw result.error;
  }
  return result;
}

export const useWithdrawFromTradeExecutor = (onSuccess?: () => unknown) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (props: WithdrawProps) => withdrawFromTradeExecutor(props),
    onSuccess() {
      onSuccess?.();
      queryClient.refetchQueries({ queryKey: ["useTokenBalance"] });
    },
  });
};
