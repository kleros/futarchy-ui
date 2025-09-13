import { useRef, useState } from "react";

import { Button, Steps } from "@kleros/ui-components-library";
import clsx from "clsx";

import { useMarketContext } from "@/context/MarketContext";

import SplitButton from "./ActionButtons/SplitButton";
import TradeButton from "./ActionButtons/TradeButton";

enum Step {
  Mint,
  Sell,
  Buy,
}

interface IMintSellSteps {
  close: () => void;
  toggleIsOpen: () => void;
}
const MintSellSteps: React.FC<IMintSellSteps> = ({ close, toggleIsOpen }) => {
  const [currentStep, setCurrentStep] = useState(Step.Mint);
  const initialBalanceRef = useRef<bigint | null>(null);
  const {
    expectedFromMintRoute,
    isUpPredict,
    market,
    mintReBuyQuote,
    mintSellQuote,
    refetchQuotes,
  } = useMarketContext();
  const { marketId, underlyingToken, downToken, upToken } = market;

  const steps = [
    {
      title: "Mint",
      subitems: ["Approve in gnosisRouter", "Split position"],
    },

    {
      title: "Sell",
      subitems: [
        "Approve token counter in Swapr",
        "Sell token counter to position",
      ],
    },
    {
      title: "Buy",
    },
  ];
  const tokenSymbol = isUpPredict ? "UP" : "DOWN";
  return (
    <div
      className={clsx(
        "animate-slide-in-right size-full",
        "flex flex-col items-center gap-6",
        "w-162.5 max-w-full",
      )}
    >
      <h2 className="text-klerosUIComponentsPrimaryText text-2xl font-semibold">
        Mint, sell, and buy.
      </h2>
      <div
        className={clsx(
          "rounded-base bg-klerosUIComponentsMediumBlue mb-2 w-full pt-3.75 pb-4.5",
          "flex items-center justify-center",
        )}
      >
        <p className="text-klerosUIComponentsPrimaryText text-center text-xs">
          Expected Return: {expectedFromMintRoute?.toFixed(2)} {tokenSymbol}{" "}
          tokens
        </p>
      </div>
      <Steps
        className="mb-4 min-h-42 w-auto"
        currentItemIndex={currentStep}
        items={steps}
      />
      <div className="flex gap-[13.5px]">
        <Button text="Back" variant="secondary" onPress={close} />
        {currentStep === Step.Mint && (
          <SplitButton
            {...{ marketId, underlyingToken, initialBalanceRef }}
            setNextStep={() => setCurrentStep(Step.Sell)}
          />
        )}
        {currentStep === Step.Sell && (
          // if user was initially buying upToken, we need to sell downToken,
          // to obtain underlyingToken to further buy more upToken. Vice versa
          <TradeButton
            sellToken={isUpPredict ? downToken : upToken}
            quote={mintSellQuote}
            setNextStep={() => setCurrentStep(Step.Buy)}
          />
        )}
        {currentStep === Step.Buy && (
          // buy the upToken/downToken with the underlyingToken acquired from above trade
          <TradeButton
            sellToken={underlyingToken}
            quote={mintReBuyQuote}
            setNextStep={() => {
              refetchQuotes();
              close();
              toggleIsOpen();
            }}
          />
        )}
      </div>
    </div>
  );
};
export default MintSellSteps;
