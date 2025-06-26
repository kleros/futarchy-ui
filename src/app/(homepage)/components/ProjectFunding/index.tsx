import React, { useCallback, useState, useMemo } from "react";

import { OrderKind } from "@cowprotocol/cow-sdk";
import {
  Card,
  Slider,
  Accordion,
  NumberField,
  Button,
} from "@kleros/ui-components-library";
import { waitForTransactionReceipt } from "@wagmi/core";
import clsx from "clsx";
import { useSize, useToggle } from "react-use";
import { Address } from "viem";
import { useConfig, useAccount } from "wagmi";

import {
  useReadErc20Allowance,
  useReadErc20BalanceOf,
  useWriteSDaiApprove,
} from "@/generated";

import { useCowSdk } from "@/context/CowContext";
import { useMarketQuote } from "@/hooks/useMarketQuote";

import { getContractInfo } from "@/consts";

import OpenOrders from "./OpenOrders";
import PositionValue from "./PositionValue";

interface IProjectFunding {
  name: string;
  color: string;
  upToken: Address;
  downToken: Address;
  underlyingToken: Address;
  minValue: number;
  maxValue: number;
  precision: number;
  details: string;
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
  const [prediction, setPrediction] = useState(0);
  const [userInteracting, toggleUserInteracting] = useToggle(false);
  const { sdk } = useCowSdk();

  const { address: cowSwapAddress } = getContractInfo("cowSwap");

  const { data: allowance, refetch: refetchAllowance } = useReadErc20Allowance({
    address: underlyingToken,
    args: [address ?? "0x", cowSwapAddress],
    query: {
      enabled: typeof address !== "undefined",
    },
  });

  const { data: underlyingBalance } = useReadErc20BalanceOf({
    address: underlyingToken,
    args: [address ?? "0x"],
    query: {
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

  const { data: marketPrice } = useMarketQuote(upToken);

  const marketEstimate = useMemo(
    () =>
      typeof marketPrice !== "undefined"
        ? +(marketPrice * maxValue * precision).toFixed(1)
        : 0,
    [marketPrice, maxValue, precision],
  );

  const isUpPredict = prediction > marketEstimate;

  const { writeContractAsync: increaseAllowance } = useWriteSDaiApprove();

  const handleAllowance = useCallback(async () => {
    if (typeof underlyingBalance !== "undefined") {
      const hash = await increaseAllowance({
        args: [cowSwapAddress, underlyingBalance],
      });
      await waitForTransactionReceipt(wagmiConfig, { hash, confirmations: 2 });
      refetchAllowance();
    }
  }, [
    wagmiConfig,
    cowSwapAddress,
    increaseAllowance,
    refetchAllowance,
    underlyingBalance,
  ]);

  const handlePredict = useCallback(async () => {
    if (typeof underlyingBalance !== "undefined") {
      const isUp = prediction > marketEstimate;
      const buyAmount =
        (BigInt((prediction / maxValue) * precision * 1000) *
          underlyingBalance) /
        BigInt(1000);
      const buyToken = isUp ? upToken : downToken;
      if (typeof underlyingBalance !== "undefined") {
        await sdk.postLimitOrder({
          kind: OrderKind.SELL,
          sellToken: underlyingToken,
          sellTokenDecimals: 18,
          sellAmount: underlyingBalance.toString(),
          buyToken,
          buyTokenDecimals: 18,
          buyAmount: buyAmount.toString(),
          partiallyFillable: true,
        });
      }
    }
  }, [
    sdk,
    underlyingBalance,
    underlyingToken,
    downToken,
    marketEstimate,
    maxValue,
    precision,
    prediction,
    upToken,
  ]);

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
          sliderColor: isUpPredict ? "#3FEC65" : "#F75C7B",
          thumbColor: isUpPredict ? "#3FEC65" : "#F75C7B",
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
          className={"rounded-base px-2 py-0.75 text-center text-xs"}
          style={{ backgroundColor: color }}
        >
          {`${(marketEstimate / precision).toFixed(2)}`}
        </div>
        <span className="mx-auto block h-9 w-0.75 rounded-b-full bg-black" />
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
                typeof allowance === "undefined" ||
                userInteracting
              }
              isLoading={userInteracting}
              text={isAllowance ? "Allow" : "Predict"}
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
          <PositionValue {...{ upToken, downToken }} />
          <OpenOrders />
        </div>
        <Accordion
          aria-label="accordion"
          className={clsx(
            "w-full",
            "[&_#expand-button]:bg-klerosUIComponentsLightBackground [&_#expand-button_p]:font-normal",
          )}
          items={[{ title: "Details", body: <p>{details}</p> }]}
        />
      </div>
    </Card>
  );
};

export default ProjectFunding;
