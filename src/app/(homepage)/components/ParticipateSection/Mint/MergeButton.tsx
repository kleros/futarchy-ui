import React from "react";

import { Button } from "@kleros/ui-components-library";
import { Address } from "viem";

import { useTradeExecutorMerge } from "@/hooks/tradeWallet/useTradeExecutorMerge";

interface IMergeButton {
  amount: bigint;
  tradeExecutor: Address;
}

const MergeButton: React.FC<IMergeButton> = ({ amount, tradeExecutor }) => {
  const tradeExecutorMerge = useTradeExecutorMerge();

  const handleSubmit = () => {
    tradeExecutorMerge.mutate({
      tradeExecutor,
      amount,
    });
  };
  return (
    <Button
      isLoading={tradeExecutorMerge.isPending}
      isDisabled={tradeExecutorMerge.isPending || amount === 0n}
      className="absolute right-1/2 bottom-0 translate-1/2"
      text="Merge to sDAI"
      onPress={handleSubmit}
    />
  );
};

export default MergeButton;
