import { useMutation } from "@tanstack/react-query";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { Address, parseEventLogs } from "viem";

import { futarchyFactoryAbi, futarchyFactoryAddress } from "@/generated";
import { config } from "@/wagmiConfig";

import type { DeployFutarchySessionParams } from "@/utils/factory";

import { DEFAULT_CHAIN } from "@/consts";

export interface AtomicDeployResult {
  hash: `0x${string}`;
  sessionId: bigint;
  parentMarket: Address;
  childMarkets: Address[];
}

async function deployFutarchySession(
  params: DeployFutarchySessionParams,
): Promise<AtomicDeployResult> {
  const hash = await writeContract(config, {
    address: futarchyFactoryAddress,
    abi: futarchyFactoryAbi,
    functionName: "deployFutarchySession",
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
    throw new Error("Atomic deploy transaction reverted.");
  }

  const parentLogs = parseEventLogs({
    abi: futarchyFactoryAbi,
    eventName: "ParentMarketDeployed",
    logs: receipt.logs,
  });
  const childLogs = parseEventLogs({
    abi: futarchyFactoryAbi,
    eventName: "ChildMarketDeployed",
    logs: receipt.logs,
  });

  const parent = parentLogs[0];
  if (!parent) {
    throw new Error("ParentMarketDeployed event missing in receipt.");
  }

  const childMarkets = [...childLogs]
    .sort((a, b) =>
      Number(a.args.parentOutcomeIndex - b.args.parentOutcomeIndex),
    )
    .map((log) => log.args.childMarket);

  return {
    hash,
    sessionId: parent.args.sessionId,
    parentMarket: parent.args.parentMarket,
    childMarkets,
  };
}

export const useDeployFutarchySession = () =>
  useMutation({ mutationFn: deployFutarchySession });
