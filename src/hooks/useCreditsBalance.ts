import { useMemo } from "react";

import { Address } from "viem";

import { foresightCreditsAddress, useReadSDaiPreviewRedeem } from "@/generated";

import { useTokenBalance } from "@/hooks/useTokenBalance";

import { isUndefined } from "@/utils";

interface UseCreditsBalanceResult {
  eoaCredits: bigint;
  walletCredits: bigint;
  totalCredits: bigint;
  eoaCreditsEquivalentXDAI: bigint | undefined;
  walletCreditsEquivalentXDAI: bigint | undefined;
  totalCreditsEquivalentXDAI: bigint;
}

export function useCreditsBalance({
  account,
  tradeExecutor,
  isXDai = false,
}: {
  account?: Address;
  tradeExecutor?: Address;
  isXDai?: boolean;
}): UseCreditsBalanceResult {
  const { data: eoaCreditsData } = useTokenBalance({
    address: account,
    token: foresightCreditsAddress,
  });
  const { data: walletCreditsData } = useTokenBalance({
    address: tradeExecutor,
    token: foresightCreditsAddress,
  });

  const eoaCredits = eoaCreditsData?.value ?? 0n;
  const walletCredits = walletCreditsData?.value ?? 0n;
  const totalCredits = eoaCredits + walletCredits;

  const { data: eoaCreditsEquivalentXDAI } = useReadSDaiPreviewRedeem({
    args: [eoaCredits],
    query: {
      enabled: !isUndefined(eoaCreditsData) && eoaCredits > 0 && isXDai,
      retry: false,
    },
  });
  const { data: walletCreditsEquivalentXDAI } = useReadSDaiPreviewRedeem({
    args: [walletCredits],
    query: {
      enabled: !isUndefined(walletCreditsData) && walletCredits > 0 && isXDai,
      retry: false,
    },
  });

  const totalCreditsEquivalentXDAI = useMemo(() => {
    if (!isXDai) return undefined;
    const eoa = eoaCreditsEquivalentXDAI ?? 0n;
    const wallet = walletCreditsEquivalentXDAI ?? 0n;
    return eoa + wallet;
  }, [isXDai, eoaCreditsEquivalentXDAI, walletCreditsEquivalentXDAI]);

  return {
    eoaCredits,
    walletCredits,
    totalCredits,
    eoaCreditsEquivalentXDAI,
    walletCreditsEquivalentXDAI,
    totalCreditsEquivalentXDAI: totalCreditsEquivalentXDAI ?? 0n,
  };
}
