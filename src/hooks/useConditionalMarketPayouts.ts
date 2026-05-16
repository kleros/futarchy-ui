import { useMemo } from "react";

import { Address, Hex } from "viem";
import { useReadContracts } from "wagmi";

import { conditionalTokensAbi, conditionalTokensAddress } from "@/generated";

import { isUndefined } from "@/utils";

import { DEFAULT_CHAIN } from "@/consts";
import { IMarket } from "@/consts/markets";

export const payoutDenominatorContract = (conditionId: Hex) =>
  ({
    address: conditionalTokensAddress,
    abi: conditionalTokensAbi,
    functionName: "payoutDenominator" as const,
    args: [conditionId],
    chainId: DEFAULT_CHAIN.id,
  }) as const;

export const payoutNumeratorsContract = (
  conditionId: Hex,
  outcomeSlotIndex: bigint,
) =>
  ({
    address: conditionalTokensAddress,
    abi: conditionalTokensAbi,
    functionName: "payoutNumerators" as const,
    args: [conditionId, outcomeSlotIndex],
    chainId: DEFAULT_CHAIN.id,
  }) as const;

type ConditionalMarketPayout = {
  marketId: Address;
  conditionId: Hex;
  denominator: bigint;
  numeratorUp: bigint;
  numeratorDown: bigint;
};

export function useConditionalMarketPayouts({
  markets,
  enabled = true,
}: {
  markets: IMarket[];
  enabled?: boolean;
}) {
  const isEnabled = enabled && markets.length > 0;

  const { data, isLoading } = useReadContracts({
    allowFailure: false,
    contracts: markets.flatMap((m) => [
      payoutDenominatorContract(m.conditionId),
      payoutNumeratorsContract(m.conditionId, 1n),
      payoutNumeratorsContract(m.conditionId, 0n),
    ]),
    query: { enabled: isEnabled },
  });

  const payouts = useMemo(() => {
    if (isUndefined(data)) {
      return [];
    }

    return markets.map((market, i) => {
      const b = i * 3;
      return {
        marketId: market.marketId,
        conditionId: market.conditionId,
        denominator: data[b],
        numeratorUp: data[b + 1],
        numeratorDown: data[b + 2],
      };
    });
  }, [data, markets]);

  const payoutsByMarketId = useMemo(() => {
    const map = new Map<string, ConditionalMarketPayout>();
    for (const payout of payouts) {
      map.set(payout.marketId, payout);
    }
    return map;
  }, [payouts]);

  return {
    payoutsByMarketId,
    isLoading,
  };
}
