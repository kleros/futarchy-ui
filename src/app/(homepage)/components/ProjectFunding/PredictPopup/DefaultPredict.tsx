import { Card } from "@kleros/ui-components-library";
import clsx from "clsx";

import { useMarketContext } from "@/context/MarketContext";

import DefaultPredictButton from "./ActionButtons/DefaultPredictButton";

import SkeletonCard from "./SkeletonCard";

import { Route } from ".";

interface IDefaultPredict {
  isSelected: boolean;
  setIsSelected: (val: Route) => void;
  toggleIsOpen: () => void;
}
const DefaultPredict: React.FC<IDefaultPredict> = ({
  isSelected,
  setIsSelected,
  toggleIsOpen,
}) => {
  const { isUpPredict, expectedFromDefaultRoute, isLoading } =
    useMarketContext();

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
      onClick={() => setIsSelected(Route.Default)}
    >
      <div className="flex w-full flex-col items-center">
        <h2 className="text-klerosUIComponentsPrimaryText text-base font-semibold">
          Default
        </h2>
        <p className="text-klerosUIComponentsSecondaryText text-xs">
          Buy {tokenSymbol} Tokens.
        </p>
      </div>
      <div className="flex w-full flex-col items-center gap-4 self-end">
        <div className="flex w-full flex-col gap-2">
          <div
            className={clsx(
              "rounded-base bg-klerosUIComponentsMediumBlue w-full pt-3.75 pb-4.5",
              "flex items-center justify-center",
            )}
          >
            <p className="text-klerosUIComponentsPrimaryText text-xs">
              Expected Return: {expectedFromDefaultRoute?.toFixed(2)}{" "}
              {tokenSymbol} tokens
            </p>
          </div>
          <p className="text-klerosUIComponentsSecondaryText w-full text-center text-xs">
            2 steps required
          </p>
        </div>
        <DefaultPredictButton {...{ toggleIsOpen }} />
      </div>
    </Card>
  );
};
export default DefaultPredict;
