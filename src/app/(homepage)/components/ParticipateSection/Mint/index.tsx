import React, { useState, useMemo } from "react";

import { Card } from "@kleros/ui-components-library";
import clsx from "clsx";
import { useToggle } from "react-use";
import { useAccount, useBalance } from "wagmi";

import {
  useSimulateSDaiAdapterDepositXdai,
  useReadSDaiBalanceOf,
} from "@/generated";

import { useTokenBalances } from "@/hooks/useTokenBalances";

import ArrowDownIcon from "@/assets/svg/arrow-down.svg";

import { markets } from "@/consts/markets";

import AmountInput, { TokenType } from "./AmountInput";
import MergeButton from "./MergeButton";
import ProjectAmount from "./ProjectAmount";
import SDaiButton from "./SDaiButton";
import TopLeftInfo from "./TopLeftInfo";
import XDaiButton from "./XDaiButton";

const Mint: React.FC = () => {
  const { address } = useAccount();
  const { data: balanceXDai, refetch: refetchXDai } = useBalance({
    address,
  });
  const { data: balanceSDai, refetch: refetchSDai } = useReadSDaiBalanceOf({
    args: [address!],
  });

  const [amount, setAmount] = useState<bigint>(0n);
  const [selectedToken, setSelectedToken] = useState<TokenType>(TokenType.sDAI);

  const [isMinting, toggleIsMinting] = useToggle(false);
  const [isSplit, toggleIsSplit] = useToggle(true);

  const resultDeposit = useSimulateSDaiAdapterDepositXdai({
    args: [address!],
    value: amount,
    query: {
      enabled: typeof address !== "undefined" && amount > 0,
      retry: false,
    },
  });

  const marketBalances = useTokenBalances(
    markets.map(({ underlyingToken }) => underlyingToken),
  );

  const minMarketBalance = useMemo<bigint>(() => {
    if (typeof marketBalances.data !== "undefined") {
      if (marketBalances.data.some(({ result }) => typeof result !== "bigint"))
        return 0n;
      const flatResults = marketBalances.data.map(({ result }) => result);
      const minResult = flatResults.reduce((acc, curr) =>
        curr! < acc! ? curr : acc,
      );
      return minResult as bigint;
    }
    return 0n;
  }, [marketBalances]);

  const isSDaiSelected = useMemo(
    () => selectedToken === TokenType.sDAI,
    [selectedToken],
  );

  const notEnoughBalance = useMemo(() => {
    if (
      typeof amount === "undefined" ||
      typeof balanceXDai === "undefined" ||
      typeof balanceSDai === "undefined"
    )
      return false;
    else if (isSDaiSelected) return amount > balanceSDai;
    else return amount > balanceXDai.value;
  }, [balanceXDai, balanceSDai, amount, isSDaiSelected]);

  return (
    <Card
      round
      className={clsx(
        "border-gradient-purple-blue h-auto w-full border-none px-4 pt-4 pb-10.5 md:px-7.25 md:pt-6",
        "flex flex-col gap-8.5",
      )}
    >
      <div className="flex flex-wrap gap-x-25.25 gap-y-4">
        <TopLeftInfo
          balance={
            isSDaiSelected ? (balanceSDai ?? 0n) : (balanceXDai?.value ?? 0n)
          }
          {...{ isSDaiSelected }}
        />
        {isSplit ? (
          <AmountInput
            key="split"
            defaultValue={amount === 0n ? undefined : amount}
            {...{ setAmount, setSelectedToken, notEnoughBalance }}
          />
        ) : (
          <AmountInput
            key="merge"
            value={minMarketBalance}
            {...{ setAmount, setSelectedToken, notEnoughBalance }}
          />
        )}
      </div>

      <Card
        className={clsx(
          "border-klerosUIComponentsSecondaryBlue relative grid h-auto w-full",
          "px-4 pt-6 pb-12",
          "grid w-full grid-cols-[repeat(auto-fit,minmax(200px,260px))] place-content-center gap-4",
        )}
      >
        <div
          className={clsx(
            "absolute top-0 right-1/2 translate-x-1/2 -translate-y-6.5",
            "rounded-base bg-klerosUIComponentsPrimaryBlue flex w-23.25 items-center justify-center py-3",
            "hover:cursor-pointer",
          )}
          onClick={toggleIsSplit}
        >
          <ArrowDownIcon
            className={clsx(
              "[&_path]:fill-klerosUIComponentsWhiteBackground size-3.5",
              !isSplit && "rotate-180",
            )}
          />
        </div>
        {markets.map(({ name, color }, i) => (
          <ProjectAmount
            key={name}
            {...{ name, color }}
            balance={marketBalances?.data?.[i].result as bigint}
            amount={((): bigint => {
              if (!isSplit) {
                if (minMarketBalance) {
                  return minMarketBalance;
                }
              } else if (isSDaiSelected) {
                return amount;
              } else if (resultDeposit.data) {
                return resultDeposit.data.result;
              }
              return 0n;
            })()}
          />
        ))}
        {isSplit ? (
          isSDaiSelected ? (
            <SDaiButton
              refetchBalances={marketBalances.refetch}
              {...{
                amount,
                setAmount,
                refetchSDai,
                refetchXDai,
                isMinting,
                toggleIsMinting,
              }}
            />
          ) : (
            <XDaiButton
              refetchBalances={marketBalances.refetch}
              {...{
                amount,
                setAmount,
                refetchSDai,
                refetchXDai,
                isMinting,
                toggleIsMinting,
              }}
            />
          )
        ) : (
          <MergeButton
            amount={minMarketBalance}
            refetchBalances={marketBalances.refetch}
            {...{
              refetchSDai,
              isMinting,
              toggleIsMinting,
            }}
          />
        )}
      </Card>
    </Card>
  );
};

export default Mint;
