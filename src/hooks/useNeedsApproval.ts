import { useMemo } from "react";

import { RefetchOptions, QueryObserverResult } from "@tanstack/react-query";
import { Address } from "viem";

import { useTokenAllowances } from "./useTokenAllowances";

interface IUseNeedsApproval {
  needsApproval: Array<Address>;
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult> | void;
  isLoading: boolean;
}

export const useNeedsApproval = (
  tokens: Array<Address>,
  amounts: Array<bigint>,
  spender: Address,
) => {
  const {
    data: allowances,
    refetch,
    isLoading,
  } = useTokenAllowances(tokens, spender);

  return useMemo<IUseNeedsApproval>(() => {
    if (typeof allowances !== "undefined") {
      return {
        needsApproval: allowances
          .map(({ result }, i) => ({ address: tokens[i], result }))
          .filter(
            ({ result }, i) =>
              typeof result === "bigint" && result < amounts[i],
          )
          .map(({ address }) => address as Address),
        refetch,
        isLoading,
      };
    }
    return { needsApproval: [], refetch: () => {}, isLoading: false };
  }, [allowances, amounts, refetch, isLoading, tokens]);
};
