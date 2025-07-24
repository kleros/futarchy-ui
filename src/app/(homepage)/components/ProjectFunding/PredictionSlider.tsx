import { useMemo } from "react";

import { useTheme } from "next-themes";

import { Slider } from "@kleros/ui-components-library";
import clsx from "clsx";
import { useSize } from "react-use";

import { useMarketContext } from "@/context/MarketContext";

import { isUndefined } from "@/utils";

const PredictionSlider: React.FC = () => {
  const { theme } = useTheme();
  const {
    isUpPredict,
    upPrice: marketPrice,
    prediction,
    setPrediction,
    marketEstimate,
    market,
    isLoadingMarketQuote,
  } = useMarketContext();
  const { maxValue, minValue, precision, color } = market;

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
          transform: `translateX(calc(${!isUndefined(marketPrice) ? marketPrice * width : 0}px - 50%))`,
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
          className={clsx(
            "rounded-base text-klerosUIComponentsLightBackground px-2 py-0.75 text-center text-xs",
            isLoadingMarketQuote && "animate-pulse",
          )}
          style={{ backgroundColor: color }}
        >
          {`${(marketEstimate / precision).toFixed(2)}`}
        </div>
        <span className="bg-klerosUIComponentsPrimaryText mx-auto block h-9 w-0.75 rounded-b-full" />
      </div>
    </div>
  ));

  return sized;
};

export default PredictionSlider;
