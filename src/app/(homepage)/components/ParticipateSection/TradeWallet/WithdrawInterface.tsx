import React, { FormEvent, useMemo, useState } from "react";

import { Button, Form, Modal } from "@kleros/ui-components-library";
import { Address } from "viem";
import { useAccount, useBalance } from "wagmi";

import { useWithdrawFromTradeExecutor } from "@/hooks/tradeWallet/useWithdrawFromTradeExecutor";
import { useTokenBalance } from "@/hooks/useTokenBalance";

import LightButton from "@/components/LightButton";

import CloseIcon from "@/assets/svg/close-icon.svg";

import { Tokens, TokenType } from "@/consts";
import AmountInput from "@/components/AmountInput";

interface WithdrawInterfaceProps {
  isOpen: boolean;
  toggleIsOpen: () => void;
  tradeExecutor: Address;
}

export const WithdrawInterface: React.FC<WithdrawInterfaceProps> = ({
  tradeExecutor,
  isOpen,
  toggleIsOpen,
}) => {
  const [amount, setAmount] = useState<bigint>();
  const [selectedToken, setSelectedToken] = useState<TokenType>(TokenType.sDAI);

  const { address: account } = useAccount();

  const { data: balanceData } = useTokenBalance({
    address: tradeExecutor,
    token: Tokens[selectedToken].address,
  });
  const { data: balanceXDai } = useBalance({
    address: tradeExecutor,
  });

  const balance = useMemo(() => {
    if (selectedToken === TokenType.xDAI) {
      return balanceXDai?.value ?? 0n;
    }
    return balanceData?.value ?? 0n;
  }, [balanceXDai, balanceData, selectedToken]);

  const withdrawFromTradeExecutor = useWithdrawFromTradeExecutor(() => {
    setAmount(undefined);
    toggleIsOpen();
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!account || !amount) return;

    withdrawFromTradeExecutor.mutate({
      account,
      tokens: [Tokens[selectedToken].address],
      amounts: [amount],
      isXDai: selectedToken === TokenType.xDAI,
      tradeExecutor,
    });
  };

  return (
    <Modal
      className="relative h-fit w-max overflow-x-hidden p-6 py-8"
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

      <div className="flex size-full flex-col gap-6">
        <div className="flex w-full flex-col items-center gap-2">
          <h2 className="text-klerosUIComponentsPrimaryText text-2xl font-semibold">
            Withdraw
          </h2>
          <p className="text-klerosUIComponentsPrimaryText text-sm">
            Withdraw from trade wallet to your account
          </p>
        </div>
        <Form className="flex flex-col items-center gap-4" onSubmit={onSubmit}>
          <div className="relative w-full">
            <AmountInput
              {...{ setSelectedToken, setAmount, selectedToken }}
              value={amount}
              isWithdraw
              balance={balance}
              inputProps={{ isReadOnly: withdrawFromTradeExecutor.isPending }}
            />
          </div>

          <Button
            type="submit"
            text="Withdraw"
            isDisabled={
              withdrawFromTradeExecutor.isPending ||
              (selectedToken === TokenType.xDAI
                ? !balanceXDai
                : !balanceData) ||
              balance === 0n
            }
            isLoading={withdrawFromTradeExecutor.isPending}
          />
        </Form>
      </div>
    </Modal>
  );
};
