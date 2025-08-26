import React from "react";

import { Card, Accordion, NumberField } from "@kleros/ui-components-library";
import clsx from "clsx";

import { useCardInteraction } from "@/context/CardInteractionContext";
import { useMarketContext } from "@/context/MarketContext";

import { isUndefined } from "@/utils";

import Details from "./Details";
import PositionValue from "./PositionValue";
import PredictButton from "./PredictButton";
import PredictionSlider from "./PredictionSlider";

const ProjectFunding: React.FC = ({}) => {
  const { setActiveCardId } = useCardInteraction();
  const {
    isUpPredict,
    market,
    prediction,
    setPrediction,
    showEstimateVariant,
  } = useMarketContext();
  const {
    name,
    color,
    upToken,
    downToken,
    precision,
    details,
    marketId,
    underlyingToken,
  } = market;

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
              value={
                !isUndefined(prediction) ? prediction / precision : undefined
              }
              onChange={(e) => setPrediction(e * precision)}
            />
            <PredictButton />
          </div>
          <label
            className={clsx(
              isUpPredict ? "text-light-mode-green-2" : "text-light-mode-red-2",
              showEstimateVariant ? "visible" : "invisible",
            )}
          >
            {`${isUpPredict ? "↑ Higher" : "↓ Lower"} than the market`}
          </label>
        </div>
      </div>
      <div className="flex w-full flex-col">
        <div className="flex gap-2">
          <PositionValue {...{ upToken, downToken, underlyingToken }} />
          {/* <OpenOrders /> */}
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
    </Card>
  );
};

export default ProjectFunding;
