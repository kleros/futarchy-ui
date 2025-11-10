"use client";
import React, { useEffect, useState } from "react";

import { Button } from "@kleros/ui-components-library";
import { useQueryClient } from "@tanstack/react-query";
import { Address } from "viem";

import { useCardInteraction } from "@/context/CardInteractionContext";
import { useMarketContext } from "@/context/MarketContext";
import { useTradeExecutorPredict } from "@/hooks/tradeWallet/useTradeExecutorPredict";
import { useGetQuotes } from "@/hooks/useGetQuotes";
import { useProcessMarkets } from "@/hooks/useProcessMarkets";
import { useTokenBalance } from "@/hooks/useTokenBalance";

import { formatError } from "@/utils/formatError";

interface IPredictButton {
  tradeExecutor: Address;
  setErrorMessage: (message: string | undefined) => void;
}

const PredictButton: React.FC<IPredictButton> = ({
  tradeExecutor,
  setErrorMessage,
}) => {
  const queryClient = useQueryClient();
  const { activeCardId } = useCardInteraction();
  const { market } = useMarketContext();

  const [pendingPrediction, setPendingPrediction] = useState(false);

  const { underlyingToken, marketId } = market;
  const shouldFetch = activeCardId === marketId;

  const processedMarkets = useProcessMarkets({
    tradeExecutor,
    enabled: shouldFetch,
  });

  const {
    data: getQuotesResult,
    isLoading: isLoadingQuotes,
    error: getQuotesError,
  } = useGetQuotes(
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
    setErrorMessage(undefined);
    queryClient.refetchQueries({
      queryKey: ["useTicksData", underlyingToken],
    });
  });

  useEffect(() => {
    if (getQuotesError) {
      setErrorMessage(formatError(getQuotesError));
    } else if (tradeExecutorPredict.error) {
      setErrorMessage(formatError(tradeExecutorPredict.error));
    } else {
      setErrorMessage(undefined);
    }
  }, [getQuotesError, tradeExecutorPredict.error, setErrorMessage]);

  // send the transaction once the loading is done and user had clicked on predict
  useEffect(() => {
    if (pendingPrediction && getQuotesResult && underlyingTokenBalanceData) {
      tradeExecutorPredict.mutate({
        market,
        amount: underlyingTokenBalanceData.value ?? 0n,
        tradeExecutor,
        getQuotesResult,
      });
      setPendingPrediction(false);
    }
  }, [pendingPrediction, getQuotesResult, underlyingTokenBalanceData]);

  const handlePredict = () => {
    if (!tradeExecutor || !underlyingTokenBalanceData) return;

    if (getQuotesResult) {
      // Quotes are already available, go straight to txn
      tradeExecutorPredict.mutate({
        market,
        amount: underlyingTokenBalanceData.value ?? 0n,
        tradeExecutor,
        getQuotesResult,
      });
    } else {
      // Quotes still loading, wait until available
      setPendingPrediction(true);
    }
  };

  return (
    <Button
      text={"Predict"}
      aria-label="Predict Button"
      isDisabled={tradeExecutorPredict.isPending || pendingPrediction}
      isLoading={tradeExecutorPredict.isPending || pendingPrediction}
      onPress={handlePredict}
    />
  );
};
export default PredictButton;
