import React, { FormEvent, useState } from "react";

import {
  BigNumberField,
  Button,
  Form,
  Modal,
} from "@kleros/ui-components-library";
import clsx from "clsx";
import { Address, formatUnits, parseUnits } from "viem";
import { useAccount } from "wagmi";

import { useTradeExecutorSplit } from "@/hooks/tradeWallet/useTradeExecutorSplit";
import { useTokenBalance } from "@/hooks/useTokenBalance";

import LightButton from "@/components/LightButton";

import CloseIcon from "@/assets/svg/close-icon.svg";

import { formatValue } from "@/utils";

import { collateral } from "@/consts";

interface MintInterfaceProps {
  isOpen: boolean;
  toggleIsOpen: () => void;
  tradeExecutor: Address;
}

const MintInterface: React.FC<MintInterfaceProps> = ({
  tradeExecutor,
  isOpen,
  toggleIsOpen,
}) => {
  const [amount, setAmount] = useState<string>();

  const { address: account } = useAccount();

  const { data: balanceData, isLoading: isBalanceLoading } = useTokenBalance({
    address: tradeExecutor,
    token: collateral.address,
  });
  const balance =
    balanceData && formatUnits(balanceData.value, balanceData.decimals);

  const tradeExecutorSplit = useTradeExecutorSplit(() => {
    setAmount(undefined);
    toggleIsOpen();
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const mintAmount = data["amount"];

    if (!account) return;

    tradeExecutorSplit.mutate({
      amount: parseUnits(mintAmount as string, collateral.decimals),
      tradeExecutor,
    });
  };

  const handleMaxClick = () => {
    if (balance) {
      setAmount(balance);
    }
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
            Mint Project tokens
          </h2>
          <p className="text-klerosUIComponentsPrimaryText text-sm">
            Mint Project tokens to your Trade wallet
          </p>
        </div>
        <Form className="flex flex-col items-center gap-4" onSubmit={onSubmit}>
          <div className="relative w-full">
            <BigNumberField
              isRequired
              name="amount"
              value={amount}
              minValue={"0"}
              defaultValue={"0"}
              showFieldError
              validate={(curr) => {
                if (!curr) return null;
                return parseUnits(curr.toString() ?? "0", 18) >
                  (balanceData?.value ?? 0n)
                  ? "Not enough balance"
                  : undefined;
              }}
              message={
                isBalanceLoading
                  ? "Loading..."
                  : `Available: ${formatValue(balanceData?.value ?? 0n)} sDAI`
              }
              isReadOnly={tradeExecutorSplit.isPending}
              className="md:min-w-xl"
            />
            <LightButton
              small
              text="Max"
              onPress={handleMaxClick}
              isDisabled={tradeExecutorSplit.isPending}
              className={clsx(
                "absolute -right-1 -bottom-1 px-1 py-0.5",
                "[&_.button-text]:text-klerosUIComponentsPrimaryBlue [&_.button-text]:text-sm",
              )}
            />
          </div>

          <Button
            type="submit"
            text="Mint"
            isDisabled={
              tradeExecutorSplit.isPending ||
              isBalanceLoading ||
              balanceData?.value === 0n
            }
            isLoading={tradeExecutorSplit.isPending}
          />
        </Form>
      </div>
    </Modal>
  );
};

export default MintInterface;
