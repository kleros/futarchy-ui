import { Address } from "viem";

export const shortenAddress = (address: Address) =>
  `${address.slice(0, 6)}...${address.slice(-5, -1)}`;
