import React from "react";

import { Accordion, CustomAccordion } from "@kleros/ui-components-library";
import clsx from "clsx";
import { motion } from "framer-motion";

import { useMarketContext } from "@/context/MarketContext";
import { useTradeWallet } from "@/context/TradeWalletContext";

import Details from "./Details";
import PositionValue from "./PositionValue";
import PredictionSlider from "./PredictionSlider";

const ProjectFunding: React.FC = () => {
  const { market } = useMarketContext();
  const { name, color, upToken, downToken, details, underlyingToken } = market;

  const { tradeExecutor } = useTradeWallet();

  return (
    <CustomAccordion
      aria-label="card"
      className={clsx(
        "bg-klerosUIComponentsLightBackground flex h-auto w-full max-w-full flex-col gap-4",
        "hover:shadow-md",
      )}
      items={[
        {
          title: (
            <>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex max-w-full grow basis-[70%] flex-col gap-8 md:min-w-[300px]">
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <h3 className="text-klerosUIComponentsPrimaryText font-semibold">
                      {name}
                    </h3>
                  </div>
                </div>
              </div>
            </>
          ),
          body: (
            <div className="flex w-full flex-col">
              <div className="pt-8 pb-4">
                <PredictionSlider />
              </div>
              {tradeExecutor ? (
                <div className="flex w-full items-center justify-between gap-2">
                  <PositionValue
                    {...{ upToken, downToken, underlyingToken, tradeExecutor }}
                  />
                  {/* <OpenOrders /> */}
                </div>
              ) : null}
              <Accordion
                aria-label="accordion"
                className={clsx(
                  "w-full max-w-full",
                  "[&_#expand-button]:bg-klerosUIComponentsLightBackground [&_#expand-button_p]:font-normal",
                )}
                items={[{ title: "Details", body: <Details {...details} /> }]}
              />
            </div>
          ),
          expandButton: ({ expanded, toggle }) => (
            // hydration error, because of button in button, workaround
            <motion.div
              role="button"
              tabIndex={0}
              onClick={toggle}
              onKeyDown={(e) => e.key === "Enter" && toggle()}
              className={clsx(
                "bg-klerosUIComponentsPrimaryBlue cursor-pointer",
                "rounded-base inline-flex items-center px-6 py-1.5",
                "text-klerosUIComponentsWhiteBackground text-sm font-semibold",
              )}
              whileTap={{ scale: 0.9, y: 1 }}
            >
              {expanded ? "Close" : "Predict"}
            </motion.div>
          ),
        },
      ]}
    />
  );
};

export default ProjectFunding;
