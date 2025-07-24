import React, { useCallback, useMemo } from "react";

import {
  Card,
  Accordion,
  NumberField,
  Button,
} from "@kleros/ui-components-library";
import { waitForTransactionReceipt, sendTransaction } from "@wagmi/core";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { useToggle } from "react-use";
import { useConfig, useAccount } from "wagmi";

import { useWriteErc20Approve } from "@/generated";

import { useCardInteraction } from "@/context/CardInteractionContext";
import { useMarketContext } from "@/context/MarketContext";
import { useAllowance } from "@/hooks/useAllowance";
import { useBalance } from "@/hooks/useBalance";

import { Skeleton } from "@/components/Skeleton";

import { isUndefined } from "@/utils";

import Details from "./Details";
import MintPopUp from "./MintPopUp";
import OpenOrders from "./OpenOrders";
import PositionValue from "./PositionValue";

const PredictionSlider = dynamic(() => import("./PredictionSlider"), {
  ssr: false,
  loading: () => <Skeleton className="h-16 w-full" />,
});
const ProjectFunding: React.FC = ({}) => {
  const { setActiveCardId } = useCardInteraction();
  const {
    upPrice,
    marketQuote,
    marketDownQuote,
    isUpPredict,
    differenceBetweenRoutes,
    market,
    prediction,
    setPrediction,
  } = useMarketContext();
  const {
    name,
    color,
    upToken,
    downToken,
    underlyingToken,
    precision,
    details,
    marketId,
  } = market;

  const wagmiConfig = useConfig();
  const { address } = useAccount();
  const [userInteracting, toggleUserInteracting] = useToggle(false);
  const [isPopUpOpen, toggleIsPopUpOpen] = useToggle(false);

  const { data: allowance, refetch: refetchAllowance } =
    useAllowance(underlyingToken);

  const { data: underlyingBalance, refetch: refetchBalance } =
    useBalance(underlyingToken);

  const isAllowance = useMemo(
    () =>
      typeof allowance !== "undefined" &&
      typeof underlyingBalance !== "undefined" &&
      allowance < underlyingBalance,
    [allowance, underlyingBalance],
  );

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
    const hash = await sendTransaction(wagmiConfig, {
      to: tx!.to as `0x${string}`,
      data: tx!.data!.toString() as `0x${string}`,
      value: BigInt(tx?.value?.toString() || 0),
    });
    await waitForTransactionReceipt(wagmiConfig, { hash, confirmations: 2 });
    refetchBalance();
  }, [
    address,
    marketQuote,
    marketDownQuote,
    wagmiConfig,
    isUpPredict,
    refetchBalance,
  ]);

  return (
    <Card
      aria-label="card"
      className={clsx(
        "bg-klerosUIComponentsLightBackground flex h-auto w-full flex-col gap-4 px-4 py-6 md:px-8",
        "hover:shadow-md",
      )}
      onClick={() => setActiveCardId(marketId)}
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
          <div className="px-4">
            <PredictionSlider />
          </div>
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
                isUndefined(address) ||
                isUndefined(underlyingBalance) ||
                underlyingBalance === 0n ||
                isUndefined(allowance) ||
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
                  if (differenceBetweenRoutes > 0) {
                    toggleIsPopUpOpen(true);
                  } else if (isAllowance) {
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
              isUpPredict ? "text-light-mode-green-2" : "text-light-mode-red-2",
            )}
          >
            {`${isUpPredict ? "↑ Higher" : "↓ Lower"} than the market`}
          </label>
        </div>
      </div>
      <div className="flex w-full flex-col">
        <div className="flex gap-2">
          <PositionValue
            {...{ upToken, downToken }}
            marketPrice={upPrice ?? 0}
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
      <MintPopUp isOpen={isPopUpOpen} toggleIsOpen={toggleIsPopUpOpen} />
    </Card>
  );
};

export default ProjectFunding;
