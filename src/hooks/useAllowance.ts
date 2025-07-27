import { Address } from "viem";
import { useAccount } from "wagmi";

import { useReadErc20Allowance } from "@/generated";

import { SWAPR_CONTRACT } from "@/consts";

export const useAllowance = (token: Address, contractAddress?: Address) => {
  const { address } = useAccount();
  return useReadErc20Allowance({
    address: token,
    args: [address ?? "0x", contractAddress ?? SWAPR_CONTRACT],
    query: {
      staleTime: 5000,
      enabled: typeof address !== "undefined",
    },
  });
};
