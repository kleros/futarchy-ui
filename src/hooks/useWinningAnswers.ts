import { useMemo } from "react";

import { isUndefined } from "@/utils";

import { IMarket, markets, parentConditionId } from "@/consts/markets";

import { useConditionalMarketPayouts } from "./useConditionalMarketPayouts";
import { useGetWinningOutcomes } from "./useGetWinningOutcomes";

type WinningChildMarket = {
  market: IMarket;
  finalAnswer: number | undefined;
  isResolved: boolean;
};

function finalAnswerFromPayouts(
  market: IMarket,
  denominator: bigint,
  numeratorUp: bigint,
) {
  if (denominator === 0n) return undefined;
  const relativeAnswer = Number(numeratorUp) / Number(denominator);
  if (!Number.isFinite(relativeAnswer)) return undefined;
  return market.minValue + (market.maxValue - market.minValue) * relativeAnswer;
}

export function useWinningAnswers() {
  const parentId = parentConditionId;
  const allChildren = markets;

  const { data: parentWinningOutcomes, isLoading: isLoadingParent } =
    useGetWinningOutcomes(parentId);

  const winningChildMarkets = useMemo(() => {
    if (isUndefined(parentWinningOutcomes)) return [];
    return allChildren.filter(
      (child) => parentWinningOutcomes[child.parentMarketOutcome] === true,
    );
  }, [allChildren, parentWinningOutcomes]);

  const { payoutsByMarketId, isLoading: isLoadingPayouts } =
    useConditionalMarketPayouts({
      markets: winningChildMarkets,
    });

  const winningMarkets = useMemo((): WinningChildMarket[] => {
    return winningChildMarkets.map((market) => {
      const payout = payoutsByMarketId.get(market.marketId);
      const isResolved = !!payout && payout.denominator > 0n;
      const finalAnswer =
        payout && isResolved
          ? finalAnswerFromPayouts(
              market,
              payout.denominator,
              payout.numeratorUp,
            )
          : undefined;
      return { market, finalAnswer, isResolved };
    });
  }, [payoutsByMarketId, winningChildMarkets]);

  return {
    winningMarkets,
    isLoading: isLoadingParent || isLoadingPayouts,
  };
}
