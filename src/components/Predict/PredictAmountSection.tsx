import React, { useMemo } from "react";

import { Checkbox } from "@kleros/ui-components-library";

import { formatValue, isUndefined } from "@/utils";

import { MIN_SEER_CREDITS_USAGE } from "@/consts";
import { TokenType } from "@/consts/tokens";

import AmountInput from "./AmountInput";

interface IPredictAmountSection {
  amount: bigint | undefined;
  setAmount: (value: bigint | undefined) => void;

  selectedToken: TokenType;
  setSelectedToken: (value: TokenType) => void;

  availableBalance: bigint;
  isSending: boolean;

  seerCreditsBalance: bigint;

  toBeAdded: bigint;
  toBeAddedSeerCredits?: bigint;
  sDAIDepositAmount?: bigint;

  isWalletCreated: boolean;
  isUsingSeerCredits: boolean;
  toggleIsUsingCredits: (value?: boolean) => void;
}

export const PredictAmountSection: React.FC<IPredictAmountSection> = ({
  amount,
  setAmount,
  selectedToken,
  setSelectedToken,
  availableBalance,
  isSending,
  seerCreditsBalance,
  toBeAdded,
  toBeAddedSeerCredits,
  sDAIDepositAmount,
  isWalletCreated,
  isUsingSeerCredits,
  toggleIsUsingCredits,
}) => {
  const tradeWalletSDaiUsage = useMemo(() => {
    if (isUndefined(sDAIDepositAmount) || !isWalletCreated) return 0n;
    return (
      sDAIDepositAmount -
      toBeAdded -
      (isUsingSeerCredits ? (toBeAddedSeerCredits ?? 0n) : 0n)
    );
  }, [
    sDAIDepositAmount,
    toBeAdded,
    isUsingSeerCredits,
    toBeAddedSeerCredits,
    isWalletCreated,
  ]);

  return (
    <div className="flex flex-col items-center gap-1.5">
      {/* Amount input */}
      <div className="mb-2 flex flex-col">
        <AmountInput
          {...{ setAmount, selectedToken, setSelectedToken }}
          balance={availableBalance}
          equivalentSDAI={sDAIDepositAmount}
          value={amount}
          className="mb-5"
          inputProps={{ isReadOnly: isSending }}
        />
        {/* Seer credits checkbox */}
        {seerCreditsBalance > MIN_SEER_CREDITS_USAGE ? (
          <Checkbox
            small
            label={`Use your Seer credits. Available: ${formatValue(seerCreditsBalance)}`}
            onChange={toggleIsUsingCredits}
            defaultSelected={isUsingSeerCredits}
            className="mt-1 pl-6 text-xs font-semibold [&_div]:top-0 [&_div]:size-4 [&_svg]:size-4"
          />
        ) : null}
        {!isUndefined(amount) && amount > 0n ? (
          <div className="mt-2 flex flex-row flex-wrap items-center">
            <p className="text-klerosUIComponentsPrimaryText text-xs font-semibold">
              Total: {formatValue(sDAIDepositAmount ?? 0n)} sDAI =
            </p>
            <p className="text-klerosUIComponentsSecondaryText text-xs">
              {isUsingSeerCredits && toBeAddedSeerCredits ? (
                <span>
                  &nbsp;{formatValue(toBeAddedSeerCredits)} (Seer Credits)
                </span>
              ) : null}
              {tradeWalletSDaiUsage > 0n ? (
                <span>
                  &nbsp;+ {formatValue(tradeWalletSDaiUsage)} (Trade Wallet)
                </span>
              ) : null}
              {toBeAdded > 0n ? (
                <span>&nbsp;+ {formatValue(toBeAdded)} (Your Wallet)</span>
              ) : null}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
