import { getBytecode, writeContract } from "@wagmi/core";
import {
  Address,
  encodeAbiParameters,
  encodePacked,
  Hex,
  keccak256,
} from "viem";

import { CreateCallAbi } from "@/contracts/abis/CreateCallAbi";
import { TradeExecutorBytecode } from "@/contracts/abis/TradeExecutorAbi";
import { config } from "@/wagmiConfig";

import { DEFAULT_CHAIN, GNOSIS_CREATE_CALL, SALT_KEY } from "@/consts";

import { formatBytecode } from "..";
import { waitForTransaction } from "../waitForTransaction";

interface FactoryDeployParams {
  factoryAddress: Address;
  ownerAddress: Address;
  bytecode: Hex;
  constructorData: Hex;
}

function generateSalt(ownerAddress: Address): Hex {
  return keccak256(
    encodePacked(["string", "address"], [SALT_KEY, ownerAddress]),
  );
}

function predictFactoryAddress({
  factoryAddress,
  salt,
  deploymentData,
}: {
  factoryAddress: Address;
  salt: Address;
  deploymentData: Hex;
}): Address {
  const initCodeHash = keccak256(deploymentData);

  const create2Input = encodePacked(
    ["bytes1", "address", "bytes32", "bytes32"],
    ["0xff", factoryAddress, salt, initCodeHash],
  );

  const hash = keccak256(create2Input);
  return `0x${hash.slice(-40)}` as Address;
}

async function checkContractCreated({
  factoryAddress,
  ownerAddress,
  bytecode,
  constructorData,
}: Omit<FactoryDeployParams, "supports7702">) {
  const deploymentData = `${bytecode}${constructorData.slice(2)}` as Hex;
  const salt = generateSalt(ownerAddress);

  // Predict contract address
  const predictedAddress = predictFactoryAddress({
    factoryAddress,
    salt,
    deploymentData,
  });

  // Check if already deployed
  const code = await getBytecode(config, {
    address: predictedAddress,
  });

  if (code && code !== "0x") {
    return { isCreated: true, predictedAddress };
  }
  return { isCreated: false };
}

async function checkAndDeployWithFactory({
  factoryAddress,
  ownerAddress,
  bytecode,
  constructorData,
}: FactoryDeployParams) {
  const deploymentData = `${bytecode}${constructorData.slice(2)}` as Hex;
  const salt = generateSalt(ownerAddress);

  // Predict contract address
  const predictedAddress = predictFactoryAddress({
    factoryAddress,
    salt,
    deploymentData,
  });

  // Check if already deployed
  const { isCreated } = await checkContractCreated({
    factoryAddress,
    ownerAddress,
    bytecode,
    constructorData,
  });

  if (isCreated) {
    return { predictedAddress };
  }

  try {
    await waitForTransaction(() =>
      writeContract(config, {
        address: factoryAddress,
        abi: CreateCallAbi,
        functionName: "performCreate2",
        args: [0n, deploymentData, salt],
        chainId: DEFAULT_CHAIN.id,
      }),
    );
  } catch (err: unknown) {
    console.log("Trade executor deployment error:", err);
  }
  return { predictedAddress };
}

export async function initTradeExecutor(account: Address) {
  const constructorData = encodeAbiParameters([{ type: "address" }], [account]);
  return await checkAndDeployWithFactory({
    factoryAddress: GNOSIS_CREATE_CALL,
    ownerAddress: account,
    bytecode: formatBytecode(TradeExecutorBytecode),
    constructorData,
  });
}

export async function checkTradeExecutorCreated(account: Address) {
  const constructorData = encodeAbiParameters([{ type: "address" }], [account]);
  return await checkContractCreated({
    factoryAddress: GNOSIS_CREATE_CALL,
    ownerAddress: account,
    bytecode: formatBytecode(TradeExecutorBytecode),
    constructorData,
  });
}
