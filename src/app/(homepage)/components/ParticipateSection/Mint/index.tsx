import React, { useState } from "react";

import { Button, Card } from "@kleros/ui-components-library";
import { waitForTransactionReceipt } from "@wagmi/core";
import BigNumber from "bignumber.js";
import clsx from "clsx";
import { useToggle } from "react-use";
import { parseUnits, formatUnits } from "viem";
import { useAccount, useBalance, useConfig } from "wagmi";

import {
  useSimulateGnosisRouterSplitFromBase,
  useSimulateSDaiAdapterDepositXdai,
  useWriteGnosisRouterSplitFromBase,
  useReadSDaiBalanceOf,
} from "@/generated";

import ArrowDownIcon from "@/assets/svg/arrow-down.svg";

import { markets } from "@/consts/markets";

import AmountInput, { TokenType } from "./AmountInput";
import ProjectAmount from "./ProjectAmount";
import TopLeftInfo from "./TopLeftInfo";

const Mint: React.FC = () => {
  const { address } = useAccount();
  const config = useConfig();
  const { data: balanceXDai, refetch: refetchXDai } = useBalance({
    address,
  });
  const { data: balanceSDai, refetch: refetchSDai } = useReadSDaiBalanceOf({
    args: [address!],
  });

  const [amount, setAmount] = useState<BigNumber>(BigNumber("0"));
  const [selectedToken, setSelectedToken] = useState<TokenType>(TokenType.sDAI);

  const [isMinting, toggleIsMinting] = useToggle(false);

  const resultDeposit = useSimulateSDaiAdapterDepositXdai({
    args: [address!],
    value: BigInt(parseUnits(amount.toString(), 18)),
    query: {
      enabled: typeof address !== "undefined" && amount.gt(0),
      retry: false,
    },
  });

  const resultSplit = useSimulateGnosisRouterSplitFromBase({
    args: ["0x6c40Dfc5EF3568DA192010cc831f2e6900DF439e"],
    value: BigInt(parseUnits(amount.toString(), 18)),
    query: {
      enabled: typeof address !== "undefined" && amount.gt(0),
    },
  });

  const { writeContractAsync } = useWriteGnosisRouterSplitFromBase();

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
            selectedToken === TokenType.sDAI
              ? (balanceSDai ?? 0n)
              : (balanceXDai?.value ?? 0n)
          }
          isSDaiSelected={selectedToken === TokenType.sDAI}
        />
        <AmountInput {...{ amount, setAmount, setSelectedToken }} />
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
          )}
        >
          <ArrowDownIcon className="[&_path]:fill-klerosUIComponentsWhiteBackground size-3.5" />
        </div>
        {markets.map(({ name, color }) => (
          <ProjectAmount
            key={name}
            {...{ name, color }}
            amount={
              resultDeposit.data
                ? BigNumber(formatUnits(resultDeposit.data.result, 18))
                : BigNumber("0")
            }
          />
        ))}
        <Button
          isLoading={isMinting}
          isDisabled={isMinting}
          className="absolute right-1/2 bottom-0 translate-1/2"
          text="Convert to Movie Tokens"
          onClick={async () => {
            toggleIsMinting(true);
            try {
              if (typeof resultSplit.data !== "undefined") {
                const tx = await writeContractAsync(resultSplit.data?.request);
                await waitForTransactionReceipt(config, { hash: tx });
                refetchSDai();
                refetchXDai();
              }
            } finally {
              toggleIsMinting(false);
            }
          }}
        />
      </Card>
    </Card>
  );
};

export default Mint;
