import React from "react";

import { Accordion, CustomAccordion } from "@kleros/ui-components-library";
import clsx from "clsx";

import { useMarketsStore } from "@/store/markets";

import { useMarketContext } from "@/context/MarketContext";
import { useTradeWallet } from "@/context/TradeWalletContext";
import { useTokenPositionValue } from "@/hooks/useTokenPositionValue";

import CheckOutline from "@/assets/svg/check-outline-button.svg";
import MinusOutline from "@/assets/svg/minus-outline.svg";

import Details from "./Details";
import PositionValue from "./PositionValue";
import PredictionSlider from "./PredictionSlider";

const ProjectFunding: React.FC = () => {
  const { market } = useMarketContext();
  const { name, color, upToken, downToken, details, underlyingToken } = market;
  const isSelected = useMarketsStore((s) => {
    const m = s.markets[market.marketId];
    return !!m?.prediction && m.prediction !== m.marketEstimate;
  });
  const { tradeExecutor } = useTradeWallet();

  const { value: upValue } = useTokenPositionValue(
    upToken,
    underlyingToken,
    tradeExecutor ?? "0x",
    {
      isUp: true,
    },
  );
  const { value: downValue } = useTokenPositionValue(
    downToken,
    underlyingToken,
    tradeExecutor ?? "0x",
    {
      isUp: false,
    },
  );
  const totalValue = upValue + downValue;
  return (
    <CustomAccordion
      aria-label="card"
      className={clsx(
        "bg-klerosUIComponentsLightBackground flex h-auto w-full max-w-full flex-col gap-4",
        "hover:shadow-md [&>div]:my-0",
      )}
      items={[
        {
          title: (
            <>
              <div className="flex flex-1 flex-wrap items-center justify-between gap-4">
                <div className="flex max-w-full grow basis-[70%] flex-wrap gap-2 md:min-w-[300px]">
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <h3 className="text-klerosUIComponentsPrimaryText text-left font-semibold">
                      {name}
                    </h3>
                  </div>
                  {totalValue > 0 ? (
                    <div className="flex items-center gap-2">
                      <div className="border-klerosUIComponentsPrimaryText h-4 w-0 border-[0.5px] max-md:hidden" />

                      <p className="text-klerosUIComponentsPrimaryText justify-center text-sm">
                        Position:
                        <span className="font-bold">
                          {" "}
                          {totalValue.toFixed(2)}${" "}
                        </span>
                      </p>
                    </div>
                  ) : null}
                </div>
                {isSelected ? (
                  <CheckOutline className="[&_path]:fill-klerosUIComponentsSuccess animate-fade-in size-4" />
                ) : (
                  <MinusOutline className="size-4" />
                )}
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
        },
      ]}
    />
  );
};

export default ProjectFunding;
