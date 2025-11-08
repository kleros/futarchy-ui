import { useMutation, useQueryClient } from "@tanstack/react-query";
import { writeContract } from "@wagmi/core";
import { Address, encodeFunctionData, erc20Abi } from "viem";

import { TradeExecutorAbi } from "@/contracts/abis/TradeExecutorAbi";
import { gnosisRouterAbi, gnosisRouterAddress } from "@/generated";
import { config } from "@/wagmiConfig";

import { waitForTransaction } from "@/utils/waitForTransaction";

import { collateral, DEFAULT_CHAIN } from "@/consts";
import { parentMarket } from "@/consts/markets";

interface RedeemProps {
  tradeExecutor: Address;
  tokens: Address[];
  amounts: bigint[];
  outcomeIndexes: bigint[];
}

async function redeemParentsToTradeExecutor({
  tradeExecutor,
  tokens,
  amounts,
  outcomeIndexes,
}: RedeemProps) {
  const approveCalls = tokens.map((token, index) => ({
    to: token,
    data: encodeFunctionData({
      abi: erc20Abi,
      functionName: "approve",
      args: [gnosisRouterAddress, amounts[index]],
    }),
  }));

  const redeemCall = {
    to: gnosisRouterAddress,
    data: encodeFunctionData({
      abi: gnosisRouterAbi,
      functionName: "redeemPositions",
      args: [collateral.address, parentMarket, outcomeIndexes, amounts],
    }),
  };

  const calls = [redeemCall, ...approveCalls];

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

/**
 *
 * @returns Redeems leftover market tokens directly to collateral (sDAI)
 */
export const useRedeemParentsToTradeExecutor = (onSuccess?: () => unknown) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (props: RedeemProps) => redeemParentsToTradeExecutor(props),
    onSuccess() {
      onSuccess?.();
      queryClient.refetchQueries({ queryKey: ["useTokenBalance"] });
    },
  });
};
