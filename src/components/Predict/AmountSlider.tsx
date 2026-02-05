import React, { useMemo } from "react";

import { Slider } from "@kleros/ui-components-library";
import clsx from "clsx";

interface IAmountSlider {
  value: bigint;
  setValue: (val: bigint) => void;
  balance: bigint;
}
const AmountSlider: React.FC<IAmountSlider> = ({
  value,
  setValue,
  balance,
}) => {
  const percentValue = useMemo(() => {
    if (balance === 0n) return 0;
    return Number((value * 100n) / balance);
  }, [value, balance]);

  const callback = (percent: number) => {
    const newValue = (balance * BigInt(percent)) / 100n;
    setValue(newValue);
  };

  return (
    <div className="relative mx-4 mt-4 w-[calc(100%-16px)]">
      <Slider
        className={clsx(
          "relative z-1",
          "[&_#slider-fill]:h-1 [&_#slider-track]:h-1",
          "[&_#slider-label]:text-klerosUIComponentsPrimaryText! [&_#slider-label]:font-semibold",
        )}
        minValue={0}
        maxValue={100}
        value={percentValue}
        leftLabel=""
        rightLabel=""
        aria-label="Slider"
        callback={callback}
        formatter={(value) => `${value}%`}
      />

      {/* Decorative circles */}
      <div
        className={clsx(
          "absolute top-1/2 left-0 z-0 -translate-y-full",
          "pointer-events-none flex w-full justify-between",
        )}
      >
        {[0, 25, 50, 75, 100].map((percent, i) => (
          <span
            key={i}
            className={clsx(
              "block h-2 w-2 rounded-full",
              percent < percentValue || percent == 0
                ? "invisible"
                : "bg-klerosUIComponentsStroke",
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default AmountSlider;
