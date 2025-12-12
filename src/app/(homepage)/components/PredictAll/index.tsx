import { Button, Card } from "@kleros/ui-components-library";
import clsx from "clsx";
import { useToggle } from "react-use";

import { usePredictionMarkets } from "@/hooks/usePredictionMarkets";

import EnsureChain from "@/components/EnsureChain";

import { PredictAllPopup } from "./PredictAllPopup";

const PredictAll: React.FC = () => {
  const [isOpen, toggleIsOpen] = useToggle(false);
  const markets = usePredictionMarkets();

  return (
    <Card
      round
      className={clsx(
        "border-gradient-purple-blue h-auto w-full border-none p-4 md:px-8",
        "flex items-start justify-center gap-x-8 gap-y-4",
        "md:flex-row md:items-center md:justify-between",
      )}
    >
      <h3 className="text-klerosUIComponentsPrimaryText text-base font-semibold">
        Predict all the estimates above
      </h3>
      <EnsureChain>
        <Button
          text="Predict All"
          onPress={toggleIsOpen}
          isDisabled={markets.length === 0}
        />
        <PredictAllPopup {...{ isOpen, toggleIsOpen }} />
      </EnsureChain>
    </Card>
  );
};

export default PredictAll;
