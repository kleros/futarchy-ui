import React from "react";

import { Checkbox } from "@kleros/ui-components-library";

import AmountInput from "@/components/AmountInput";

import { formatValue } from "@/utils";

import { MIN_SEER_CREDITS_USAGE } from "@/consts";
import { TokenType } from "@/consts/tokens";

interface IPredictAmountSection {
  amount: bigint | undefined;
  setAmount: (value: bigint | undefined) => void;

  selectedToken: TokenType;
  setSelectedToken: (value: TokenType) => void;

  availableBalance: bigint;
  isSending: boolean;

  walletXDaiBalance?: bigint;
  walletSDaiBalanceData?: { value: bigint };
  seerCreditsBalance: bigint;

  toBeAdded: bigint;
  toBeAddedXDai?: bigint;

  isXDai: boolean;
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
  walletXDaiBalance,
  walletSDaiBalanceData,
  seerCreditsBalance,
  toBeAdded,
  toBeAddedXDai,
  isXDai,
  isWalletCreated,
  isUsingSeerCredits,
  toggleIsUsingCredits,
}) => {
  return (
    <div className="flex flex-col items-center gap-1.5">
      {/* Amount input */}
      <div className="mb-2 flex flex-col">
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
        {isWalletCreated ? (
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
        {/* Seer credits checkbox */}
        {seerCreditsBalance > MIN_SEER_CREDITS_USAGE ? (
          <Checkbox
            small
            label={`Use Seer credits. Available: ${formatValue(seerCreditsBalance)}`}
            onChange={toggleIsUsingCredits}
            defaultSelected={isUsingSeerCredits}
            className="mt-1 pl-4 text-xs [&_div]:top-0.5 [&_div]:size-3 [&_svg]:size-3"
          />
        ) : null}
      </div>
    </div>
  );
};
