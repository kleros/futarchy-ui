import React, { useEffect, useMemo, useState } from "react";

import { Button, Modal } from "@kleros/ui-components-library";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { Address } from "viem";
import { useAccount, useBalance } from "wagmi";

import {
  useReadSDaiPreviewDeposit,
  useReadSDaiPreviewRedeem,
} from "@/generated";
import { useMarketsStore } from "@/store/markets";

import { useCheckTradeExecutorCreated } from "@/hooks/tradeWallet/useCheckTradeExecutorCreated";
import { useCreateTradeExecutor } from "@/hooks/tradeWallet/useCreateTradeExecutor";
import { useDepositToTradeExecutor } from "@/hooks/tradeWallet/useDepositToTradeExecutor";
import { useTradeExecutorPredictAll } from "@/hooks/tradeWallet/useTradeExecutorPredictAll";
import { usePredictionMarkets } from "@/hooks/usePredictionMarkets";
import { fetchTokenBalance, useTokenBalance } from "@/hooks/useTokenBalance";
import { useTokensBalances } from "@/hooks/useTokenBalances";

import AmountInput, { TokenType } from "@/components/AmountInput";

import ArrowDownIcon from "@/assets/svg/arrow-down.svg";

import { formatValue, isUndefined } from "@/utils";
import { formatError } from "@/utils/formatError";
import { getQuotes } from "@/utils/getQuotes";
import { processMarket } from "@/utils/processMarket";

import { collateral } from "@/consts";

import AmountDisplay from "./AmountDisplay";
import Header from "./Header";
import PredictSteps from "./PredictSteps";

interface IPredictAllPopup {
  isOpen: boolean;
  toggleIsOpen: () => void;
}

export const PredictAllPopup: React.FC<IPredictAllPopup> = ({
  isOpen,
  toggleIsOpen,
}) => {
  // states to manage Predict steps, will be refactored ltr rn it's a bit verbose
  const [createdTradeWallet, setCreatedTradeWallet] = useState<Address>();
  const [isCreatingWallet, setIsCreatingWallet] = useState<boolean>(false);
  const [isAddingCollateral, setIsAddingCollateral] = useState<boolean>(false);
  const [isCollateralAdded, setIsCollateralAdded] = useState<boolean>(false);
  const [isProcessingMarkets, setIsProcessingMarkets] =
    useState<boolean>(false);
  const [isLoadingQuotes, setIsLoadingQuotes] = useState<boolean>(false);
  const [isPredictionSuccessful, setIsPredictionSuccessful] =
    useState<boolean>(false);
  const [error, setError] = useState<string>();
  //==========================

  const markets = usePredictionMarkets();
  const resetPredictionMarkets = useMarketsStore(
    (state) => state.resetPredictionMarkets,
  );

  const [isSending, setIsSending] = useState(false);
  const [amount, setAmount] = useState<bigint>();
  const [selectedToken, setSelectedToken] = useState<TokenType>(TokenType.sDAI);

  const isXDai = selectedToken === TokenType.xDAI;

  const resetStates = () => {
    setCreatedTradeWallet(undefined);
    setIsCreatingWallet(false);
    setIsAddingCollateral(false);
    setIsCollateralAdded(false);
    setIsProcessingMarkets(false);
    setIsLoadingQuotes(false);
    setIsPredictionSuccessful(false);
    setAmount(0n);
    setError(undefined);
  };

  const queryClient = useQueryClient();

  // checking to see if user alrd has trade wallet
  const { address: account } = useAccount();
  const { data: checkTradeExecutorResult } =
    useCheckTradeExecutorCreated(account);
  const tradeExecutor = checkTradeExecutorResult?.predictedAddress;

  //  balances
  const { data: userSDaiBalanceData } = useTokenBalance({
    address: account,
    token: collateral.address,
  });
  const { data: userXDaiBalanceData } = useBalance({
    address: account,
  });

  const { data: walletSDaiBalanceData } = useTokenBalance({
    address: tradeExecutor,
    token: collateral.address,
  });

  const { data: tokensBalances } = useTokensBalances(
    tradeExecutor,
    markets.flatMap((market) => [market.upToken, market.downToken]),
  );
  const { data: underlyingTokensBalances } = useTokensBalances(
    tradeExecutor,
    markets.map((market) => market.underlyingToken),
  );

  // wallet only holds sDAI, this gives the equivalent amount in xDAI
  // to inform user how much equivalent xDAI they have
  const { data: walletXDaiBalance } = useReadSDaiPreviewRedeem({
    args: [walletSDaiBalanceData?.value ?? 0n],
    query: {
      enabled:
        !isUndefined(walletSDaiBalanceData) &&
        walletSDaiBalanceData.value > 0 &&
        isXDai,
      retry: false,
    },
  });

  // tells us the resulting sDAI
  const { data: resultingDeposit } = useReadSDaiPreviewDeposit({
    args: [amount ?? 0n],
    query: {
      enabled: !isUndefined(amount) && amount > 0,
      retry: false,
    },
  });

  const sDAIDepositAmount = useMemo(() => {
    if (!isXDai) return amount;
    return resultingDeposit;
  }, [resultingDeposit, amount, isXDai]);

  //sDAI required
  const toBeAdded = useMemo(() => {
    if (isUndefined(sDAIDepositAmount)) return 0n;
    return sDAIDepositAmount > (walletSDaiBalanceData?.value ?? 0n)
      ? sDAIDepositAmount - (walletSDaiBalanceData?.value ?? 0n)
      : 0n;
  }, [sDAIDepositAmount, walletSDaiBalanceData]);

  // when using xDAI input, we need to convert the additional sDAI amount required,
  //  back to xDAI to take what's necessary
  const { data: toBeAddedXDai } = useReadSDaiPreviewRedeem({
    args: [toBeAdded],
    query: {
      enabled: !isUndefined(toBeAdded) && toBeAdded > 0 && isXDai,
      retry: false,
    },
  });

  // can be either xDAI or sDAI
  const availableBalance = useMemo(() => {
    return selectedToken === TokenType.sDAI
      ? (userSDaiBalanceData?.value ?? 0n) +
          (walletSDaiBalanceData?.value ?? 0n)
      : (userXDaiBalanceData?.value ?? 0n) + (walletXDaiBalance ?? 0n);
  }, [
    selectedToken,
    userSDaiBalanceData,
    walletSDaiBalanceData,
    userXDaiBalanceData,
    walletXDaiBalance,
  ]);

  // handle creation
  const createTradeExecutor = useCreateTradeExecutor();

  // handle deposit
  const depositToTradeExecutor = useDepositToTradeExecutor(() => {});

  // handle trade (mint movie tokens + predict)
  const tradeExecutorPredictAll = useTradeExecutorPredictAll(() => {
    setIsPredictionSuccessful(true);
    setTimeout(() => {
      toggleIsOpen();
      resetStates();
    }, 3000);
    resetPredictionMarkets();
    queryClient.refetchQueries({
      queryKey: ["useTicksData"],
    });
  });

  // TODO: refactor to separate function
  const handlePredict = async () => {
    if (isUndefined(account) || isUndefined(checkTradeExecutorResult)) return;

    const snapshot = {
      initialSDAIDeposit: sDAIDepositAmount,
      initialToBeAdded: toBeAdded,
      initialToBeAddedXDai: toBeAddedXDai,
    };

    // if trade wallet is empty, or if trade wallet isn't created and no collateral provided to deposit
    const hasWalletCollateral =
      checkTradeExecutorResult.isCreated &&
      !isUndefined(underlyingTokensBalances) &&
      underlyingTokensBalances.every((value) => value > 0n);

    const hasDepositCollateral = (snapshot.initialSDAIDeposit ?? 0n) > 0n;

    const hasPosition = tokensBalances?.some((val) => val > 0n);

    if (!hasWalletCollateral && !hasDepositCollateral && !hasPosition) {
      setError("Require collateral to trade");
      return;
    }
    setError(undefined);
    setIsSending(true);
    try {
      let tradeWallet = tradeExecutor;
      //create wallet, if needed
      if (!checkTradeExecutorResult.isCreated) {
        setIsCreatingWallet(true);
        tradeWallet = (await createTradeExecutor.mutateAsync({ account }))
          .predictedAddress;
        if (isUndefined(tradeWallet)) {
          throw new Error("Failed to create wallet!");
        }
        setIsCreatingWallet(false);
        setCreatedTradeWallet(tradeWallet);
      } else {
        setCreatedTradeWallet(tradeExecutor!);
      }

      console.log("Trade wallet:", tradeWallet);

      // deposit
      if (
        !isUndefined(snapshot.initialToBeAdded) &&
        snapshot.initialToBeAdded > 0n
      ) {
        console.log("Depositing amount to wallet:", snapshot.initialToBeAdded);
        setIsAddingCollateral(true);
        await depositToTradeExecutor.mutateAsync({
          token: collateral.address,
          // toBeAdded is in sDAI, for xDAI deposits we take the value as is
          amount: isXDai
            ? (snapshot.initialToBeAddedXDai ?? 0n)
            : snapshot.initialToBeAdded,
          tradeExecutor: tradeWallet!,
          isXDai,
        });

        if (isXDai) {
          console.log("Refetching sDai balance.");
          // it's possible that while converting xDai -> sDai,
          // the actual amount received is less than the predicted amount
          const updatedWalletSDaiBalance = await fetchTokenBalance(
            tradeWallet!,
            collateral.address,
          );
          snapshot.initialSDAIDeposit = updatedWalletSDaiBalance.value;
        }

        setIsAddingCollateral(false);
        setIsCollateralAdded(true);
      }

      // process UP and DOWN markets
      setIsProcessingMarkets(true);
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

      setIsProcessingMarkets(false);
      console.log("Processed markets:", processedMarkets);

      // get quotes
      setIsLoadingQuotes(true);
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
              setIsLoadingQuotes(false);
              throw err;
            }),
        ),
      );
      setIsLoadingQuotes(false);
      console.log("Quotes result:", quotesPerMarket);
      // send the tradeExecution
      await tradeExecutorPredictAll.mutateAsync({
        marketsData: quotesPerMarket,
        tradeExecutor: tradeWallet!,
        mintAmount: snapshot.initialSDAIDeposit,
      });
    } catch (e) {
      if (e instanceof Error) {
        setError(formatError(e));
      } else {
        setError("");
      }
      // reset state with if user doesn't make click predict again
      setTimeout(resetStates, 10000);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    const error =
      createTradeExecutor.error ??
      depositToTradeExecutor.error ??
      tradeExecutorPredictAll.error;

    if (error) {
      setError(formatError(error));
    }
  }, [
    createTradeExecutor.error,
    depositToTradeExecutor.error,
    tradeExecutorPredictAll.error,
  ]);

  return (
    <Modal
      className="max-md:max-h-2xl relative h-fit w-max overflow-x-hidden overflow-y-scroll p-6 pb-8 max-md:max-w-sm"
      onOpenChange={toggleIsOpen}
      {...{ isOpen }}
    >
      <div className="flex size-full flex-col items-center">
        <Header />

        <div className="flex flex-col items-center gap-1.5">
          {/* Amount input */}
          <div className="flex flex-col">
            <span className="text-klerosUIComponentsSecondaryText mb-1 text-sm">
              You pay
            </span>
            <AmountInput
              {...{ setAmount, selectedToken, setSelectedToken }}
              balance={availableBalance}
              value={amount}
              className="mb-5"
              inputProps={{ isReadOnly: isSending }}
            />
            {checkTradeExecutorResult?.isCreated ? (
              <>
                <span className="text-klerosUIComponentsPrimaryText text-xs">
                  Trade Wallet:&nbsp;
                  {isXDai
                    ? formatValue(walletXDaiBalance ?? 0n)
                    : formatValue(walletSDaiBalanceData?.value ?? 0n)}
                  &nbsp; {isXDai ? "xDAI" : `sDAI`}
                </span>
                <span className="text-klerosUIComponentsPrimaryText text-xs">
                  To be added:&nbsp;
                  {isXDai
                    ? formatValue(toBeAddedXDai ?? 0n)
                    : formatValue(toBeAdded)}
                  &nbsp;{isXDai ? "xDAI" : `sDAI`}
                </span>
              </>
            ) : null}
          </div>
          <div className="rounded-base bg-klerosUIComponentsPrimaryBlue flex w-23.25 items-center justify-center py-3">
            <ArrowDownIcon
              className={clsx(
                "[&_path]:fill-klerosUIComponentsWhiteBackground size-3.5",
              )}
            />
          </div>
          <AmountDisplay value={sDAIDepositAmount} />
        </div>
        <PredictSteps
          {...{
            tradeExecutor: tradeExecutor ?? createdTradeWallet,
            toBeAdded,
            isAddingCollateral,
            isCreatingWallet,
            isCollateralAdded,
            isLoadingQuotes,
            isProcessingMarkets,
            isPredictionSuccessful,
            isMakingPrediction: tradeExecutorPredictAll.isPending,
            error,
          }}
        />
        <div className="flex flex-wrap gap-3.5">
          <Button
            text="Cancel"
            variant="secondary"
            onPress={toggleIsOpen}
            isDisabled={isSending}
          />
          <Button
            text="Predict"
            onPress={handlePredict}
            isDisabled={
              isSending || (!isUndefined(amount) && amount > availableBalance)
            }
            isLoading={isSending}
          />
        </div>
      </div>
    </Modal>
  );
};
