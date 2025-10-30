import { Address, erc20Abi } from "viem";
import { useAccount, useReadContracts } from "wagmi";

export const useTokenBalances = (tokens: Array<Address>) => {
  const { address } = useAccount();
  return useReadContracts({
    contracts: tokens.map((token) => ({
      address: token,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [address],
    })),
    query: {
      staleTime: 5000,
      enabled: typeof address !== "undefined",
      refetchInterval: 5000,
    },
  });
};
