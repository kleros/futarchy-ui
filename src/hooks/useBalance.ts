import { Address } from "viem";
import { useAccount } from "wagmi";

import { useReadErc20BalanceOf } from "@/generated";

export const useBalance = (token: Address) => {
  const { address } = useAccount();
  return useReadErc20BalanceOf({
    address: token,
    args: [address ?? "0x"],
    query: {
      staleTime: 5000,
      enabled: typeof address !== "undefined",
      refetchInterval: 5000,
    },
  });
};
