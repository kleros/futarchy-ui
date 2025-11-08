"use client";
import React, { useEffect } from "react";

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
