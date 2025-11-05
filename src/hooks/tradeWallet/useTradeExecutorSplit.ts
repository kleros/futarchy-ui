import { useMutation, useQueryClient } from "@tanstack/react-query";
import { writeContract } from "@wagmi/core";
import { Address, encodeFunctionData, erc20Abi } from "viem";

import { TradeExecutorAbi } from "@/contracts/abis/TradeExecutorAbi";
import { gnosisRouterAbi, gnosisRouterAddress } from "@/generated";
import { config } from "@/wagmiConfig";

import { waitForTransaction } from "@/utils/waitForTransaction";

import { collateral, DEFAULT_CHAIN } from "@/consts";
import { parentMarket } from "@/consts/markets";

interface SplitProps {
  tradeExecutor: Address;
  amount: bigint;
}

async function splitFromTradeExecutor({ tradeExecutor, amount }: SplitProps) {
  const approveCall = {
    to: collateral.address,
    data: encodeFunctionData({
      abi: erc20Abi,
      functionName: "approve",
      args: [gnosisRouterAddress, amount],
    }),
  };
  const splitCall = {
    to: gnosisRouterAddress,
    data: encodeFunctionData({
      abi: gnosisRouterAbi,
      functionName: "splitPosition",
      args: [collateral.address, parentMarket, amount],
    }),
  };
  const calls = [approveCall, splitCall];

  const writePromise = writeContract(config, {
    address: tradeExecutor,
    abi: TradeExecutorAbi,
    functionName: "batchExecute",
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

export const useTradeExecutorSplit = (onSuccess?: () => unknown) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (props: SplitProps) => splitFromTradeExecutor(props),
    onSuccess() {
      onSuccess?.();
      queryClient.refetchQueries({ queryKey: ["useTokenBalance"] });
      queryClient.refetchQueries({ queryKey: ["useTokenBalances"] });
    },
  });
};
