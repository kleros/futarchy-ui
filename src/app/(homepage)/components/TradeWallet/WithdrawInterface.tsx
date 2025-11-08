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

import { useWithdrawFromTradeExecutor } from "@/hooks/tradeWallet/useWithdrawFromTradeExecutor";
import { useTokenBalance } from "@/hooks/useTokenBalance";

import LightButton from "@/components/LightButton";

import CloseIcon from "@/assets/svg/close-icon.svg";

import { formatValue } from "@/utils";

import { collateral } from "@/consts";

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
  const [amount, setAmount] = useState<string>();

  const { address: account } = useAccount();

  const { data: balanceData, isLoading: isBalanceLoading } = useTokenBalance({
    address: tradeExecutor,
    token: collateral.address,
  });
  const balance =
    balanceData && formatUnits(balanceData.value, balanceData.decimals);

  const withdrawFromTradeExecutor = useWithdrawFromTradeExecutor(() => {
    toggleIsOpen();
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const depositAmount = data["amount"];

    if (!account) return;

    withdrawFromTradeExecutor.mutate({
      account,
      tokens: [collateral.address],
      amounts: [parseUnits(depositAmount as string, collateral.decimals)],
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
            Withdraw sDAI
          </h2>
          <p className="text-klerosUIComponentsPrimaryText text-sm">
            Withdraw from trade wallet to your account
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
              isReadOnly={withdrawFromTradeExecutor.isPending}
              className="md:min-w-xl"
            />
            <LightButton
              small
              text="Max"
              onPress={handleMaxClick}
              isDisabled={withdrawFromTradeExecutor.isPending}
              className={clsx(
                "absolute -right-1 -bottom-1 px-1 py-0.5",
                "[&_.button-text]:text-klerosUIComponentsSecondaryText [&_.button-text]:text-sm",
              )}
            />
          </div>

          <Button
            type="submit"
            text="Withdraw"
            isDisabled={
              withdrawFromTradeExecutor.isPending ||
              isBalanceLoading ||
              balanceData?.value === 0n
            }
            isLoading={withdrawFromTradeExecutor.isPending}
          />
        </Form>
      </div>
    </Modal>
  );
};
