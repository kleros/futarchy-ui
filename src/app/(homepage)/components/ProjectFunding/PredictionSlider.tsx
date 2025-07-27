"use client";

import { useMemo } from "react";

import { useTheme } from "next-themes";

import { Slider } from "@kleros/ui-components-library";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { useSize } from "react-use";

import { useMarketContext } from "@/context/MarketContext";

import { Skeleton } from "@/components/Skeleton";

import { isUndefined } from "@/utils";

const PredictionSliderContent: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const {
    isUpPredict,
    marketPrice,
    prediction,
    setPrediction,
    marketEstimate,
    market,
    isLoadingMarketPrice,
  } = useMarketContext();
  const { maxValue, minValue, precision, color } = market;

  const sliderTheme = useMemo(() => {
    if (resolvedTheme === "light") return isUpPredict ? "#3FEC65" : "#F75C7B";
    else return isUpPredict ? "#D2FFDC" : "#FFD2DB";
  }, [resolvedTheme, isUpPredict]);

  const [sized] = useSize(
    ({ width }) => (
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
            transform: `translateX(calc(${!isUndefined(marketPrice) && width ? marketPrice * width : 0}px - 50%))`,
          }}
        >
          <label className="text-klerosUIComponentsPrimaryText block w-full text-center text-xs">
            Market
          </label>
          <div
            className={clsx(
              "rounded-base text-klerosUIComponentsLightBackground px-2 py-0.75 text-center text-xs",
              isLoadingMarketPrice && "animate-pulse",
            )}
            style={{ backgroundColor: color }}
          >
            {`${(marketEstimate / precision).toFixed(2)}`}
          </div>
          <span className="bg-klerosUIComponentsPrimaryText mx-auto block h-9 w-0.75 rounded-b-full" />
        </div>
      </div>
    ),
    { width: 300 },
  );

  return sized;
};

const PredictionSlider = dynamic(
  () => Promise.resolve(PredictionSliderContent),
  {
    ssr: false,
    loading: () => (
      <div className="relative w-full">
        <Skeleton className="h-2 w-full rounded-[30px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3">
          <Skeleton className="h-[22px] w-[42px]" />
          <Skeleton
            className="mx-auto h-9 w-0.75 rounded-b-full"
            variant="secondary"
          />
        </div>
      </div>
    ),
  },
);

export default PredictionSlider;
