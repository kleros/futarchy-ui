import React from "react";

import clsx from "clsx";

import AmountInput, { TokenType } from "@/components/AmountInput";

import ArrowDownIcon from "@/assets/svg/arrow-down.svg";

import { formatValue } from "@/utils";

import AmountDisplay from "./AmountDisplay";

interface IPredictAmountSection {
  amount: bigint | undefined;
  setAmount: (value: bigint | undefined) => void;

  selectedToken: TokenType;
  setSelectedToken: (value: TokenType) => void;

  availableBalance: bigint;
  isSending: boolean;

  walletXDaiBalance?: bigint;
  walletSDaiBalanceData?: { value: bigint };
  walletUnderlyingBalanceData?: { value: bigint };

  sDAIDepositAmount?: bigint;
  toBeAdded: bigint;
  toBeAddedXDai?: bigint;

  isXDai: boolean;
  isWalletCreated: boolean;
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
  walletUnderlyingBalanceData,
  sDAIDepositAmount,
  toBeAdded,
  toBeAddedXDai,
  isXDai,
  isWalletCreated,
}) => {
  return (
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
      </div>
      <div className="rounded-base bg-klerosUIComponentsPrimaryBlue flex w-23.25 items-center justify-center py-3">
        <ArrowDownIcon
          className={clsx(
            "[&_path]:fill-klerosUIComponentsWhiteBackground size-3.5",
          )}
        />
      </div>
      <AmountDisplay
        value={sDAIDepositAmount}
        underlyingBalance={walletUnderlyingBalanceData?.value}
      />
    </div>
  );
};
