import { useState } from "react";

import { Modal } from "@kleros/ui-components-library";

import LightButton from "@/components/LightButton";

import CloseIcon from "@/assets/svg/close-icon.svg";

import DefaultPredict from "./DefaultPredict";
import MintSell from "./MintSell";
import MintSellSteps from "./MintSellSteps";

export enum Route {
  Default,
  MintSell,
}
interface IPredictPopup {
  isOpen?: boolean;
  toggleIsOpen: () => void;
}
const PredictPopup: React.FC<IPredictPopup> = ({ isOpen, toggleIsOpen }) => {
  const [selectedRoute, setSelectedRoute] = useState<Route>();
  const [isMinting, setIsMinting] = useState(false);
  return (
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
      {isMinting ? (
        <MintSellSteps
          close={() => setIsMinting(false)}
          {...{ toggleIsOpen }}
        />
      ) : (
        <div className="flex size-full flex-col gap-6">
          <div className="flex w-full flex-col items-center gap-2">
            <h2 className="text-klerosUIComponentsPrimaryText text-2xl font-semibold">
              Predict
            </h2>
            <p className="text-klerosUIComponentsPrimaryText text-sm">
              Choose between the default or enhanced option below:
            </p>
          </div>
          <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2">
            <DefaultPredict
              isSelected={selectedRoute === Route.Default}
              setIsSelected={setSelectedRoute}
              {...{ toggleIsOpen }}
            />
            <MintSell
              isSelected={selectedRoute === Route.MintSell}
              setIsSelected={setSelectedRoute}
              setIsMintScreen={setIsMinting}
            />
          </div>
        </div>
      )}
    </Modal>
  );
};

export default PredictPopup;
