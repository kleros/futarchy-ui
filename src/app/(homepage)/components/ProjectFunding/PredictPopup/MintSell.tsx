import { Button, Card } from "@kleros/ui-components-library";
import clsx from "clsx";

import { useMarketContext } from "@/context/MarketContext";

import SkeletonCard from "./SkeletonCard";

import { Route } from ".";

interface IMintSell {
  isSelected: boolean;
  setIsSelected: (val: Route) => void;
  setIsMintScreen: (val: boolean) => void;
}

const MintSell: React.FC<IMintSell> = ({
  isSelected,
  setIsSelected,
  setIsMintScreen,
}) => {
  const {
    isUpPredict,
    expectedFromMintRoute,
    isLoading,
    percentageIncrease,
    differenceBetweenRoutes,
  } = useMarketContext();

  const tokenSymbol = isUpPredict ? "UP" : "DOWN";

  if (isLoading) {
    return <SkeletonCard />;
  }
  return (
    <Card
      className={clsx(
        "min-h-66 min-w-73.25",
        "flex h-full flex-col items-center justify-between gap-4 px-4 py-6",
        "hover:shadow-md",
        isSelected && "border-klerosUIComponentsSecondaryBlue shadow-md",
      )}
      hover
      onClick={() => setIsSelected(Route.MintSell)}
    >
      <div className="flex w-full flex-col items-center">
        <h2 className="text-klerosUIComponentsPrimaryText text-base font-semibold">
          Mint and Sell
        </h2>
        <p className="text-klerosUIComponentsSecondaryText text-center text-xs">
          Mint UP and DOWN Tokens, Sell {isUpPredict ? "DOWN" : "UP"} tokens,
          and buy more {tokenSymbol} Tokens.
        </p>
      </div>
      <div className="flex w-full flex-col items-center gap-4">
        <div className="flex w-full flex-col gap-2">
          <div
            className={clsx(
              "rounded-base bg-klerosUIComponentsMediumBlue w-full pt-3.75 pb-4.5",
              "flex items-center justify-center",
            )}
          >
            <p className="text-klerosUIComponentsPrimaryText text-center text-xs">
              Expected Return: {expectedFromMintRoute?.toFixed(2)} {tokenSymbol}{" "}
              tokens
            </p>
            <small
              className={clsx(
                "text-xs",
                differenceBetweenRoutes >= 0
                  ? "text-klerosUIComponentsSuccess"
                  : "text-klerosUIComponentsError",
              )}
            >
              &nbsp;
              {differenceBetweenRoutes > 0 && <>&#9206;</>}
              {differenceBetweenRoutes < 0 && <>&#9660;</>} {percentageIncrease}
              %
            </small>
          </div>
          <p className="text-klerosUIComponentsSecondaryText w-full text-center text-xs">
            6 steps required
          </p>
        </div>
        <Button text="Mint" onPress={() => setIsMintScreen(true)} />
      </div>
    </Card>
  );
};
export default MintSell;
