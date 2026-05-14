import { useMutation, useQueryClient } from "@tanstack/react-query";
import { writeContract } from "@wagmi/core";
import { Address, encodeFunctionData, erc20Abi } from "viem";

import { TradeExecutorAbi } from "@/contracts/abis/TradeExecutorAbi";
import {
  conditionalRouterAbi,
  conditionalRouterAddress,
  gnosisRouterAbi,
  gnosisRouterAddress,
} from "@/generated";
import { config } from "@/wagmiConfig";

import { waitForTransaction } from "@/utils/waitForTransaction";

import { collateral, DEFAULT_CHAIN } from "@/consts";
import { parentMarket } from "@/consts/markets";

const CHILD_OUTCOME_INDEXES = [1n, 0n] as const;

export interface ParentRedeemConfig {
  tokens: Address[];
  outcomeIndexes: bigint[];
  amounts: bigint[];
}

export interface ChildRedeemConfig {
  marketId: Address;
  parentMarketOutcome: bigint;
  upToken: Address;
  downToken: Address;
  upAmount: bigint;
  downAmount: bigint;
}

export interface FullRedeemBatchProps {
  tradeExecutor: Address;
  parent?: ParentRedeemConfig;
  children: ChildRedeemConfig[];
}

function buildFullRedeemCalls({ parent, children }: FullRedeemBatchProps): {
  to: Address;
  data: `0x${string}`;
}[] {
  const calls: { to: Address; data: `0x${string}` }[] = [];

  if (parent && parent.tokens.length > 0) {
    for (let i = 0; i < parent.tokens.length; i++) {
      calls.push({
        to: parent.tokens[i],
        data: encodeFunctionData({
          abi: erc20Abi,
          functionName: "approve",
          args: [gnosisRouterAddress, parent.amounts[i]],
        }),
      });
    }
    calls.push({
      to: gnosisRouterAddress,
      data: encodeFunctionData({
        abi: gnosisRouterAbi,
        functionName: "redeemPositions",
        args: [
          collateral.address,
          parentMarket,
          parent.outcomeIndexes,
          parent.amounts,
        ],
      }),
    });
  }

  for (const child of children) {
    if (child.upAmount > 0n) {
      calls.push({
        to: child.upToken,
        data: encodeFunctionData({
          abi: erc20Abi,
          functionName: "approve",
          args: [conditionalRouterAddress, child.upAmount],
        }),
      });
    }
    if (child.downAmount > 0n) {
      calls.push({
        to: child.downToken,
        data: encodeFunctionData({
          abi: erc20Abi,
          functionName: "approve",
          args: [conditionalRouterAddress, child.downAmount],
        }),
      });
    }
    if (child.upAmount > 0n || child.downAmount > 0n) {
      calls.push({
        to: conditionalRouterAddress,
        data: encodeFunctionData({
          abi: conditionalRouterAbi,
          functionName: "redeemConditionalToCollateral",
          args: [
            collateral.address,
            child.marketId,
            [...CHILD_OUTCOME_INDEXES],
            [child.parentMarketOutcome],
            [child.upAmount, child.downAmount], // needs to match the outcome index order, 1 for UP, 0 for DOWN
          ],
        }),
      });
    }
  }

  return calls;
}

async function redeemFullBatchToTradeExecutor(props: FullRedeemBatchProps) {
  const calls = buildFullRedeemCalls(props);
  if (calls.length === 0) {
    throw new Error("No redemption calls to execute");
  }

  const writePromise = writeContract(config, {
    address: props.tradeExecutor,
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

export const useRedeemFullBatchToTradeExecutor = (
  onSuccess?: () => unknown,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (p: FullRedeemBatchProps) => redeemFullBatchToTradeExecutor(p),
    onSuccess() {
      onSuccess?.();
      queryClient.refetchQueries({ queryKey: ["useTokenBalance"] });
      queryClient.refetchQueries({ queryKey: ["useTokensBalances"] });
    },
  });
};
