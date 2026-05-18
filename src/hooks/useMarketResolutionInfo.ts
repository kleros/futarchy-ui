import { useMemo } from "react";

import { Address } from "viem";
import { useReadContracts } from "wagmi";

import { gnosisRouterAbi, gnosisRouterAddress } from "@/generated";

import { formatValue, isUndefined } from "@/utils";

import { DECIMALS, DEFAULT_CHAIN } from "@/consts";
import { markets, parentConditionId } from "@/consts/markets";

import {
  payoutDenominatorContract,
  payoutNumeratorsContract,
  useConditionalMarketPayouts,
} from "./useConditionalMarketPayouts";
import { useGetWinningOutcomes } from "./useGetWinningOutcomes";
import { useTokensBalances } from "./useTokenBalances";

export const useMarketResolutionInfo = (tradeExecutor?: Address) => {
  // check the parent market resolution
  const {
    data: parentWinningOutcomes,
    isLoading: isLoadingParentWinningOutcomes,
  } = useGetWinningOutcomes(parentConditionId);

  const winningChildMarkets = useMemo(() => {
    if (isUndefined(parentWinningOutcomes)) return [];
    return markets.filter(
      (child) => parentWinningOutcomes[child.parentMarketOutcome] === true,
    );
  }, [parentWinningOutcomes]);

  const numberOutcomes = winningChildMarkets.length;

  const {
    data: childWinningOutcomesData,
    isPending: isLoadingChildWinningOutcomes,
  } = useReadContracts({
    contracts: markets.map((market) => ({
      address: gnosisRouterAddress,
      abi: gnosisRouterAbi,
      functionName: "getWinningOutcomes",
      args: [market.conditionId],
      chainId: DEFAULT_CHAIN.id,
    })),
  });

  // map of market => resolved (true/false)
  const childResolvedByMarketId = useMemo(() => {
    const map = new Map<string, boolean>();
    if (isUndefined(childWinningOutcomesData)) return map;

    markets.forEach((market, i) => {
      const row = childWinningOutcomesData[i];
      const outcomes = row?.result as boolean[] | undefined;
      map.set(
        market.marketId,
        Array.isArray(outcomes) && outcomes.some(Boolean), // even if one is true, it means market is resolved
      );
    });
    return map;
  }, [childWinningOutcomesData]);

  // true if all the chosen child markets have been resolved
  const areAllChildResolved = useMemo(() => {
    return winningChildMarkets.every((child) =>
      childResolvedByMarketId.get(child.marketId),
    );
  }, [winningChildMarkets, childResolvedByMarketId]);

  const parentOutcomeIndices = useMemo(
    () =>
      [...new Set(winningChildMarkets.map((m) => m.parentMarketOutcome))].sort(
        (a, b) => a - b,
      ),
    [winningChildMarkets],
  );

  const parentReadsEnabled =
    areAllChildResolved && parentOutcomeIndices.length > 0;

  const parentPayoutReads = useMemo(
    () => [
      payoutDenominatorContract(parentConditionId),
      ...parentOutcomeIndices.map((slot) =>
        payoutNumeratorsContract(parentConditionId, BigInt(slot)),
      ),
    ],
    [parentOutcomeIndices],
  );

  const { data: parentPayoutData, isLoading: isLoadingParentPayouts } =
    useReadContracts({
      allowFailure: false,
      contracts: parentPayoutReads,
      query: { enabled: parentReadsEnabled },
    });

  const parentPayoutDenom = useMemo(() => {
    const nReads = parentOutcomeIndices.length + 1;
    if (
      !parentReadsEnabled ||
      isUndefined(parentPayoutData) ||
      parentPayoutData.length !== nReads
    ) {
      return 0n;
    }
    return parentPayoutData[0] as bigint;
  }, [parentReadsEnabled, parentOutcomeIndices, parentPayoutData]);

  const parentNumeratorsByOutcome = useMemo(() => {
    const map = new Map<number, bigint>();
    const nReads = parentOutcomeIndices.length + 1;
    if (
      !parentReadsEnabled ||
      isUndefined(parentPayoutData) ||
      parentPayoutData.length !== nReads
    ) {
      return map;
    }
    parentOutcomeIndices.forEach((slot, i) =>
      map.set(slot, parentPayoutData[i + 1] as bigint),
    );
    return map;
  }, [parentReadsEnabled, parentOutcomeIndices, parentPayoutData]);

  const { payoutsByMarketId, isLoading: isLoadingPayouts } =
    useConditionalMarketPayouts({
      markets: winningChildMarkets,
      enabled: areAllChildResolved,
    });

  const balanceTokenList = useMemo(() => {
    const underlyingTokens = winningChildMarkets.map(
      ({ underlyingToken }) => underlyingToken,
    );
    const childTokens = winningChildMarkets.flatMap(
      ({ upToken, downToken }) => [upToken, downToken],
    );
    return [...underlyingTokens, ...childTokens];
  }, [winningChildMarkets]);

  // loads balances of all the redeemable tokens (underlying + UP/DOWN)
  const { data: balances, isLoading: isLoadingBalances } = useTokensBalances(
    tradeExecutor,
    balanceTokenList.length > 0 ? balanceTokenList : undefined,
  );

  const underlyingCount = winningChildMarkets.length;

  const underlyingTokensWithBalance = useMemo(() => {
    if (winningChildMarkets.length === 0) return [];
    if (isUndefined(balances)) return;
    return winningChildMarkets
      .map(({ underlyingToken, parentMarketOutcome }, i) => ({
        address: underlyingToken,
        parentMarketOutcome,
        balance: balances[i],
      }))
      .filter(({ balance }) => balance > 0n);
  }, [balances, winningChildMarkets]);

  const parentRedeemConfig = useMemo(() => {
    if (isUndefined(underlyingTokensWithBalance)) return;
    return {
      tokens: underlyingTokensWithBalance.map(({ address }) => address),
      outcomeIndexes: underlyingTokensWithBalance.map(
        ({ parentMarketOutcome }) => BigInt(parentMarketOutcome),
      ),
      amounts: underlyingTokensWithBalance.map(({ balance }) => balance),
    };
  }, [underlyingTokensWithBalance]);

  const childRedeemConfig = useMemo(() => {
    if (!balances || winningChildMarkets.length === 0) return [];
    let offset = underlyingCount;
    return winningChildMarkets
      .map((m) => {
        const upAmount = balances[offset];
        const downAmount = balances[offset + 1];
        offset += 2;
        return {
          marketId: m.marketId,
          parentMarketOutcome: BigInt(m.parentMarketOutcome),
          upToken: m.upToken,
          downToken: m.downToken,
          upAmount,
          downAmount,
        };
      })
      .filter((c) => c.upAmount > 0n || c.downAmount > 0n); //only keeping markets where we have balance to redeem
  }, [balances, winningChildMarkets, underlyingCount]);

  const parentCollateralWei = useMemo(() => {
    if (isUndefined(underlyingTokensWithBalance) || parentPayoutDenom === 0n) {
      return 0n;
    }
    const denominator = parentPayoutDenom;
    return underlyingTokensWithBalance.reduce((acc, row) => {
      const n = parentNumeratorsByOutcome.get(row.parentMarketOutcome) ?? 0n;
      return acc + (row.balance * n) / denominator;
    }, 0n);
  }, [
    parentNumeratorsByOutcome,
    parentPayoutDenom,
    underlyingTokensWithBalance,
  ]);

  const childCollateralWei = useMemo(() => {
    if (!areAllChildResolved || isLoadingPayouts) return 0n;
    if (parentPayoutDenom === 0n) return 0n;

    const dParent = parentPayoutDenom;
    let sum = 0n;

    for (const market of winningChildMarkets) {
      const payout = payoutsByMarketId.get(market.marketId);
      const child = childRedeemConfig.find(
        (row) => row.marketId === market.marketId,
      );
      if (!payout || !child || payout.denominator === 0n) continue;

      const parentNum =
        parentNumeratorsByOutcome.get(market.parentMarketOutcome) ?? 0n;
      const numerator =
        child.upAmount * payout.numeratorUp +
        child.downAmount * payout.numeratorDown;
      sum += (numerator * parentNum) / (payout.denominator * dParent);
    }
    return sum;
  }, [
    areAllChildResolved,
    childRedeemConfig,
    isLoadingPayouts,
    parentNumeratorsByOutcome,
    parentPayoutDenom,
    payoutsByMarketId,
    winningChildMarkets,
  ]);

  const isCheckingStatus =
    isLoadingParentWinningOutcomes ||
    isLoadingChildWinningOutcomes ||
    isLoadingBalances ||
    isUndefined(underlyingTokensWithBalance) ||
    isLoadingParentPayouts ||
    isLoadingPayouts;

  const isRedeemable = useMemo(() => {
    if (isCheckingStatus) return;
    if (numberOutcomes === 0) return false;
    if (!areAllChildResolved) return false;
    return parentCollateralWei + childCollateralWei > 0n;
  }, [
    areAllChildResolved,
    childCollateralWei,
    isCheckingStatus,
    numberOutcomes,
    parentCollateralWei,
  ]);

  const totalValue = useMemo(() => {
    if (numberOutcomes === 0 || isCheckingStatus || !areAllChildResolved)
      return;
    const combined = parentCollateralWei + childCollateralWei;
    return formatValue(combined, DECIMALS);
  }, [
    areAllChildResolved,
    childCollateralWei,
    isCheckingStatus,
    numberOutcomes,
    parentCollateralWei,
  ]);

  const isMarketResolved =
    winningChildMarkets.length > 0 && areAllChildResolved;

  return {
    winningChildMarkets,
    numberOutcomes,
    parentRedeemConfig,
    childRedeemConfig,
    isRedeemable,
    isCheckingStatus,
    areAllChildResolved,
    childResolvedByMarketId,
    totalValue,
    isMarketResolved,
  };
};
