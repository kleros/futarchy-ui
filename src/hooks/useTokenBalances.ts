import { useQuery } from "@tanstack/react-query";
import { readContracts } from "@wagmi/core";
import { Address, erc20Abi } from "viem";

import { config } from "@/wagmiConfig";

import { DEFAULT_CHAIN } from "@/consts";

export const fetchTokensBalances = async (
  account: Address,
  tokens: Address[],
): Promise<bigint[]> => {
  try {
    const balances = (await readContracts(config, {
      allowFailure: false,
      contracts: tokens.map((token) => ({
        address: token,
        abi: erc20Abi,
        functionName: "balanceOf",
        chainId: DEFAULT_CHAIN.id,
        args: [account],
      })),
    })) as bigint[];
    return balances;
  } catch {
    return [];
  }
};

export const useTokensBalances = (
  account: Address | undefined,
  tokens: Address[] | undefined,
) => {
  return useQuery({
    enabled: !!account && tokens && tokens.length > 0,
    queryKey: ["useTokensBalances", account, tokens],
    queryFn: () => fetchTokensBalances(account!, tokens!),
  });
};
