"use client";
import React from "react";

import { Button } from "@kleros/ui-components-library";
import { useQueryClient } from "@tanstack/react-query";
import { Address } from "viem";

import { useCardInteraction } from "@/context/CardInteractionContext";
import { useMarketContext } from "@/context/MarketContext";
import { useTradeExecutorPredict } from "@/hooks/tradeWallet/useTradeExecutorPredict";
import { useGetQuotes } from "@/hooks/useGetQuotes";
import { useProcessMarkets } from "@/hooks/useProcessMarkets";
import { useTokenBalance } from "@/hooks/useTokenBalance";

interface IPredictButton {
  tradeExecutor: Address;
}

const PredictButton: React.FC<IPredictButton> = ({ tradeExecutor }) => {
  const queryClient = useQueryClient();
  const { activeCardId } = useCardInteraction();
  const { market } = useMarketContext();

  const { underlyingToken, marketId } = market;
  const shouldFetch = activeCardId === marketId;

  const processedMarkets = useProcessMarkets({
    tradeExecutor,
    enabled: shouldFetch,
  });

  const { data: getQuotesResult, isLoading: isLoadingQuotes } = useGetQuotes(
    {
      account: tradeExecutor,
      processedMarkets: processedMarkets!,
    },
    shouldFetch,
  );

  const { data: underlyingTokenBalanceData, isLoading: isLoadingBalance } =
    useTokenBalance({
      address: tradeExecutor,
      token: underlyingToken,
    });

  const tradeExecutorPredict = useTradeExecutorPredict(() => {
    queryClient.refetchQueries({
      queryKey: ["useTicksData", underlyingToken],
    });
  });

  const handlePredict = () => {
    if (!getQuotesResult || !tradeExecutor || !underlyingTokenBalanceData)
      return;
    tradeExecutorPredict.mutate({
      market,
      amount: underlyingTokenBalanceData?.value ?? 0n,
      tradeExecutor,
      getQuotesResult,
    });
  };
  return (
    <Button
      text={"Predict"}
      aria-label="Predict Button"
      isDisabled={
        isLoadingBalance || isLoadingQuotes || tradeExecutorPredict.isPending
      }
      isLoading={
        isLoadingBalance || isLoadingQuotes || tradeExecutorPredict.isPending
      }
      onPress={handlePredict}
    />
  );
};
export default PredictButton;
