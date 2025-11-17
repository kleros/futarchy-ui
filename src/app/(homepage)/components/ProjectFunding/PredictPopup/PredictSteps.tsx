import React, { useMemo } from "react";

import { CustomTimeline } from "@kleros/ui-components-library";
import clsx from "clsx";
import { Address } from "viem";

import CheckOutline from "@/assets/svg/check-outline.svg";
import CircleOutline from "@/assets/svg/circle-outline.svg";
import CloseOutline from "@/assets/svg/close-circle.svg";

import { formatValue, isUndefined, shortenAddress } from "@/utils";

import Spinner from "./Spinner";

type TimelineItem = React.ComponentProps<
  typeof CustomTimeline
>["items"][number];

interface IPredictSteps {
  tradeExecutor?: Address;
  toBeAdded: bigint;
  isCreatingWallet: boolean;
  isAddingCollateral: boolean;
  isCollateralAdded: boolean;
  isProcessingMarkets: boolean;
  isLoadingQuotes: boolean;
  isMakingPrediction: boolean;
  isPredictionSuccessful: boolean;
  error?: string;
}

const PredictSteps: React.FC<IPredictSteps> = ({
  tradeExecutor,
  toBeAdded,
  isCreatingWallet,
  isAddingCollateral,
  isCollateralAdded,
  isProcessingMarkets,
  isLoadingQuotes,
  isMakingPrediction,
  isPredictionSuccessful,
  error,
}) => {
  const predictionProgressText = useMemo(() => {
    if (isMakingPrediction) return "Making prediction...";
    if (isLoadingQuotes) return "Loading Quotes...";
    if (isProcessingMarkets) return "Processing markets...";
    if (isPredictionSuccessful) return "Prediction Successful!";
    return "";
  }, [
    isMakingPrediction,
    isLoadingQuotes,
    isProcessingMarkets,
    isPredictionSuccessful,
  ]);

  // these will change based on actions
  const items = useMemo(() => {
    const steps: TimelineItem[] = [];

    if (tradeExecutor) {
      steps.push({
        title: "Trade Wallet",
        party: "",
        subtitle: shortenAddress(tradeExecutor),
        Icon: CheckOutline,
        state: error ? "disabled" : undefined,
      });
    } else {
      steps.push({
        title: "Create a Trade Wallet",
        party: isCreatingWallet ? <Spinner /> : "",
        subtitle: "",
        state: isCreatingWallet ? "loading" : undefined,
        Icon: CircleOutline,
      });
    }

    steps.push({
      title: "Add Collateral to wallet",
      party: isAddingCollateral ? <Spinner /> : "",
      subtitle: `Adding ${formatValue(toBeAdded)} sDAI`,
      Icon: isCollateralAdded ? CheckOutline : CircleOutline,
      state: isAddingCollateral
        ? "loading"
        : error || toBeAdded === 0n
          ? "disabled"
          : undefined,
    });

    steps.push({
      title: "Make Prediction",
      party:
        isMakingPrediction || isLoadingQuotes || isProcessingMarkets ? (
          <Spinner />
        ) : (
          ""
        ),
      subtitle: predictionProgressText,
      Icon: isPredictionSuccessful ? CheckOutline : CircleOutline,
      state:
        isMakingPrediction || isLoadingQuotes || isProcessingMarkets
          ? "loading"
          : error
            ? "disabled"
            : undefined,
    });

    if (!isUndefined(error)) {
      steps.push({
        title: "Prediction failed!",
        subtitle: error,
        variant: "#ca2314",
        party: "",
        Icon: CloseOutline,
      });
    }
    return steps as [TimelineItem, ...TimelineItem[]];
  }, [
    tradeExecutor,
    isCreatingWallet,
    isAddingCollateral,
    isCollateralAdded,
    toBeAdded,
    isMakingPrediction,
    isPredictionSuccessful,
    predictionProgressText,
    isProcessingMarkets,
    isLoadingQuotes,
    error,
  ]);

  return (
    <div className="mt-8 flex flex-col items-center">
      <CustomTimeline
        items={items}
        className={clsx(
          "[&_li>div:nth-child(1)]:min-h-14",
          "[&_li>div:nth-child(2)]:ml-2 [&_li>div:nth-child(2)]:pt-0.5",
          "[&_li>div:nth-child(1)>div]:border-l-klerosUIComponentsPrimaryBlue [&_li>div:nth-child(1)>div]:my-2",
        )}
      />
    </div>
  );
};

export default PredictSteps;
