import { useQuery } from "@tanstack/react-query";
import { getBalance } from "@wagmi/core";
import { Address } from "viem";

import { config } from "@/wagmiConfig";

import { DEFAULT_CHAIN } from "@/consts";

export const fetchTokenBalance = async (account: Address, token: Address) => {
  return await getBalance(config, {
    address: account,
    token,
    chainId: DEFAULT_CHAIN.id,
  });
};

export const useTokenBalance = ({
  address,
  token,
}: {
  address: Address | undefined;
  token: Address;
}) => {
  return useQuery({
    enabled: !!address,
    queryKey: ["useTokenBalance", address, token],
    queryFn: () => fetchTokenBalance(address!, token),
  });
};
