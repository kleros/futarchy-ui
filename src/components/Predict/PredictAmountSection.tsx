import React, { useMemo } from "react";

import { AlertMessage, Checkbox } from "@kleros/ui-components-library";
import clsx from "clsx";

import { formatValue, isUndefined } from "@/utils";

import { MIN_SEER_CREDITS_USAGE } from "@/consts";
import { TokenType } from "@/consts/tokens";

import LightButton from "../LightButton";

import AmountInput from "./AmountInput";
import AmountSlider from "./AmountSlider";

interface IPredictAmountSection {
  amount: bigint | undefined;
  setAmount: (value: bigint | undefined) => void;

  selectedToken: TokenType;
  setSelectedToken: (value: TokenType) => void;

  availableBalance: bigint;
  isSending: boolean;

  seerCreditsBalance: bigint;
  seerCreditsEquivalentXDAI: bigint;
  creditsFromWallet?: bigint;
  creditsFromEOA?: bigint;

  toBeAdded: bigint;
  sDAIDepositAmount?: bigint;

  isWalletCreated: boolean;
  isUsingSeerCredits: boolean;
  toggleIsUsingCredits: (value?: boolean) => void;
  isFirstPrediction: boolean;
}

export const PredictAmountSection: React.FC<IPredictAmountSection> = ({
  amount,
  setAmount,
  selectedToken,
  setSelectedToken,
  availableBalance,
  isSending,
  seerCreditsBalance,
  seerCreditsEquivalentXDAI,
  creditsFromWallet = 0n,
  creditsFromEOA = 0n,
  toBeAdded,
  sDAIDepositAmount,
  isWalletCreated,
  isUsingSeerCredits,
  toggleIsUsingCredits,
  isFirstPrediction,
}) => {
  const tradeWalletSDaiUsage = useMemo(() => {
    if (isUndefined(sDAIDepositAmount) || !isWalletCreated) return 0n;
    return (
      sDAIDepositAmount -
      toBeAdded -
      (isUsingSeerCredits ? creditsFromEOA + creditsFromWallet : 0n)
    );
  }, [
    sDAIDepositAmount,
    toBeAdded,
    isUsingSeerCredits,
    isWalletCreated,
    creditsFromEOA,
    creditsFromWallet,
  ]);

  const isXDAI = selectedToken === TokenType.xDAI;

  return (
    <div className="flex flex-col items-center gap-1.5">
      {/* Amount input */}
      <div className="mb-2 flex flex-col">
        {isFirstPrediction ? null : (
          <AlertMessage
            title="Note"
            variant="info"
            msg={
              "Since you've already made a prediction, you can change it even without adding extra capital."
            }
            className={clsx(
              "[&_small]:text-klerosUIComponentsSecondaryText mb-3 p-2 py-3 [&_small]:text-xs",
              "bg-klerosUIComponentsMediumBlue border-none",
            )}
          />
        )}
        <AmountInput
          {...{ setAmount, selectedToken, setSelectedToken, isFirstPrediction }}
          isUsingCredits={isUsingSeerCredits}
          balance={availableBalance}
          equivalentSDAI={sDAIDepositAmount}
          value={amount}
          className="mb-5"
          inputProps={{ isReadOnly: isSending }}
        />
        <AmountSlider
          value={amount ?? 0n}
          balance={availableBalance}
          setValue={setAmount}
        />
        <hr className="border-klerosUIComponentsStroke my-4 w-full" />
        {/* Seer credits checkbox */}
        {seerCreditsBalance > MIN_SEER_CREDITS_USAGE ? (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Checkbox
              small
              label={`Use your Foresight Credits. Available: ${formatValue(seerCreditsBalance)}
                      ${isXDAI ? `( ~${formatValue(seerCreditsEquivalentXDAI)} xdai )` : ""}`}
              onChange={toggleIsUsingCredits}
              defaultSelected={isUsingSeerCredits}
              className="w-fit pl-6 text-xs font-semibold [&_div]:top-0 [&_div]:size-4 [&_svg]:size-4"
            />
            <LightButton
              small
              variant="tertiary"
              text="Use max credits"
              className={clsx(
                "p-0",
                "[&_.button-text]:text-klerosUIComponentsPrimaryBlue [&_.button-text]:text-xs",
                "hover:bg-klerosUIComponentsWhiteBackground",
                !isUsingSeerCredits && "hidden",
              )}
              onPress={() => {
                if (!isUsingSeerCredits) {
                  toggleIsUsingCredits(true);
                }
                setAmount(
                  isXDAI ? seerCreditsEquivalentXDAI : seerCreditsBalance,
                );
              }}
            />
          </div>
        ) : null}
        {!isUndefined(amount) && amount > 0n ? (
          <div className="mt-2 flex flex-row flex-wrap items-center">
            <p className="text-klerosUIComponentsPrimaryText text-xs font-semibold">
              Total: {formatValue(sDAIDepositAmount ?? 0n)} sDAI =
            </p>
            <p className="text-klerosUIComponentsSecondaryText text-xs">
              {isUsingSeerCredits && creditsFromWallet > 0n ? (
                <span>
                  &nbsp;{formatValue(creditsFromWallet)} (Credits in Trade
                  Wallet)
                </span>
              ) : null}
              {isUsingSeerCredits && creditsFromEOA > 0n ? (
                <span>
                  &nbsp;+ {formatValue(creditsFromEOA)} (Credits from Your
                  Wallet)
                </span>
              ) : null}
              {tradeWalletSDaiUsage > 0n ? (
                <span>
                  &nbsp;+ {formatValue(tradeWalletSDaiUsage)} (sDAI in Trade
                  Wallet)
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
