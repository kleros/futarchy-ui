import { useMutation } from "@tanstack/react-query";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { Address, parseEventLogs } from "viem";

import { futarchyFactoryAbi, futarchyFactoryAddress } from "@/generated";
import { config } from "@/wagmiConfig";

import type { ChildScalarConfig } from "@/utils/factory";

import { DEFAULT_CHAIN } from "@/consts";

export interface ChildBatchArgs {
  sessionId: bigint;
  batch: ChildScalarConfig[];
}

export interface ChildBatchResult {
  hash: `0x${string}`;
  childMarkets: Address[];
}

async function deploySessionChildBatch({
  sessionId,
  batch,
}: ChildBatchArgs): Promise<ChildBatchResult> {
  const hash = await writeContract(config, {
    address: futarchyFactoryAddress,
    abi: futarchyFactoryAbi,
    functionName: "deploySessionChildBatch",
    args: [sessionId, batch.map((c) => ({ ...c }))],
    chainId: DEFAULT_CHAIN.id,
  });

  const receipt = await waitForTransactionReceipt(config, {
    hash,
    confirmations: 2,
  });
  if (receipt.status === "reverted") {
    throw new Error("Child batch transaction reverted.");
  }

  const childLogs = parseEventLogs({
    abi: futarchyFactoryAbi,
    eventName: "ChildMarketDeployed",
    logs: receipt.logs,
  });

  return {
    hash,
    childMarkets: [...childLogs]
      .sort((a, b) =>
        Number(a.args.parentOutcomeIndex - b.args.parentOutcomeIndex),
      )
      .map((log) => log.args.childMarket),
  };
}

export const useDeploySessionChildBatch = () =>
  useMutation({ mutationFn: deploySessionChildBatch });
