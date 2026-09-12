import { getBytecode, writeContract } from "@wagmi/core";
import { Address } from "viem";

import { CreateCallAbi } from "@/contracts/abis/CreateCallAbi";
import { config } from "@/wagmiConfig";

import { DEFAULT_CHAIN, GNOSIS_CREATE_CALL } from "@/consts";

import { waitForTransaction } from "../waitForTransaction";

import { getTradeExecutorCreate2Args } from "./predictTradeExecutor";

export async function checkTradeExecutorCreated(account: Address) {
  const { predictedAddress } = getTradeExecutorCreate2Args(account);

  const code = await getBytecode(config, { address: predictedAddress });

  if (code && code !== "0x") {
    return { isCreated: true, predictedAddress };
  }
  return { isCreated: false };
}

export async function initTradeExecutor(account: Address) {
  const { deploymentData, salt, predictedAddress } =
    getTradeExecutorCreate2Args(account);

  const { isCreated } = await checkTradeExecutorCreated(account);
  if (isCreated) {
    return { predictedAddress };
  }

  const result = await waitForTransaction(() =>
    writeContract(config, {
      address: GNOSIS_CREATE_CALL,
      abi: CreateCallAbi,
      functionName: "performCreate2",
      args: [0n, deploymentData, salt],
      chainId: DEFAULT_CHAIN.id,
    }),
  );

  if (!result.status) {
    throw result.error;
  }

  return { predictedAddress };
}
