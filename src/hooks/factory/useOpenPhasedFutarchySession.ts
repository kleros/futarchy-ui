import { useMutation } from "@tanstack/react-query";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { Address, parseEventLogs } from "viem";

import { futarchyFactoryAbi, futarchyFactoryAddress } from "@/generated";
import { config } from "@/wagmiConfig";

import type { DeployFutarchySessionParams } from "@/utils/factory";

import { DEFAULT_CHAIN } from "@/consts";

export interface PhasedOpenResult {
  hash: `0x${string}`;
  sessionId: bigint;
  parentMarket: Address;
}

async function openPhasedFutarchySession(
  params: DeployFutarchySessionParams,
): Promise<PhasedOpenResult> {
  const hash = await writeContract(config, {
    address: futarchyFactoryAddress,
    abi: futarchyFactoryAbi,
    functionName: "openPhasedFutarchySession",
    args: [
      {
        parent: { ...params.parent },
        children: params.children.map((c) => ({ ...c })),
      },
    ],
    chainId: DEFAULT_CHAIN.id,
  });

  const receipt = await waitForTransactionReceipt(config, {
    hash,
    confirmations: 2,
  });
  if (receipt.status === "reverted") {
    throw new Error("Open phased session transaction reverted.");
  }

  const parentLogs = parseEventLogs({
    abi: futarchyFactoryAbi,
    eventName: "ParentMarketDeployed",
    logs: receipt.logs,
  });
  const parent = parentLogs[0];
  if (!parent) {
    throw new Error("ParentMarketDeployed event missing in receipt.");
  }

  return {
    hash,
    sessionId: parent.args.sessionId,
    parentMarket: parent.args.parentMarket,
  };
}

export const useOpenPhasedFutarchySession = () =>
  useMutation({ mutationFn: openPhasedFutarchySession });
