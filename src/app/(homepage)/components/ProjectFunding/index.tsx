import React, { useCallback, useState, useMemo } from "react";

import { useTheme } from "next-themes";

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
import { useConfig, useAccount } from "wagmi";

import {
  useReadErc20Allowance,
  useReadErc20BalanceOf,
  useWriteErc20Approve,
} from "@/generated";

import { useCowSdk } from "@/context/CowContext";
import { IChartData } from "@/hooks/useChartData";
import { useMarketQuote } from "@/hooks/useMarketQuote";

import { getContractInfo } from "@/consts";
import { IMarket, endTime } from "@/consts/markets";

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
  chartData,
}) => {
  const wagmiConfig = useConfig();
  const { address } = useAccount();
  const { theme } = useTheme();
  const [prediction, setPrediction] = useState(0);
  const [userInteracting, toggleUserInteracting] = useToggle(false);
  const { sdk } = useCowSdk();

  const { address: cowSwapAddress } = getContractInfo("cowSwap");

  const { data: allowance, refetch: refetchAllowance } = useReadErc20Allowance({
    address: underlyingToken,
    args: [address ?? "0x", cowSwapAddress],
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

  const marketPrice = useMemo(() => {
    if (typeof chartData !== "undefined") {
      const chartSlot = chartData.find(
        (data) => Object.values(data)[0].market.upToken === upToken,
      );
      if (typeof chartSlot !== "undefined") {
        const lastValue = Object.entries(chartSlot)[0][1].data.at(-1)?.value;
        if (typeof lastValue !== "undefined") {
          return lastValue / maxValue;
        }
      }
    }
  }, [chartData, upToken, maxValue]);
  useMarketQuote(upToken, underlyingToken);
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
    underlyingToken,
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
          validTo: endTime,
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
