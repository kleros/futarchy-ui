import React, { useMemo, useState } from "react";

import { Button, Modal } from "@kleros/ui-components-library";
import clsx from "clsx";
import { useToggle } from "react-use";
import { useAccount, useBalance } from "wagmi";

import {
  seerCreditsAddress,
  useReadSDaiPreviewDeposit,
  useReadSDaiPreviewRedeem,
} from "@/generated";

import { usePredictAllFlow } from "@/hooks/predict/usePredictAllFlow";
import { useCheckTradeExecutorCreated } from "@/hooks/tradeWallet/useCheckTradeExecutorCreated";
import { usePredictionMarkets } from "@/hooks/usePredictionMarkets";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import { useTokensBalances } from "@/hooks/useTokenBalances";

import { PredictAmountSection } from "@/components/Predict/PredictAmountSection";
import PredictSteps from "@/components/Predict/PredictSteps";

import { isUndefined } from "@/utils";

import { collateral } from "@/consts";
import { TokenType } from "@/consts/tokens";

import Header from "./Header";
interface IPredictAllPopup {
  isOpen: boolean;
  toggleIsOpen: () => void;
}

export const PredictAllPopup: React.FC<IPredictAllPopup> = ({
  isOpen,
  toggleIsOpen,
}) => {
  const markets = usePredictionMarkets();

  const [amount, setAmount] = useState<bigint>();
  const [selectedToken, setSelectedToken] = useState<TokenType>(TokenType.sDAI);
  const [isUsingSeerCredits, toggleIsUsingCredits] = useToggle(true);

  const isXDai = selectedToken === TokenType.xDAI;

  const resetUI = () => {
    setAmount(undefined);
    setSelectedToken(TokenType.sDAI);
  };

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
  const { data: userSeerCreditsBalanceData } = useTokenBalance({
    address: account,
    token: seerCreditsAddress,
  });
  const { data: userXDaiBalanceData } = useBalance({
    address: account,
  });

  const { data: walletSDaiBalanceData } = useTokenBalance({
    address: tradeExecutor,
    token: collateral.address,
  });

  const { data: seerCreditsEquivalentXDAI } = useReadSDaiPreviewRedeem({
    args: [userSeerCreditsBalanceData?.value ?? 0n],
    query: {
      enabled:
        !isUndefined(userSeerCreditsBalanceData) &&
        userSeerCreditsBalanceData.value > 0 &&
        isXDai,
      retry: false,
    },
  });

  const seerCreditsBalance = userSeerCreditsBalanceData?.value ?? 0n;

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

  // the total amount of collateral being supplied in sDAI
  // accounts for all sources of collateral including seer credits
  const sDAIDepositAmount = useMemo(() => {
    if (!isXDai) return amount;
    return resultingDeposit;
  }, [resultingDeposit, amount, isXDai]);

  // additional sDAI required to be deposited, accounts for Seer credits if being used
  const toBeAdded = useMemo(() => {
    if (isUndefined(sDAIDepositAmount)) return 0n;
    // account for wallet balance
    const sDAIDepositWalletBalanceOffset =
      sDAIDepositAmount > (walletSDaiBalanceData?.value ?? 0n)
        ? sDAIDepositAmount - (walletSDaiBalanceData?.value ?? 0n)
        : 0n;
    //account for Seer Credits
    if (isUsingSeerCredits) {
      return sDAIDepositWalletBalanceOffset - seerCreditsBalance > 0
        ? sDAIDepositWalletBalanceOffset - seerCreditsBalance
        : 0n;
    }
    return sDAIDepositWalletBalanceOffset;
  }, [
    sDAIDepositAmount,
    walletSDaiBalanceData,
    seerCreditsBalance,
    isUsingSeerCredits,
  ]);

  const toBeAddedSeerCredits = useMemo(() => {
    if (!isUsingSeerCredits) return 0n;
    // sDAIDepositAmount is alrd adjusted in case xDAI is selected
    return (sDAIDepositAmount ?? 0n) > seerCreditsBalance
      ? seerCreditsBalance
      : sDAIDepositAmount;
  }, [seerCreditsBalance, sDAIDepositAmount, isUsingSeerCredits]);

  // when using xDAI input, we need to convert the additional sDAI amount required,
  // back to xDAI to take what's necessary
  const { data: toBeAddedXDai } = useReadSDaiPreviewRedeem({
    args: [toBeAdded],
    query: {
      enabled: !isUndefined(toBeAdded) && toBeAdded > 0 && isXDai,
      retry: false,
    },
  });

  // can be either xDAI or sDAI
  const availableBalance = useMemo(() => {
    const seerCreditBalanceEquivalent = isXDai
      ? (seerCreditsEquivalentXDAI ?? 0n)
      : seerCreditsBalance;
    return !isXDai
      ? (userSDaiBalanceData?.value ?? 0n) +
          (walletSDaiBalanceData?.value ?? 0n) +
          (isUsingSeerCredits ? seerCreditBalanceEquivalent : 0n)
      : (userXDaiBalanceData?.value ?? 0n) +
          (walletXDaiBalance ?? 0n) +
          (isUsingSeerCredits ? seerCreditBalanceEquivalent : 0n);
  }, [
    isXDai,
    userSDaiBalanceData,
    walletSDaiBalanceData,
    userXDaiBalanceData,
    walletXDaiBalance,
    seerCreditsBalance,
    isUsingSeerCredits,
    seerCreditsEquivalentXDAI,
  ]);

  const {
    handlePredict,
    createdTradeWallet,
    isCreatingWallet,
    isAddingCollateral,
    isCollateralAdded,
    isAddingSeerCredits,
    isSeerCreditsAdded,
    isProcessingMarkets,
    isLoadingQuotes,
    isPredictionSuccessful,
    isSending,
    error,
    frozenToBeAdded,
    frozenToBeAddedSeerCredits,
    tradeExecutorPredictAll,
  } = usePredictAllFlow({
    account,
    tradeExecutor,
    checkTradeExecutorResult,
    isXDai,
    sDAIDepositAmount,
    toBeAdded,
    toBeAddedXDai,
    toBeAddedSeerCredits,
    walletUnderlyingBalances: underlyingTokensBalances,
    walletTokensBalances: tokensBalances,
    onDone: () => {
      toggleIsOpen();
      resetUI();
    },
  });

  const disabled =
    isSending || (!isUndefined(amount) && amount > availableBalance);

  return (
    <Modal
      className={clsx(
        "max-md:max-h-2xl h-fit w-max max-md:w-full max-md:max-w-sm",
        "relative overflow-x-hidden overflow-y-scroll p-4 md:px-10 md:py-8",
      )}
      onOpenChange={toggleIsOpen}
      {...{ isOpen }}
    >
      <div className="flex size-full flex-col items-center">
        <Header />

        <PredictAmountSection
          {...{
            amount,
            setAmount,
            selectedToken,
            setSelectedToken,
            availableBalance,
            isSending,
            toBeAdded,
            toBeAddedSeerCredits,
            toggleIsUsingCredits,
            isUsingSeerCredits,
            seerCreditsBalance,
            sDAIDepositAmount,
          }}
          isWalletCreated={checkTradeExecutorResult?.isCreated ?? false}
        />
        <PredictSteps
          {...{
            tradeExecutor: tradeExecutor ?? createdTradeWallet,
            toBeAdded: frozenToBeAdded ?? toBeAdded,
            toBeAddedSeerCredits:
              frozenToBeAddedSeerCredits ?? toBeAddedSeerCredits,
            isAddingCollateral,
            isCreatingWallet,
            isCollateralAdded,
            isAddingSeerCredits,
            isSeerCreditsAdded,
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
            isDisabled={disabled}
            isLoading={isSending}
          />
        </div>
      </div>
    </Modal>
  );
};
