import React from "react";

import clsx from "clsx";

import { usePredictionMarkets } from "@/hooks/usePredictionMarkets";

import ArrowDown from "@/assets/svg/long-arrow-down.svg";
import ArrowUp from "@/assets/svg/long-arrow-up.svg";

import { isUndefined } from "@/utils";

const Header: React.FC = () => {
  const markets = usePredictionMarkets();
  console.log({ markets });

  return (
    <div className="mb-4 flex w-full flex-col items-center gap-4">
      <h2 className="text-klerosUIComponentsPrimaryText text-2xl font-semibold">
        Predict
      </h2>
      <div
        className={clsx(
          "rounded-base flex w-full flex-col gap-0.25",
          "scroll-shadows max-h-58 overflow-hidden overflow-y-scroll",
        )}
      >
        {markets.map((market) => (
          <div
            className={clsx(
              "bg-klerosUIComponentsMediumBlue rounded-base w-full",
              "flex flex-col items-center justify-center p-3",
            )}
            key={market.marketId}
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
                {market.prediction}
              </span>
            </div>
            {!isUndefined(market?.prediction) &&
            !isUndefined(market?.marketEstimate) ? (
              <label
                className={clsx(
                  "text-sm",
                  market.prediction > market.marketEstimate
                    ? "text-green-2"
                    : "text-red-2",
                )}
              >
                {market.prediction > market.marketEstimate ? (
                  <ArrowUp className="mr-1 inline size-3" />
                ) : (
                  <ArrowDown className="mr-1 inline size-3" />
                )}
                {`${market.prediction > market.marketEstimate ? "Higher" : "Lower"} than the market`}
              </label>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Header;
