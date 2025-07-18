import { Address } from "viem";
import { useAccount } from "wagmi";

import { useReadErc20Allowance } from "@/generated";

export const useAllowance = (token: Address, contractAddress?: Address) => {
  const { address } = useAccount();
  return useReadErc20Allowance({
    address: token,
    args: [
      address ?? "0x",
      contractAddress ?? "0xffb643e73f280b97809a8b41f7232ab401a04ee1",
    ],
    query: {
      staleTime: 5000,
      enabled: typeof address !== "undefined",
    },
  });
};
