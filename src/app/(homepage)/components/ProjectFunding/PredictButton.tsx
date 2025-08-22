import React from "react";
import { useMemo } from "react";

import { Button, Modal } from "@kleros/ui-components-library";
import { useToggle } from "react-use";
import { formatUnits } from "viem";

import { useCardInteraction } from "@/context/CardInteractionContext";
import { useMarketContext } from "@/context/MarketContext";
import { useBalance } from "@/hooks/useBalance";
import { useMarketQuote } from "@/hooks/useMarketQuote";

import LightButton from "@/components/LightButton";

import CloseIcon from "@/assets/svg/close-icon.svg";

import { isUndefined } from "@/utils";

import DefaultPredictButton from "./PredictPopup/ActionButtons/DefaultPredictButton";
import TradeButton from "./PredictPopup/ActionButtons/TradeButton";

import PredictPopup from "./PredictPopup";

const PredictButton: React.FC = () => {
  const [isOpen, toggleIsOpen] = useToggle(false);
  const [isPopUpOpen, toggleIsPopUpOpen] = useToggle(false);

  const { setActiveCardId } = useCardInteraction();

  const {
    market,
    isUpPredict,
    differenceBetweenRoutes,
    isLoading: isLoadingComplexRoute,
    refetchQuotes,
  } = useMarketContext();

  const { upToken, downToken, underlyingToken, marketId } = market;

  const { data: underlyingBalance } = useBalance(underlyingToken);
  const { data: upBalance } = useBalance(upToken);
  const { data: downBalance } = useBalance(downToken);

  const needsSelling = useMemo(
    () =>
      isUpPredict
        ? !isUndefined(downBalance) && downBalance > 0
        : !isUndefined(upBalance) && upBalance > 0,
    [isUpPredict, downBalance, upBalance],
  );

  const sellToken = isUpPredict ? downToken : upToken;
  const sellTokenBalance = isUpPredict ? downBalance : upBalance;
  const { data: sellQuote } = useMarketQuote(
    underlyingToken,
    sellToken,
    sellTokenBalance ? formatUnits(sellTokenBalance, 18) : "1",
  );

  // if no previous position, carry with the default behaviour
  if (!needsSelling)
    return (
      <>
        {differenceBetweenRoutes > 0 ? (
          <Button
            text={"Predict"}
            aria-label="Predict Button"
            isDisabled={
              isUndefined(underlyingBalance) ||
              underlyingBalance === 0n ||
              isLoadingComplexRoute
            }
            isLoading={isLoadingComplexRoute}
            onPress={async () => {
              setActiveCardId(marketId);
              toggleIsPopUpOpen();
            }}
          />
        ) : (
          <DefaultPredictButton />
        )}
        <PredictPopup isOpen={isPopUpOpen} toggleIsOpen={toggleIsPopUpOpen} />
      </>
    );

  // if previous prediction present, liquidate that to set a new prediction
  return (
    <>
      <Button text="Predict" onPress={toggleIsOpen} />
      <Modal
        className="relative h-fit w-max overflow-x-hidden p-6 py-8"
        onOpenChange={toggleIsOpen}
        {...{ isOpen }}
      >
        <LightButton
          className="absolute top-4 right-4 p-1"
          text=""
          icon={
            <CloseIcon className="[&_path]:stroke-klerosUIComponentsSecondaryText size-4" />
          }
          onPress={toggleIsOpen}
        />
        <div className="flex size-full flex-col items-center justify-center gap-4 pt-2">
          <p className="text-klerosUIComponentsPrimaryText text-center">
            You have a previous prediction with {isUpPredict ? "DOWN" : "UP"}{" "}
            tokens, <br />
            Sell those tokens to make a new prediction.
          </p>
          <TradeButton
            quote={sellQuote}
            sellToken={sellToken}
            setNextStep={() => {
              toggleIsOpen();
              refetchQuotes();
            }}
          />
        </div>
      </Modal>
    </>
  );
};
export default PredictButton;
