import { useEffect, useMemo } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { Address } from "viem";

import { useCreateTradeExecutor } from "@/hooks/tradeWallet/useCreateTradeExecutor";
import { useDepositToTradeExecutor } from "@/hooks/tradeWallet/useDepositToTradeExecutor";
import { useTradeExecutorPredict } from "@/hooks/tradeWallet/useTradeExecutorPredict";
import { fetchTokenBalance } from "@/hooks/useTokenBalance";

import { isUndefined } from "@/utils";
import { formatError } from "@/utils/formatError";
import { getQuotes } from "@/utils/getQuotes";
import { processMarket } from "@/utils/processMarket";

import { collateral } from "@/consts";
import type { IMarket } from "@/consts/markets";

import { usePredictState } from "./usePredictState";

interface CheckTradeExecutorResult {
  predictedAddress?: Address;
  isCreated: boolean;
}

interface UsePredictFlowArgs {
  market: IMarket;
  predictedPrice: number;
  account?: Address;
  tradeExecutor?: Address;
  checkTradeExecutorResult?: CheckTradeExecutorResult;
  isXDai: boolean;

  sDAIDepositAmount?: bigint;
  toBeAdded: bigint;
  toBeAddedXDai?: bigint;

  walletUnderlyingBalance?: bigint;
  walletUPBalance?: bigint;
  walletDOWNBalance?: bigint;

  onDone: () => void; // called after success + reset
}

export function usePredictFlow({
  market,
  predictedPrice,
  account,
  tradeExecutor,
  checkTradeExecutorResult,
  isXDai,
  sDAIDepositAmount,
  toBeAdded,
  toBeAddedXDai,
  walletUnderlyingBalance,
  walletUPBalance,
  walletDOWNBalance,
  onDone,
}: UsePredictFlowArgs) {
  const queryClient = useQueryClient();
  const { state, setFlag, reset } = usePredictState();

  const createTradeExecutor = useCreateTradeExecutor();
  const depositToTradeExecutor = useDepositToTradeExecutor(() => {});
  const tradeExecutorPredict = useTradeExecutorPredict(() => {});

  useEffect(() => {
    const err =
      createTradeExecutor.error ??
      depositToTradeExecutor.error ??
      tradeExecutorPredict.error;

    if (err) {
      setFlag("error", formatError(err));
      createTradeExecutor.reset();
      depositToTradeExecutor.reset();
      tradeExecutorPredict.reset();
    }
  }, [
    createTradeExecutor.error,
    depositToTradeExecutor.error,
    tradeExecutorPredict.error,
    setFlag,
  ]);

  const hasWalletCollateral = useMemo(() => {
    return (
      !!checkTradeExecutorResult?.isCreated &&
      !isUndefined(walletUnderlyingBalance) &&
      walletUnderlyingBalance > 0n
    );
  }, [checkTradeExecutorResult?.isCreated, walletUnderlyingBalance]);

  const hasDepositCollateral = useMemo(() => {
    return (sDAIDepositAmount ?? 0n) > 0n;
  }, [sDAIDepositAmount]);

  const hasPosition = useMemo(() => {
    return (walletUPBalance ?? 0n) > 0n || (walletDOWNBalance ?? 0n) > 0n;
  }, [walletUPBalance, walletDOWNBalance]);

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
      const processedMarkets = await Promise.all([
        processMarket({
          underlying: market.underlyingToken,
          outcome: market.upToken,
          tradeExecutor: tradeWallet!,
          mintAmount: snapshot.initialSDAIDeposit,
          targetPrice: predictedPrice,
        }),
        processMarket({
          underlying: market.underlyingToken,
          outcome: market.downToken,
          tradeExecutor: tradeWallet!,
          mintAmount: snapshot.initialSDAIDeposit,
          targetPrice: 1 - predictedPrice,
        }),
      ]);
      setFlag("isProcessingMarkets", false);

      // get quotes
      setFlag("isLoadingQuotes", true);
      const getQuotesResult = await getQuotes({
        account: tradeWallet!,
        processedMarkets,
      });
      setFlag("isLoadingQuotes", false);

      // execute trade
      await tradeExecutorPredict.mutateAsync({
        market,
        amount: processedMarkets[0].underlyingBalance,
        tradeExecutor: tradeWallet!,
        getQuotesResult,
        mintAmount: snapshot.initialSDAIDeposit,
      });

      setFlag("isPredictionSuccessful", true);

      // after 3 seconds: close + reset
      setTimeout(() => {
        onDone();
        reset();
        queryClient.refetchQueries({
          queryKey: ["useTicksData", market.underlyingToken],
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
    tradeExecutorPredict,
  };
}
