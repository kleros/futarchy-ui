import { useMutation, useQueryClient } from "@tanstack/react-query";
import { writeContract } from "@wagmi/core";
import { Address, encodeFunctionData, erc20Abi } from "viem";

import { TradeExecutorAbi } from "@/contracts/abis/TradeExecutorAbi";
import { gnosisRouterAbi, gnosisRouterAddress } from "@/generated";
import { config } from "@/wagmiConfig";

import { waitForTransaction } from "@/utils/waitForTransaction";

import { collateral, DEFAULT_CHAIN } from "@/consts";
import { invalidMarket, markets, parentMarket } from "@/consts/markets";

interface MergeProps {
  tradeExecutor: Address;
  amount: bigint;
}

async function mergeFromTradeExecutor({ tradeExecutor, amount }: MergeProps) {
  const approveCalls = [
    ...markets.map((market) => ({
      to: market.underlyingToken,
      data: encodeFunctionData({
        abi: erc20Abi,
        functionName: "approve",
        args: [gnosisRouterAddress, amount],
      }),
    })),
    {
      to: invalidMarket,
      data: encodeFunctionData({
        abi: erc20Abi,
        functionName: "approve",
        args: [gnosisRouterAddress, amount],
      }),
    },
  ];

  const mergeCall = {
    to: gnosisRouterAddress,
    data: encodeFunctionData({
      abi: gnosisRouterAbi,
      functionName: "mergePositions",
      args: [collateral.address, parentMarket, amount],
    }),
  };
  const calls = [...approveCalls, mergeCall];
  console.log({ calls });

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

export const useTradeExecutorMerge = (onSuccess?: () => unknown) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (props: MergeProps) => mergeFromTradeExecutor(props),
    onSuccess() {
      onSuccess?.();
      queryClient.refetchQueries({ queryKey: ["useTokenBalance"] });
      queryClient.refetchQueries({ queryKey: ["useTokenBalances"] });
    },
  });
};
