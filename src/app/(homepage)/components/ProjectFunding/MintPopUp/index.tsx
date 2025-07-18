import React, { useRef } from "react";

import { Modal } from "@kleros/ui-components-library";

import { useMarketContext } from "@/context/MarketContext";

import SplitButton from "./SplitButton";
import TradeButton from "./TradeButton";

interface IMintPopUp {
  isOpen?: boolean;
  toggleIsOpen?: () => void;
}

const MintPopUp: React.FC<IMintPopUp> = ({ isOpen, toggleIsOpen }) => {
  const {
    isUpPredict,
    percentageIncrease,
    expectedFromMintRoute,
    market,
    // mintSellQuote,
    // mintReBuyQuote,
  } = useMarketContext();
  const { marketId, underlyingToken, upToken, downToken } = market;
  const initialBalanceRef = useRef<bigint | null>(null);

  return (
    <Modal
      className="h-fit w-[500px] p-4"
      isDismissable
      onOpenChange={toggleIsOpen}
      {...{ isOpen }}
    >
      <div className="flex size-full flex-col items-center justify-center gap-4">
        <p className="text-klerosUIComponentsPrimaryText font-semibold">
          {"It's better to mint and sell."}
        </p>
        <div className="flex items-center gap-2">
          <p className="text-klerosUIComponentsPrimaryText">
            Expected Return: {expectedFromMintRoute?.toFixed(2)}{" "}
            {isUpPredict ? "UP" : "DOWN"} tokens
          </p>
          <small className="text-klerosUIComponentsSuccess">
            &#9206; {percentageIncrease}%
          </small>
        </div>
        <SplitButton {...{ marketId, underlyingToken, initialBalanceRef }} />
        {/* if user was initially buying upToken, we need to sell downToken, 
        to obtain underlyingToken to further buy more upToken. Vice versa */}
        <TradeButton
          buyToken={underlyingToken}
          sellToken={isUpPredict ? downToken : upToken}
          // note that we only want to sell the UP/DOWN token received from the split,
          // which is the same as the amount we passed in `splitPosition` (underlying token balance)
          amount={initialBalanceRef.current}
          // quote={mintSellQuote}
        />
        {/* buy the upToken/downToken with the underlyingToken acquired from above trade */}
        <TradeButton
          buyToken={isUpPredict ? upToken : downToken}
          sellToken={underlyingToken}
          // quote={mintReBuyQuote}
        />
      </div>
    </Modal>
  );
};

export default MintPopUp;
