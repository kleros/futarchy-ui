import React, { useMemo, useState } from "react";

import { Button, Modal } from "@kleros/ui-components-library";
import { useAccount, useBalance } from "wagmi";

import {
  useReadSDaiPreviewDeposit,
  useReadSDaiPreviewRedeem,
} from "@/generated";

import { usePredictAllFlow } from "@/hooks/predict/usePredictAllFlow";
import { useCheckTradeExecutorCreated } from "@/hooks/tradeWallet/useCheckTradeExecutorCreated";
import { usePredictionMarkets } from "@/hooks/usePredictionMarkets";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import { useTokensBalances } from "@/hooks/useTokenBalances";

import { TokenType } from "@/components/AmountInput";
import { PredictAmountSection } from "@/components/Predict/PredictAmountSection";
import PredictSteps from "@/components/Predict/PredictSteps";

import { isUndefined } from "@/utils";

import { collateral } from "@/consts";

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

  const {
    handlePredict,
    createdTradeWallet,
    isCreatingWallet,
    isAddingCollateral,
    isCollateralAdded,
    isProcessingMarkets,
    isLoadingQuotes,
    isPredictionSuccessful,
    isSending,
    error,
    tradeExecutorPredictAll,
  } = usePredictAllFlow({
    account,
    tradeExecutor,
    checkTradeExecutorResult,
    isXDai,
    sDAIDepositAmount,
    toBeAdded,
    toBeAddedXDai,
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
      className="max-md:max-h-2xl relative h-fit w-max overflow-x-hidden overflow-y-scroll p-6 pb-8 max-md:max-w-sm"
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
            walletXDaiBalance,
            walletSDaiBalanceData,
            sDAIDepositAmount,
            toBeAdded,
            toBeAddedXDai,
            isXDai,
          }}
          isWalletCreated={checkTradeExecutorResult?.isCreated ?? false}
        />
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
            isDisabled={disabled}
            isLoading={isSending}
          />
        </div>
      </div>
    </Modal>
  );
};
