import {
  Address,
  encodeAbiParameters,
  encodePacked,
  getAddress,
  Hex,
  keccak256,
} from "viem";

import { TradeExecutorBytecode } from "@/contracts/abis/TradeExecutorAbi";

import { GNOSIS_CREATE_CALL, SALT_KEY } from "@/consts";

import { formatBytecode } from "..";

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
  salt: Hex;
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

function getTradeExecutorDeploymentData(ownerAddress: Address): Hex {
  const constructorData = encodeAbiParameters(
    [{ type: "address" }],
    [ownerAddress],
  );
  return `${formatBytecode(TradeExecutorBytecode)}${constructorData.slice(2)}`;
}

// every input performCreate2 needs, derived from one normalised owner so a
// deployment and a prediction cannot disagree about the address
export function getTradeExecutorCreate2Args(ownerAddress: Address) {
  const owner = getAddress(ownerAddress);
  const deploymentData = getTradeExecutorDeploymentData(owner);
  const salt = generateSalt(owner);

  return {
    deploymentData,
    salt,
    predictedAddress: predictFactoryAddress({
      factoryAddress: GNOSIS_CREATE_CALL,
      salt,
      deploymentData,
    }),
  };
}

// the executor is deployed with CREATE2, so its address is derivable from the
// owner alone and is the same whether or not the deployment has happened
export function predictTradeExecutorAddress(ownerAddress: Address): Address {
  return getTradeExecutorCreate2Args(ownerAddress).predictedAddress;
}
