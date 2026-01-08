import { useMutation, useQueryClient } from "@tanstack/react-query";
import { writeContract } from "@wagmi/core";
import { Address, encodeFunctionData, erc20Abi } from "viem";

import { TradeExecutorAbi } from "@/contracts/abis/TradeExecutorAbi";
import { conditionalRouterAbi, conditionalRouterAddress } from "@/generated";
import { config } from "@/wagmiConfig";

import { waitForTransaction } from "@/utils/waitForTransaction";

import { collateral, DEFAULT_CHAIN } from "@/consts";

interface RedeemProps {
  tradeExecutor: Address;
  tokens: Address[];
  amounts: bigint[];
  outcomeIndexes: bigint[];
  marketId: `0x${string}`;
  // the index set of the parent market token
  parentMarketOutcome: bigint;
}

async function redeemToTradeExecutor({
  tradeExecutor,
  tokens,
  amounts,
  outcomeIndexes,
  marketId,
  parentMarketOutcome,
}: RedeemProps) {
  const approveCalls = tokens.map((token, index) => ({
    to: token,
    data: encodeFunctionData({
      abi: erc20Abi,
      functionName: "approve",
      args: [conditionalRouterAddress, amounts[index]],
    }),
  }));

  const redeemCall = {
    to: conditionalRouterAddress,
    data: encodeFunctionData({
      abi: conditionalRouterAbi,
      functionName: "redeemConditionalToCollateral",
      args: [
        collateral.address,
        marketId,
        outcomeIndexes,
        [parentMarketOutcome],
        amounts,
      ],
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
 * @returns Redeems the UP-DOWN tokens directly to collateral (sDAI)
 */
export const useRedeemToTradeExecutor = (onSuccess?: () => unknown) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (props: RedeemProps) => redeemToTradeExecutor(props),
    onSuccess() {
      onSuccess?.();
      queryClient.refetchQueries({ queryKey: ["useTokenBalance"] });
    },
  });
};
