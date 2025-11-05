import React from "react";

import { Button } from "@kleros/ui-components-library";
import { Address } from "viem";

import { useTradeExecutorSplit } from "@/hooks/tradeWallet/useTradeExecutorSplit";

interface ISDaiButton {
  amount: bigint;
  tradeExecutor: Address;
}

const SDaiButton: React.FC<ISDaiButton> = ({ amount, tradeExecutor }) => {
  const tradeExecutorSplit = useTradeExecutorSplit();

  const handleSplit = () => {
    tradeExecutorSplit.mutate({
      amount,
      tradeExecutor,
    });
  };

  return (
    <Button
      isLoading={tradeExecutorSplit.isPending}
      isDisabled={tradeExecutorSplit.isPending || amount === 0n}
      className="absolute right-1/2 bottom-0 translate-1/2"
      text={"Convert to Movie Tokens"}
      onPress={handleSplit}
    />
  );
};

export default SDaiButton;
