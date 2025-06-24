import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Address } from "viem";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const shortenAddress = (address: Address) =>
  `${address.slice(0, 6)}...${address.slice(-5, -1)}`;
