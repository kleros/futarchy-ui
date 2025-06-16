import React, { useState } from "react";
import { useToggle } from "react-use";
import { useAccount, useBalance, useConfig } from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { parseUnits, formatUnits } from "viem";
import clsx from "clsx";

import BigNumber from "bignumber.js";

import {
  Button,
  Card,
  BigNumberField,
  Switch,
} from "@kleros/ui-components-library";

import ProjectAmount from "@/components/ProjectAmount";
import { projects } from "@/consts";
import {
  useSimulateGnosisRouterSplitFromBase,
  useSimulateSDaiAdapterDepositXdai,
  useWriteGnosisRouterSplitFromBase,
  useReadSDaiBalanceOf,
} from "@/generated";

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
  const [isSDaiSelected, toggleSDaiSelected] = useToggle(false);

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
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-end gap-8">
        <BigNumberField
          className="inline-block w-36"
          value={amount}
          onChange={setAmount}
          variant={resultDeposit.isError ? "error" : undefined}
          message={
            resultDeposit.isError ? resultDeposit.error.message : undefined
          }
          label={
            isSDaiSelected
              ? `max. ${parseFloat(formatUnits(balanceSDai ?? 0n, 18)).toFixed(2)} sDAI`
              : `max. ${parseFloat(
                  formatUnits(
                    balanceXDai?.value ?? 0n,
                    balanceXDai?.decimals ?? 18,
                  ),
                ).toFixed(2)} xDAI`
          }
        />
        <div className="flex flex-col items-center">
          <label className="text-klerosUIComponentsPrimaryText block">
            sDAI
          </label>
          <Switch small onChange={toggleSDaiSelected} />
        </div>
      </div>
      <Card
        className={clsx(
          "border-klerosUIComponentsPrimaryBlue relative grid h-auto w-full",
          "grid-flow-row grid-cols-4 gap-4 px-4 pt-6 pb-12",
        )}
      >
        {projects.map(({ name, color }) => (
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
          text="Convert to Property Tokens"
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
    </div>
  );
};

export default Mint;
