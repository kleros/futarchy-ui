import { Address, erc20Abi } from "viem";
import { useAccount, useReadContracts } from "wagmi";

export const useTokenAllowances = (
  tokens: Array<Address>,
  spender: Address,
) => {
  const { address } = useAccount();
  return useReadContracts({
    contracts: tokens.map((token) => ({
      address: token,
      abi: erc20Abi,
      functionName: "allowance",
      args: [address, spender],
    })),
    query: {
      staleTime: 5000,
      enabled: typeof address !== "undefined",
    },
  });
};
