import { useMemo } from "react";

import { Address } from "viem";
import { useReadContracts } from "wagmi";

import { gnosisRouterAbi, gnosisRouterAddress } from "@/generated";

import { formatValue, isUndefined } from "@/utils";

import { DECIMALS, DEFAULT_CHAIN } from "@/consts";
import { markets, parentConditionId } from "@/consts/markets";

import { useConditionalMarketPayouts } from "./useConditionalMarketPayouts";
import { useGetWinningOutcomes } from "./useGetWinningOutcomes";
import { useTokensBalances } from "./useTokenBalances";

export const useMarketResolutionInfo = (tradeExecutor: Address) => {
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
    if (isUndefined(underlyingTokensWithBalance)) return 0n;
    return underlyingTokensWithBalance.reduce(
      (acc, { balance }) => acc + balance,
      0n,
    );
  }, [underlyingTokensWithBalance]);

  const childCollateralWei = useMemo(() => {
    if (!areAllChildResolved || isLoadingPayouts) return 0n;

    let sum = 0n;
    for (const market of winningChildMarkets) {
      const payout = payoutsByMarketId.get(market.marketId);
      const child = childRedeemConfig.find(
        (row) => row.marketId === market.marketId,
      );
      if (!payout || !child || payout.denominator === 0n) continue;
      sum += (child.upAmount * payout.numeratorUp) / payout.denominator;
      sum += (child.downAmount * payout.numeratorDown) / payout.denominator;
    }
    return sum;
  }, [
    areAllChildResolved,
    childRedeemConfig,
    isLoadingPayouts,
    payoutsByMarketId,
    winningChildMarkets,
  ]);

  const isCheckingStatus =
    isLoadingParentWinningOutcomes ||
    isLoadingChildWinningOutcomes ||
    isLoadingBalances ||
    isUndefined(underlyingTokensWithBalance) ||
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
  };
};
