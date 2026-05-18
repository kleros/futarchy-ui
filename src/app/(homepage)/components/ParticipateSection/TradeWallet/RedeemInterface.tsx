import React, { useMemo } from "react";

import { Button, Modal } from "@kleros/ui-components-library";
import { Address } from "viem";

import { useRedeemFullBatchToTradeExecutor } from "@/hooks/tradeWallet/useRedeemFullBatchToTradeExecutor";
import { useMarketResolutionInfo } from "@/hooks/useMarketResolutionInfo";

import LightButton from "@/components/LightButton";

import CloseIcon from "@/assets/svg/close-icon.svg";

import { formatError } from "@/utils/formatError";

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
  const {
    isCheckingStatus,
    isRedeemable,
    parentRedeemConfig,
    childRedeemConfig,
    totalValue,
    winningChildMarkets,
    numberOutcomes,
    areAllChildResolved,
    childResolvedByMarketId,
  } = useMarketResolutionInfo(tradeExecutor);
  const redeemFullBatch = useRedeemFullBatchToTradeExecutor(() => {
    toggleIsOpen();
  });

  const handleRedeem = () => {
    if (!isRedeemable) return;

    redeemFullBatch.mutate({
      tradeExecutor,
      parent: parentRedeemConfig, // it can be undefined since it's possible there's nothing to redeem on parent side
      children: childRedeemConfig,
    });
  };

  const mutationErrorText =
    redeemFullBatch.isError && redeemFullBatch.error
      ? formatError(redeemFullBatch.error)
      : undefined;

  const statusMessage = useMemo(() => {
    if (isCheckingStatus) return "Checking redemptions...";
    if (numberOutcomes === 0) return "Parent market is not resolved yet.";
    if (!areAllChildResolved) {
      const pending = winningChildMarkets.filter(
        (m) => !childResolvedByMarketId.get(m.marketId),
      );
      const names = pending.map((m) => m.name).join(", ");
      return pending.length > 0
        ? `Waiting for child markets to resolve: ${names}`
        : "Waiting for child markets to resolve.";
    }
    if (isRedeemable) {
      return `Redeemable value: ${totalValue ? ` ${totalValue} sDAI` : "."}`;
    }
    return "Nothing to redeem.";
  }, [
    areAllChildResolved,
    childResolvedByMarketId,
    isCheckingStatus,
    isRedeemable,
    numberOutcomes,
    totalValue,
    winningChildMarkets,
  ]);

  return (
    <Modal
      className="relative h-fit w-full min-w-full overflow-x-hidden p-6 py-8 md:w-max md:min-w-2xl"
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
          <p className="text-klerosUIComponentsPrimaryText text-center text-sm text-wrap whitespace-pre">
            {statusMessage}
          </p>
          {mutationErrorText ? (
            <p className="text-center text-sm text-red-600">
              {mutationErrorText}
            </p>
          ) : null}
        </div>

        <Button
          text="Redeem"
          isDisabled={
            redeemFullBatch.isPending || isCheckingStatus || !isRedeemable
          }
          isLoading={redeemFullBatch.isPending}
          onPress={handleRedeem}
        />
      </div>
    </Modal>
  );
};
