import React, { useCallback, useState, useMemo } from "react";

import { OrderKind } from "@cowprotocol/cow-sdk";
import {
  Card,
  Slider,
  Accordion,
  NumberField,
  Button,
} from "@kleros/ui-components-library";
import clsx from "clsx";
import { useSize } from "react-use";

import {
  sDaiAddress,
  useReadSDaiAllowance,
  useWriteSDaiIncreaseAllowance,
} from "@/generated";

import { useCowSdk } from "@/context/CowContext";
import { useMarketQuote } from "@/hooks/useMarketQuote";

import { getContractInfo } from "@/consts";

interface IProjectFunding {
  name: string;
  color: string;
  upToken: string;
  downToken: string;
  minValue: number;
  maxValue: number;
}

const ProjectFunding: React.FC<IProjectFunding> = ({
  name,
  color,
  upToken,
  downToken,
  minValue,
  maxValue,
}) => {
  const [prediction, setPrediction] = useState(0);
  const { sdk, orderBook } = useCowSdk();

  const { address: cowSwapAddress } = getContractInfo("cowSwap");

  const { data: allowance } = useReadSDaiAllowance({
    args: ["0xC68F522a48Ee16afa75337602538cF9f90c71Bb4", cowSwapAddress],
  });

  const { data: marketPrice } = useMarketQuote(upToken);

  const marketEstimate = useMemo(
    () =>
      typeof marketPrice !== "undefined"
        ? +(marketPrice * maxValue).toFixed(1)
        : 0,
    [marketPrice, maxValue],
  );

  const { writeContractAsync: increaseAllowance } =
    useWriteSDaiIncreaseAllowance();

  const handlePredict = useCallback(
    async (buyToken: string, buyAmount: string) => {
      if (
        typeof allowance !== "undefined" &&
        allowance < BigInt(1000000000000000)
      ) {
        await increaseAllowance({
          args: [cowSwapAddress, BigInt(1000000000000000)],
        });
      } else {
        const orderId = await sdk.postLimitOrder({
          kind: OrderKind.SELL,
          sellToken: sDaiAddress,
          sellTokenDecimals: 18,
          sellAmount: "1000000000000000",
          buyToken,
          buyTokenDecimals: 18,
          buyAmount,
          partiallyFillable: true,
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const orderData = await orderBook.getOrder(orderId);
      }
    },
    [sdk, orderBook, allowance, cowSwapAddress, increaseAllowance],
  );

  const [sized] = useSize(({ width }) => (
    <div className="relative w-full">
      <Slider
        className="w-full"
        {...{ minValue, maxValue }}
        value={prediction}
        leftLabel=""
        rightLabel=""
        aria-label="Slider"
        callback={setPrediction}
        formatter={(value) => `${(value / 10).toFixed(1)}%`}
      />
      <div
        className="absolute bottom-0"
        style={{
          transform: `translateX(calc(${typeof marketPrice !== "undefined" ? marketPrice * width : 0}px - 50%))`,
        }}
      >
        <label
          className={
            "text-klerosUIComponentsPrimaryText block w-full text-center"
          }
        >
          Market
        </label>
        <div
          className={
            "bg-klerosUIComponentsPrimaryBlue rounded-sm px-1 text-center"
          }
        >
          {`${(marketEstimate / 10).toFixed(2)}%`}
        </div>
        <span className="mx-auto block h-9 w-1 rounded-full bg-black" />
      </div>
    </div>
  ));

  return (
    <Card aria-label="card" className="h-auto w-full px-8 py-6">
      <div className="flex items-center gap-2">
        <span
          className="size-2 rounded-full"
          style={{ backgroundColor: color }}
        />
        <h3 className="text-klerosUIComponentsPrimaryText font-bold">{name}</h3>
      </div>

      <div className="grid grid-cols-[75%_25%] items-center">
        <div className="px-4"> {sized} </div>
        <div>
          <label className="text-klerosUIComponentsSecondaryText">
            My Estimate (%)
          </label>
          <div className="flex">
            <NumberField
              aria-label="Prediction"
              className="w-auto"
              value={prediction / 10}
              onChange={(e) => setPrediction(e * 10)}
            />
            <Button
              text={
                allowance && allowance < 1000000000000000n ? "Allow" : "Predict"
              }
              aria-label="Predict"
              onPress={() => {
                const isUp = prediction > marketEstimate;
                const sellAmount = BigInt(1000000000000000);
                const amount =
                  (BigInt((prediction / 40) * 1000) * sellAmount) /
                  BigInt(1000);
                handlePredict(isUp ? upToken : downToken, amount.toString());
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
            {`${prediction > marketEstimate ? "Higher" : "Lower"} than the market`}
          </label>
        </div>
      </div>
      <Accordion
        aria-label="accordion"
        className="w-full"
        items={[{ title: "Details", body: <p>Hello</p> }]}
      />
    </Card>
  );
};

export default ProjectFunding;
