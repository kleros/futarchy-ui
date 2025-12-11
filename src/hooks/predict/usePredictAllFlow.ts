import { useEffect, useMemo } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { Address } from "viem";

import { useMarketsStore } from "@/store/markets";

import { useCreateTradeExecutor } from "@/hooks/tradeWallet/useCreateTradeExecutor";
import { useDepositToTradeExecutor } from "@/hooks/tradeWallet/useDepositToTradeExecutor";
import { fetchTokenBalance } from "@/hooks/useTokenBalance";

import { isUndefined } from "@/utils";
import { formatError } from "@/utils/formatError";
import { getQuotes } from "@/utils/getQuotes";
import { processMarket } from "@/utils/processMarket";

import { collateral } from "@/consts";

import { useTradeExecutorPredictAll } from "../tradeWallet/useTradeExecutorPredictAll";
import { usePredictionMarkets } from "../usePredictionMarkets";

import { usePredictState } from "./usePredictState";

interface CheckTradeExecutorResult {
  predictedAddress?: Address;
  isCreated: boolean;
}

interface UsePredictAllFlowArgs {
  account?: Address;
  tradeExecutor?: Address;
  checkTradeExecutorResult?: CheckTradeExecutorResult;
  isXDai: boolean;

  sDAIDepositAmount?: bigint;
  toBeAdded: bigint;
  toBeAddedXDai?: bigint;

  walletUnderlyingBalances?: bigint[];
  walletTokensBalances?: bigint[];

  onDone: () => void; // called after success + reset
}

export function usePredictAllFlow({
  account,
  tradeExecutor,
  checkTradeExecutorResult,
  isXDai,
  sDAIDepositAmount,
  toBeAdded,
  toBeAddedXDai,
  walletUnderlyingBalances,
  walletTokensBalances,
  onDone,
}: UsePredictAllFlowArgs) {
  const queryClient = useQueryClient();
  const { state, setFlag, reset } = usePredictState();

  const markets = usePredictionMarkets();
  const resetPredictionMarkets = useMarketsStore(
    (state) => state.resetPredictionMarkets,
  );

  const createTradeExecutor = useCreateTradeExecutor();
  const depositToTradeExecutor = useDepositToTradeExecutor(() => {});
  const tradeExecutorPredictAll = useTradeExecutorPredictAll(() => {});

  useEffect(() => {
    const err =
      createTradeExecutor.error ??
      depositToTradeExecutor.error ??
      tradeExecutorPredictAll.error;

    if (err) {
      setFlag("error", formatError(err));
      createTradeExecutor.reset();
      depositToTradeExecutor.reset();
      tradeExecutorPredictAll.reset();
    }
  }, [
    createTradeExecutor.error,
    depositToTradeExecutor.error,
    tradeExecutorPredictAll.error,
    setFlag,
  ]);

  const hasWalletCollateral = useMemo(() => {
    return (
      checkTradeExecutorResult?.isCreated &&
      walletUnderlyingBalances &&
      walletUnderlyingBalances.every((v) => v > 0n)
    );
  }, [checkTradeExecutorResult?.isCreated, walletUnderlyingBalances]);

  const hasDepositCollateral = useMemo(() => {
    return (sDAIDepositAmount ?? 0n) > 0n;
  }, [sDAIDepositAmount]);

  const hasPosition = useMemo(() => {
    return walletTokensBalances?.some((v) => v > 0n);
  }, [walletTokensBalances]);

  const handlePredict = async () => {
    if (isUndefined(account) || isUndefined(checkTradeExecutorResult)) return;

    const snapshot: {
      initialSDAIDeposit?: bigint;
      initialToBeAdded?: bigint;
      initialToBeAddedXDai?: bigint;
    } = {
      initialSDAIDeposit: sDAIDepositAmount,
      initialToBeAdded: toBeAdded,
      initialToBeAddedXDai: toBeAddedXDai,
    };

    if (!hasWalletCollateral && !hasDepositCollateral && !hasPosition) {
      setFlag("error", "Require collateral to trade");
      return;
    }

    setFlag("error", undefined);
    setFlag("isSending", true);

    try {
      let tradeWallet = tradeExecutor;

      // create wallet if needed
      if (!checkTradeExecutorResult.isCreated) {
        setFlag("isCreatingWallet", true);

        const created = await createTradeExecutor.mutateAsync({ account });
        tradeWallet = created.predictedAddress;

        if (isUndefined(tradeWallet)) {
          throw new Error("Failed to create wallet!");
        }

        setFlag("isCreatingWallet", false);
        setFlag("createdTradeWallet", tradeWallet);
      } else {
        if (!tradeWallet) {
          tradeWallet = checkTradeExecutorResult.predictedAddress;
        }
        if (!tradeWallet) {
          throw new Error("Missing trade wallet address");
        }
        setFlag("createdTradeWallet", tradeWallet);
      }

      // deposit if needed
      if (
        !isUndefined(snapshot.initialToBeAdded) &&
        snapshot.initialToBeAdded > 0n
      ) {
        setFlag("isAddingCollateral", true);

        await depositToTradeExecutor.mutateAsync({
          token: collateral.address,
          amount: isXDai
            ? (snapshot.initialToBeAddedXDai ?? 0n)
            : snapshot.initialToBeAdded,
          tradeExecutor: tradeWallet,
          isXDai,
        });

        // if xDAI, re-read the actual sDAI received
        if (isXDai) {
          const updatedWalletSDaiBalance = await fetchTokenBalance(
            tradeWallet,
            collateral.address,
          );
          snapshot.initialSDAIDeposit = updatedWalletSDaiBalance.value;
        }

        setFlag("isAddingCollateral", false);
        setFlag("isCollateralAdded", true);
      }

      // process markets (UP & DOWN)
      setFlag("isProcessingMarkets", true);
      const processedMarkets = await Promise.all(
        markets.map(async (market) => {
          const upProcessed = await processMarket({
            underlying: market.underlyingToken,
            outcome: market.upToken,
            tradeExecutor: tradeWallet!,
            mintAmount: snapshot.initialSDAIDeposit,
            targetPrice: market?.predictedPrice ?? 0,
          });

          const downProcessed = await processMarket({
            underlying: market.underlyingToken,
            outcome: market.downToken,
            tradeExecutor: tradeWallet!,
            mintAmount: snapshot.initialSDAIDeposit,
            targetPrice: 1 - (market?.predictedPrice ?? 0),
          });

          return {
            marketInfo: market,
            processed: [upProcessed, downProcessed],
          };
        }),
      );

      setFlag("isProcessingMarkets", false);

      // get quotes
      setFlag("isLoadingQuotes", true);
      const quotesPerMarket = await Promise.all(
        processedMarkets.map(({ marketInfo, processed }) =>
          getQuotes({
            account: tradeWallet!,
            processedMarkets: processed, // only UP + DOWN for this market
          })
            .then((res) => ({
              marketInfo,
              getQuotesResult: res,
              amount: processed[0].underlyingBalance,
            }))
            .catch((err) => {
              setFlag("isLoadingQuotes", false);
              throw err;
            }),
        ),
      );
      setFlag("isLoadingQuotes", false);

      // execute trade
      await tradeExecutorPredictAll.mutateAsync({
        marketsData: quotesPerMarket,
        tradeExecutor: tradeWallet!,
        mintAmount: snapshot.initialSDAIDeposit,
      });
      setFlag("isPredictionSuccessful", true);

      // after 3 seconds: close + reset
      setTimeout(() => {
        onDone();
        reset();
        resetPredictionMarkets();
        queryClient.refetchQueries({
          queryKey: ["useTicksData"],
        });
      }, 3000);
    } catch (e) {
      if (e instanceof Error) {
        setFlag("error", formatError(e));
      } else {
        setFlag("error", "");
      }

      // reset state later if user doesn't act
      setTimeout(() => reset(), 10000);
    } finally {
      setFlag("isSending", false);
    }
  };

  return {
    handlePredict,
    ...state,
    tradeExecutorPredictAll,
  };
}
