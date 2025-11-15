"use client";
import React from "react";

import { Button } from "@kleros/ui-components-library";
import { useToggle } from "react-use";

import { useMarketContext } from "@/context/MarketContext";

import { PredictPopup } from "./PredictPopup";

const PredictButton: React.FC = ({}) => {
  const [isOpen, toggleIsOpen] = useToggle(false);
  const { hasLiquidity } = useMarketContext();
  return (
    <>
      <Button
        text={"Predict"}
        aria-label="Predict Button"
        onPress={toggleIsOpen}
        isDisabled={!hasLiquidity}
      />
      <PredictPopup {...{ isOpen, toggleIsOpen }} />
    </>
  );
};
export default PredictButton;
