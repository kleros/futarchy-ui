import { Address, erc20Abi } from "viem";
import { useAccount, useReadContracts } from "wagmi";

import { isUndefined } from "@/utils";

export const useTokenBalances = (tokens: Array<Address>, account?: Address) => {
  const { address } = useAccount();
  return useReadContracts({
    contracts: tokens.map((token) => ({
      address: token,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [account ?? address],
    })),
    query: {
      staleTime: 5000,
      enabled: !isUndefined(account ?? address),
      refetchInterval: 5000,
    },
  });
};
