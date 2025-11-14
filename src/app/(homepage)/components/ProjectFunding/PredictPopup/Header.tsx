import React from "react";

import clsx from "clsx";

import { useMarketContext } from "@/context/MarketContext";

import ArrowDown from "@/assets/svg/long-arrow-down.svg";
import ArrowUp from "@/assets/svg/long-arrow-up.svg";

const Header: React.FC = () => {
  const { market, prediction, isUpPredict } = useMarketContext();

  return (
    <div className="mb-4 flex w-full flex-col items-center gap-4">
      <h2 className="text-klerosUIComponentsPrimaryText text-2xl font-semibold">
        Predict
      </h2>
      <div
        className={clsx(
          "bg-klerosUIComponentsMediumBlue rounded-base w-full",
          "flex flex-col items-center justify-center p-3",
        )}
      >
        <div className="flex items-center gap-2">
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: market.color }}
          />
          <span className="text-klerosUIComponentsPrimaryText text-base font-semibold">
            {market.name}
          </span>
          <span className="text-klerosUIComponentsPrimaryText text-base">
            Score
          </span>
          <span className="text-klerosUIComponentsPrimaryText text-base font-semibold">
            {prediction}
          </span>
        </div>
        <label
          className={clsx(
            "text-sm",
            isUpPredict ? "text-green-2" : "text-red-2",
          )}
        >
          {isUpPredict ? (
            <ArrowUp className="mr-1 inline size-3" />
          ) : (
            <ArrowDown className="mr-1 inline size-3" />
          )}
          {`${isUpPredict ? "Higher" : "Lower"} than the market`}
        </label>
      </div>
    </div>
  );
};

export default Header;
