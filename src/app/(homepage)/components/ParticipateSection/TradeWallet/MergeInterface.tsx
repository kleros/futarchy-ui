import React, { FormEvent, useMemo, useState } from "react";

import {
  BigNumberField,
  Button,
  Form,
  Modal,
} from "@kleros/ui-components-library";
import clsx from "clsx";
import { Address, formatUnits, parseUnits } from "viem";
import { useAccount } from "wagmi";

import { useTradeExecutorMerge } from "@/hooks/tradeWallet/useTradeExecutorMerge";
import { useTokensBalances } from "@/hooks/useTokenBalances";

import LightButton from "@/components/LightButton";

import CloseIcon from "@/assets/svg/close-icon.svg";

import { formatValue, isUndefined } from "@/utils";

import { collateral, DECIMALS } from "@/consts";
import { markets } from "@/consts/markets";

interface MergeInterfaceProps {
  isOpen: boolean;
  toggleIsOpen: () => void;
  tradeExecutor: Address;
}

const MergeInterface: React.FC<MergeInterfaceProps> = ({
  tradeExecutor,
  isOpen,
  toggleIsOpen,
}) => {
  const [amount, setAmount] = useState<string>();

  const { address: account } = useAccount();

  const { data: marketBalances, isLoading: isBalanceLoading } =
    useTokensBalances(
      tradeExecutor,
      markets.map(({ underlyingToken }) => underlyingToken),
    );

  const minMarketBalance = useMemo<bigint>(() => {
    if (!isUndefined(marketBalances)) {
      if (marketBalances.some((result) => typeof result !== "bigint"))
        return 0n;
      const minResult = marketBalances.reduce((acc, curr) =>
        curr! < acc! ? curr : acc,
      );
      return minResult as bigint;
    }
    return 0n;
  }, [marketBalances]);

  const tradeExecutorMerge = useTradeExecutorMerge(() => {
    setAmount(undefined);
    toggleIsOpen();
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const mergeAmount = data["amount"];

    if (!account) return;

    tradeExecutorMerge.mutate({
      amount: parseUnits(mergeAmount as string, collateral.decimals),
      tradeExecutor,
    });
  };

  const handleMaxClick = () => {
    if (minMarketBalance) {
      setAmount(formatUnits(minMarketBalance, DECIMALS));
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
            Merge Project tokens
          </h2>
          <p className="text-klerosUIComponentsPrimaryText text-sm">
            Merge Project tokens to your account
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
                  (minMarketBalance ?? 0n)
                  ? "Not enough balance"
                  : undefined;
              }}
              message={
                isBalanceLoading
                  ? "Loading..."
                  : `Available: ${formatValue(minMarketBalance ?? 0n)} sDAI`
              }
              isReadOnly={tradeExecutorMerge.isPending}
              className="md:min-w-xl"
            />
            <LightButton
              small
              text="Max"
              onPress={handleMaxClick}
              isDisabled={tradeExecutorMerge.isPending}
              className={clsx(
                "absolute -right-1 -bottom-1 px-1 py-0.5",
                "[&_.button-text]:text-klerosUIComponentsPrimaryText [&_.button-text]:text-sm",
              )}
            />
          </div>

          <Button
            type="submit"
            text="Merge"
            isDisabled={
              tradeExecutorMerge.isPending ||
              isBalanceLoading ||
              minMarketBalance === 0n
            }
            isLoading={tradeExecutorMerge.isPending}
          />
        </Form>
      </div>
    </Modal>
  );
};

export default MergeInterface;
