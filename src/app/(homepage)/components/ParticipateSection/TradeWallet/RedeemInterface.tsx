import React, { useMemo } from "react";

import { Button, Modal } from "@kleros/ui-components-library";
import { Address, formatUnits } from "viem";

import { useReadGnosisRouterGetWinningOutcomes } from "@/generated";

import { useRedeemParentsToTradeExecutor } from "@/hooks/tradeWallet/useRedeemParentsToTradeExecutor";
import { useTokensBalances } from "@/hooks/useTokenBalances";

import LightButton from "@/components/LightButton";

import CloseIcon from "@/assets/svg/close-icon.svg";

import { isUndefined } from "@/utils";

import { markets, parentConditionId } from "@/consts/markets";

interface RedeemParentsInterfaceProps {
  isOpen: boolean;
  toggleIsOpen: () => void;
  tradeExecutor: Address;
}

export const RedeemParentsInterface: React.FC<RedeemParentsInterfaceProps> = ({
  tradeExecutor,
  isOpen,
  toggleIsOpen,
}) => {
  const { data: winningOutcomes, isLoading: winningOutcomesLoading } =
    useReadGnosisRouterGetWinningOutcomes({
      args: [parentConditionId],
    });

  const numberOutcomes = useMemo(
    () =>
      winningOutcomes?.reduce((acc, outcome) => (outcome ? acc + 1 : acc), 0),
    [winningOutcomes],
  );

  const winningTokens = useMemo(() => {
    if (!winningOutcomesLoading && !isUndefined(winningOutcomes)) {
      return markets
        .filter(
          ({ parentMarketOutcome }) => winningOutcomes[parentMarketOutcome],
        )
        .map(({ underlyingToken, parentMarketOutcome }) => ({
          underlyingToken,
          index: parentMarketOutcome,
        }));
    }
  }, [winningOutcomesLoading, winningOutcomes]);

  const { data: balances, isLoading: balancesLoading } = useTokensBalances(
    tradeExecutor,
    winningTokens?.map(({ underlyingToken }) => underlyingToken) ?? [],
  );

  const winningTokensWithBalance = useMemo(
    () =>
      winningTokens
        ?.map(({ underlyingToken, index }, i) => ({
          address: underlyingToken,
          index,
          balance: balances?.[i] as bigint,
        }))
        .filter(({ balance }) => balance > 0n),
    [balances, winningTokens],
  );

  const isCheckingStatus =
    winningOutcomesLoading ||
    balancesLoading ||
    isUndefined(numberOutcomes) ||
    isUndefined(winningTokensWithBalance);

  // if there is value to be redeemed, its redeemable
  const isRedeemable = useMemo(() => {
    if (isCheckingStatus) return;
    if (isUndefined(numberOutcomes) && numberOutcomes === 0) return false;
    const totalBalance = winningTokensWithBalance.reduce(
      (acc, { balance }) => acc + balance,
      0n,
    );
    return totalBalance > 0n;
  }, [numberOutcomes, winningTokensWithBalance, isCheckingStatus]);

  // estimatted value of tokens based on number of winning outcomes
  const totalValue = useMemo(() => {
    // can be zero if market not resolved yet
    if (numberOutcomes === 0) return;
    const totalBalance = winningTokensWithBalance?.reduce(
      (acc, { balance }) => acc + balance,
      0n,
    );

    if (
      !isUndefined(totalBalance) &&
      !isUndefined(winningTokensWithBalance) &&
      !isUndefined(numberOutcomes)
    ) {
      const formattedAmount = parseFloat(
        formatUnits(totalBalance / BigInt(numberOutcomes), 18),
      ).toFixed(2);
      if (formattedAmount !== "0.00") {
        return formattedAmount;
      } else if (totalBalance > 0n) {
        return "< 0.01";
      }
    }
  }, [winningTokensWithBalance, numberOutcomes]);

  const redeemParentsFromTradeExecutor = useRedeemParentsToTradeExecutor(() => {
    toggleIsOpen();
  });

  const handleRedeem = () => {
    if (isUndefined(balances)) return;

    redeemParentsFromTradeExecutor.mutate({
      tokens: markets.map(({ marketId }) => marketId),
      outcomeIndexes: markets.map(({ parentMarketOutcome }) =>
        BigInt(parentMarketOutcome),
      ),
      amounts: balances,
      tradeExecutor,
    });
  };

  return (
    <Modal
      className="relative h-fit w-max min-w-full overflow-x-hidden p-6 py-8 md:min-w-2xl"
      onOpenChange={toggleIsOpen}
      {...{ isOpen }}
    >
      <LightButton
        className="absolute top-4 right-4 p-1"
        text=""
        icon={
          <CloseIcon className="[&_path]:stroke-klerosUIComponentsSecondaryText size-4" />
        }
        onPress={toggleIsOpen}
      />

      <div className="flex size-full flex-col items-center gap-6">
        <div className="flex w-full flex-col items-center gap-2">
          <h2 className="text-klerosUIComponentsPrimaryText text-2xl font-semibold">
            Redeem Tokens
          </h2>
          <p className="text-klerosUIComponentsPrimaryText text-sm">
            {isCheckingStatus
              ? "Checking redemptions..."
              : isRedeemable
                ? `You have tokens from the selected projects that were not spent. 
                   You can redeem up to ${totalValue} sDAI.`
                : "Nothing to redeem."}
          </p>
        </div>

        <Button
          text="Redeem"
          isDisabled={
            redeemParentsFromTradeExecutor.isPending ||
            isCheckingStatus ||
            !isRedeemable
          }
          isLoading={redeemParentsFromTradeExecutor.isPending}
          onPress={handleRedeem}
        />
      </div>
    </Modal>
  );
};
