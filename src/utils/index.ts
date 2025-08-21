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
  const formattedValue = formatUnits(value, decimals);
  if (formattedValue === "0") {
    return "0";
  } else {
    const parsedValue = parseFloat(formattedValue);
    return parsedValue > 0.01 ? commify(parsedValue.toFixed(2)) : "<0.01";
  }
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

export function commify(value: string | number): string {
  const comps = String(value).split(".");

  if (!String(value).match(/^-?\d+(\.\d+)?$/)) {
    return "0";
  }

  // Make sure we have at least one whole digit (0 if none)
  let whole = comps[0];

  let negative = "";
  if (whole.substring(0, 1) === "-") {
    negative = "-";
    whole = whole.substring(1);
  }

  // Make sure we have at least 1 whole digit with no leading zeros
  while (whole.substring(0, 1) === "0") {
    whole = whole.substring(1);
  }
  if (whole === "") {
    whole = "0";
  }

  let suffix = "";
  if (comps.length === 2) {
    suffix = "." + (comps[1] || "0");
  }
  while (suffix.length > 2 && suffix[suffix.length - 1] === "0") {
    suffix = suffix.substring(0, suffix.length - 1);
  }

  const formatted: string[] = [];
  while (whole.length) {
    if (whole.length <= 3) {
      formatted.unshift(whole);
      break;
    } else {
      const index = whole.length - 3;
      formatted.unshift(whole.substring(index));
      whole = whole.substring(0, index);
    }
  }

  if (suffix === ".0") suffix = "";

  return negative + formatted.join(",") + suffix;
}
