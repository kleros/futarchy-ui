import React from "react";

import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";

import { useMarketsStore } from "@/store/markets";

import { usePredictionMarkets } from "@/hooks/usePredictionMarkets";

import LightButton from "@/components/LightButton";

import CloseIcon from "@/assets/svg/close-icon.svg";
import ArrowDown from "@/assets/svg/long-arrow-down.svg";
import ArrowUp from "@/assets/svg/long-arrow-up.svg";

import { formatWithPrecision, isUndefined } from "@/utils";
import { ScrollFade } from "@/components/ScrollFade";

const Header: React.FC = () => {
  const markets = usePredictionMarkets();
  const removeMarket = useMarketsStore((state) => state.removeMarket);

  return (
    <div
      className={clsx(
        "mb-4 min-h-28 w-full shrink grow-0",
        "flex flex-col items-center gap-4",
      )}
    >
      <h2 className="text-klerosUIComponentsPrimaryText shrink-0 text-2xl font-semibold">
        Predict
      </h2>
      <ScrollFade
        className={clsx("rounded-base w-full shrink", "max-h-40 min-h-18")}
      >
        <div className="flex w-full flex-col gap-0.25">
          <AnimatePresence>
            {markets.map((market) => (
              <motion.div
                className={clsx(
                  "bg-klerosUIComponentsMediumBlue rounded-base relative w-full",
                  "flex flex-col items-center justify-center p-3",
                )}
                key={market.marketId}
                layout
                initial={{ opacity: 0, y: 0, scale: 1 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.5 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex flex-col items-center gap-2 max-sm:items-center sm:flex-row">
                  <div className="space-x-2">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: market.color }}
                    />
                    <span className="text-klerosUIComponentsPrimaryText text-sm font-semibold sm:text-base">
                      {market.name}
                    </span>
                  </div>

                  <div className="space-x-2">
                    <span className="text-klerosUIComponentsPrimaryText text-sm sm:text-base">
                      {/* TODO: Changes per experiment */}
                      Score
                    </span>
                    <span className="text-klerosUIComponentsPrimaryText text-sm font-semibold sm:text-base">
                      {market.prediction
                        ? `${formatWithPrecision(market.prediction, market.precision)}%`
                        : "0%"}
                    </span>
                  </div>
                </div>
                {!isUndefined(market?.prediction) &&
                !isUndefined(market?.marketEstimate) ? (
                  <label
                    className={clsx(
                      "text-xs sm:text-sm",
                      market.prediction > market.marketEstimate
                        ? "text-green-2"
                        : "text-red-2",
                    )}
                  >
                    {market.prediction > market.marketEstimate ? (
                      <ArrowUp className="[&_path]:fill-green-2 mr-1 inline size-3" />
                    ) : (
                      <ArrowDown className="[&_path]:fill-red-2 mr-1 inline size-3" />
                    )}
                    {`${market.prediction > market.marketEstimate ? "Higher" : "Lower"} than the market`}
                  </label>
                ) : null}
                {markets.length > 1 ? (
                  <LightButton
                    className="absolute top-1/2 right-2 -translate-y-1/2 p-1"
                    text=""
                    icon={
                      <CloseIcon className="[&_path]:stroke-klerosUIComponentsSecondaryText size-3" />
                    }
                    onPress={() => removeMarket(market.marketId)}
                  />
                ) : null}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollFade>
    </div>
  );
};

export default Header;
