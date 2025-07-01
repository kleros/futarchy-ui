import React, { useCallback, useState, useMemo } from "react";

import { useTheme } from "next-themes";

import {
  Card,
  Slider,
  Accordion,
  NumberField,
  Button,
} from "@kleros/ui-components-library";
import { waitForTransactionReceipt, sendTransaction } from "@wagmi/core";
import clsx from "clsx";
import { useSize, useToggle } from "react-use";
import { formatUnits } from "viem";
import { useConfig, useAccount } from "wagmi";

import {
  useReadErc20Allowance,
  useReadErc20BalanceOf,
  useWriteErc20Approve,
} from "@/generated";

import { IChartData } from "@/hooks/useChartData";
import { useMarketQuote } from "@/hooks/useMarketQuote";

import { IMarket } from "@/consts/markets";

import Details from "./Details";
import OpenOrders from "./OpenOrders";
import PositionValue from "./PositionValue";

interface IProjectFunding extends IMarket {
  chartData?: IChartData[];
}

const ProjectFunding: React.FC<IProjectFunding> = ({
  name,
  color,
  upToken,
  downToken,
  underlyingToken,
  minValue,
  maxValue,
  precision,
  details,
}) => {
  const wagmiConfig = useConfig();
  const { address } = useAccount();
  const { theme } = useTheme();
  const [prediction, setPrediction] = useState(0);
  const [userInteracting, toggleUserInteracting] = useToggle(false);

  const { data: allowance, refetch: refetchAllowance } = useReadErc20Allowance({
    address: underlyingToken,
    args: [address ?? "0x", "0xffb643e73f280b97809a8b41f7232ab401a04ee1"],
    query: {
      staleTime: 5000,
      enabled: typeof address !== "undefined",
    },
  });

  const { data: underlyingBalance } = useReadErc20BalanceOf({
    address: underlyingToken,
    args: [address ?? "0x"],
    query: {
      staleTime: 5000,
      enabled: typeof address !== "undefined",
    },
  });

  const isAllowance = useMemo(
    () =>
      typeof allowance !== "undefined" &&
      typeof underlyingBalance !== "undefined" &&
      allowance < underlyingBalance,
    [allowance, underlyingBalance],
  );

  const { data: marketQuote } = useMarketQuote(
    upToken,
    underlyingToken,
    underlyingBalance ? formatUnits(underlyingBalance, 18) : "1",
  );

  const { data: marketDownQuote } = useMarketQuote(
    downToken,
    underlyingToken,
    underlyingBalance ? formatUnits(underlyingBalance, 18) : "1",
  );

  const marketPrice = useMemo(
    () => 1 / parseFloat(marketQuote?.executionPrice.toFixed(4) ?? "0"),
    [marketQuote],
  );

  const marketEstimate = useMemo(
    () =>
      typeof marketPrice !== "undefined"
        ? +(marketPrice * maxValue * precision).toFixed(1)
        : 0,
    [marketPrice, maxValue, precision],
  );

  const isUpPredict = prediction > marketEstimate;

  const { writeContractAsync: increaseAllowance } = useWriteErc20Approve();

  const handleAllowance = useCallback(async () => {
    if (typeof underlyingBalance !== "undefined") {
      const hash = await increaseAllowance({
        address: underlyingToken,
        args: ["0xffb643e73f280b97809a8b41f7232ab401a04ee1", underlyingBalance],
      });
      await waitForTransactionReceipt(wagmiConfig, { hash, confirmations: 2 });
      refetchAllowance();
    }
  }, [
    wagmiConfig,
    increaseAllowance,
    refetchAllowance,
    underlyingBalance,
    underlyingToken,
  ]);

  const handlePredict = useCallback(async () => {
    const tx = await (
      isUpPredict ? marketQuote : marketDownQuote
    )?.swapTransaction({
      recipient: address!,
    });
    await sendTransaction(wagmiConfig, {
      to: tx!.to as `0x${string}`,
      data: tx!.data!.toString() as `0x${string}`,
      value: BigInt(tx?.value?.toString() || 0),
    });
  }, [address, marketQuote, marketDownQuote, wagmiConfig, isUpPredict]);

  const sliderTheme = useMemo(() => {
    if (theme === "light") return isUpPredict ? "#3FEC65" : "#F75C7B";
    else return isUpPredict ? "#D2FFDC" : "#FFD2DB";
  }, [theme, isUpPredict]);

  const [sized] = useSize(({ width }) => (
    <div className="relative w-full">
      <Slider
        className={clsx(
          "w-full",
          "[&_#slider-label]:!text-klerosUIComponentsPrimaryText [&_#slider-label]:font-semibold",
        )}
        maxValue={maxValue * precision}
        minValue={minValue * precision}
        value={prediction}
        leftLabel=""
        rightLabel=""
        aria-label="Slider"
        callback={setPrediction}
        formatter={(value) => `${(value / precision).toFixed(0)}`}
        // @ts-expect-error other values not needed
        theme={{
          sliderColor: sliderTheme,
          thumbColor: sliderTheme,
        }}
      />
      <div
        className="absolute bottom-0"
        style={{
          transform: `translateX(calc(${typeof marketPrice !== "undefined" ? marketPrice * width : 0}px - 50%))`,
        }}
      >
        <label
          className={
            "text-klerosUIComponentsPrimaryText block w-full text-center text-xs"
          }
        >
          Market
        </label>
        <div
          className={
            "rounded-base text-klerosUIComponentsLightBackground px-2 py-0.75 text-center text-xs"
          }
          style={{ backgroundColor: color }}
        >
          {`${(marketEstimate / precision).toFixed(2)}`}
        </div>
        <span className="bg-klerosUIComponentsPrimaryText mx-auto block h-9 w-0.75 rounded-b-full" />
      </div>
    </div>
  ));

  return (
    <Card
      aria-label="card"
      className="bg-klerosUIComponentsLightBackground flex h-auto w-full flex-col gap-4 px-4 py-6 md:px-8"
    >
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex max-w-full min-w-[300px] grow basis-[70%] flex-col gap-8">
          <div className="flex items-center gap-2">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: color }}
            />
            <h3 className="text-klerosUIComponentsPrimaryText font-semibold">
              {name}
            </h3>
          </div>
          <div className="px-4"> {sized} </div>
        </div>

        <div className="bg max-w-[284px] min-w-[264px] shrink-0 grow basis-[25%]">
          <label className="text-klerosUIComponentsSecondaryText text-sm">
            My Estimate (Score)
          </label>
          <div className="border-klerosUIComponentsStroke rounded-base flex flex-nowrap border">
            <NumberField
              aria-label="Prediction"
              className="w-auto [&_input]:border-none"
              value={prediction / precision}
              onChange={(e) => setPrediction(e * precision)}
            />
            <Button
              isDisabled={
                typeof address === "undefined" ||
                typeof underlyingBalance === "undefined" ||
                underlyingBalance === 0n ||
                typeof allowance === "undefined" ||
                userInteracting
              }
              isLoading={userInteracting}
              text={
                isAllowance
                  ? "Allow"
                  : underlyingBalance === 0n
                    ? "Done"
                    : "Predict"
              }
              aria-label="Predict Button"
              onPress={async () => {
                toggleUserInteracting(true);
                try {
                  if (isAllowance) {
                    await handleAllowance();
                  } else {
                    await handlePredict();
                  }
                } finally {
                  toggleUserInteracting(false);
                }
              }}
            />
          </div>
          <label
            className={clsx(
              prediction > marketEstimate
                ? "text-light-mode-green-2"
                : "text-light-mode-red-2",
            )}
          >
            {`${prediction > marketEstimate ? "↑ Higher" : "↓ Lower"} than the market`}
          </label>
        </div>
      </div>
      <div className="flex w-full flex-col">
        <div className="flex gap-2">
          <PositionValue
            {...{ upToken, downToken }}
            marketPrice={marketPrice ?? 0}
          />
          <OpenOrders />
        </div>
        <Accordion
          aria-label="accordion"
          className={clsx(
            "w-full",
            "[&_#expand-button]:bg-klerosUIComponentsLightBackground [&_#expand-button_p]:font-normal",
          )}
          items={[{ title: "Details", body: <Details {...details} /> }]}
        />
      </div>
    </Card>
  );
};

export default ProjectFunding;
