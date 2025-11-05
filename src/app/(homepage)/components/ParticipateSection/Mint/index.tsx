import React, { useState, useMemo } from "react";

import { Accordion, Card } from "@kleros/ui-components-library";
import clsx from "clsx";
import { useToggle } from "react-use";
import { type Address } from "viem";

import { useTokenBalance } from "@/hooks/useTokenBalance";
import { useTokenBalances } from "@/hooks/useTokenBalances";

import ArrowDownIcon from "@/assets/svg/arrow-down.svg";

import { collateral } from "@/consts";
import { markets } from "@/consts/markets";

import AmountInput from "./AmountInput";
import MergeButton from "./MergeButton";
import ProjectAmount from "./ProjectAmount";
import SDaiButton from "./SDaiButton";
import TopLeftInfo from "./TopLeftInfo";

interface IMint {
  tradeExecutor: Address;
}
const Mint: React.FC<IMint> = ({ tradeExecutor }) => {
  const { data: balanceSDaiData } = useTokenBalance({
    address: tradeExecutor,
    token: collateral.address,
  });

  const [amount, setAmount] = useState<bigint>(0n);

  const [isSplit, toggleIsSplit] = useToggle(true);

  const marketBalances = useTokenBalances(
    markets.map(({ underlyingToken }) => underlyingToken),
    tradeExecutor,
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

  return (
    <Card
      round
      className={clsx(
        "border-gradient-purple-blue h-auto w-full border-none px-4 pt-4 pb-10.5 md:px-7.25 md:pt-6",
        "flex flex-col gap-8.5",
      )}
    >
      <div className="flex flex-wrap gap-x-25.25 gap-y-4">
        <TopLeftInfo balance={balanceSDaiData?.value ?? 0n} />
        {isSplit ? (
          <AmountInput
            key="split"
            defaultValue={amount === 0n ? undefined : amount}
            balance={balanceSDaiData?.value}
            value={amount}
            {...{ setAmount }}
          />
        ) : (
          <AmountInput
            key="merge"
            value={minMarketBalance}
            balance={minMarketBalance}
            {...{ setAmount }}
          />
        )}
      </div>

      <Card
        className={clsx(
          "border-klerosUIComponentsSecondaryBlue relative h-auto w-full",
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
        <Accordion
          className={clsx(
            "w-full border-none",
            "[&_#expand-button]:h-12 [&_#expand-button]:border-none",
            "[&>div]:my-0",
          )}
          items={[
            {
              title: "",
              body: (
                <div
                  className={clsx(
                    "grid w-full grid-cols-[repeat(auto-fit,minmax(200px,260px))] place-content-center gap-4",
                    "px-4 pb-12",
                  )}
                >
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
                        } else {
                          return amount;
                        }
                        return 0n;
                      })()}
                    />
                  ))}
                </div>
              ),
            },
          ]}
        />

        {isSplit ? (
          <SDaiButton
            {...{
              amount,
              tradeExecutor,
            }}
          />
        ) : (
          <MergeButton amount={minMarketBalance} {...{ tradeExecutor }} />
        )}
      </Card>
    </Card>
  );
};

export default Mint;
