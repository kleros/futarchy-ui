import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Address, formatUnits } from "viem";
import { type UseSimulateContractReturnType } from "wagmi";

type ExtendedWagmiError = UseSimulateContractReturnType["error"] & {
  shortMessage?: string;
  metaMessages?: string[];
};

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const shortenAddress = (address: Address) =>
  `${address.slice(0, 6)}...${address.slice(-5, -1)}`;

export const formatValue = (value: bigint, decimals = 18) => {
  return parseFloat(formatUnits(value, decimals)).toFixed(2);
};

/**
 * @param error
 * @description Tries to extract the human readable error message, otherwise reverts to error.message
 * @returns Human readable error if possible
 */
export const parseWagmiError = (
  error: UseSimulateContractReturnType["error"],
) => {
  if (!error) return "";
  const extError = error as ExtendedWagmiError;

  const metaMessage = extError?.metaMessages?.[0];
  const shortMessage = extError?.shortMessage;

  return metaMessage ?? shortMessage ?? error.message;
};

export const isUndefined = (
  maybeObject: unknown,
): maybeObject is undefined | null =>
  typeof maybeObject === "undefined" || maybeObject === null;
