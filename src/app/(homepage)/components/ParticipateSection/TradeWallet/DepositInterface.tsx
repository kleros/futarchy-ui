import React, { FormEvent, useState } from "react";

import { Button, Form, Modal } from "@kleros/ui-components-library";
import { Address } from "viem";
import { useAccount, useBalance } from "wagmi";

import { useDepositToTradeExecutor } from "@/hooks/tradeWallet/useDepositToTradeExecutor";
import { useTokenBalance } from "@/hooks/useTokenBalance";

import AmountInput from "@/components/AmountInput";
import LightButton from "@/components/LightButton";

import CloseIcon from "@/assets/svg/close-icon.svg";

import { isUndefined } from "@/utils";

import { collateral } from "@/consts";
import { TokenType } from "@/consts/tokens";

interface DepositInterfaceProps {
  isOpen: boolean;
  toggleIsOpen: () => void;
  tradeExecutor: Address;
}

export const DepositInterface: React.FC<DepositInterfaceProps> = ({
  tradeExecutor,
  isOpen,
  toggleIsOpen,
}) => {
  const [amount, setAmount] = useState<bigint>();
  const [selectedToken, setSelectedToken] = useState<TokenType>(TokenType.sDAI);

  const { address: account } = useAccount();

  const { data: balanceSDaiData, isLoading: isBalanceLoading } =
    useTokenBalance({
      address: account,
      token: collateral.address,
    });
  const { data: balanceXDai, refetch: refetchXDai } = useBalance({
    address: account,
  });

  const depositToTradeExecutor = useDepositToTradeExecutor(() => {
    toggleIsOpen();
    setAmount(undefined);
    refetchXDai();
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isUndefined(amount)) return;

    depositToTradeExecutor.mutate({
      token: collateral.address,
      amount,
      tradeExecutor,
      isXDai: selectedToken === TokenType.xDAI,
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
            Deposit
          </h2>
          <p className="text-klerosUIComponentsPrimaryText text-sm">
            Deposit from your account to trade wallet
          </p>
        </div>
        <Form className="flex flex-col items-center gap-4" onSubmit={onSubmit}>
          <div className="relative w-full">
            <AmountInput
              {...{ setSelectedToken, setAmount, selectedToken }}
              value={amount}
              balance={
                selectedToken === TokenType.sDAI
                  ? balanceSDaiData?.value
                  : balanceXDai?.value
              }
            />
          </div>

          <Button
            type="submit"
            text="Deposit"
            isDisabled={depositToTradeExecutor.isPending || isBalanceLoading}
            isLoading={depositToTradeExecutor.isPending}
          />
        </Form>
      </div>
    </Modal>
  );
};
