import { useMemo } from "react";

import { BigNumberField } from "@kleros/ui-components-library";
import clsx from "clsx";
import { parseUnits, formatUnits } from "viem";

import LightButton from "@/components/LightButton";

import { formatValue, isUndefined } from "@/utils";

interface IAmountInput {
  setAmount: (amount: bigint) => void;
  defaultValue?: bigint;
  value?: bigint;
  balance?: bigint;
  isMerge?: boolean;
}

const AmountInput: React.FC<IAmountInput> = ({
  setAmount,
  defaultValue,
  value,
  balance,
  isMerge = false,
}) => {
  const notEnoughBalance = useMemo(() => {
    if (isMerge) return false;
    if (!isUndefined(value) && !isUndefined(balance) && value > balance)
      return true;
    return false;
  }, [value, balance, isMerge]);

  const handleMaxClick = () => {
    if (!isUndefined(balance)) {
      setAmount(balance);
    }
  };

  return (
    <div className="relative mb-8">
      <div className="border-klerosUIComponentsStroke rounded-base flex h-fit flex-row border">
        <BigNumberField
          className={clsx(
            "inline-block w-96",
            "[&_input]:rounded-r-none [&_input]:border-none [&_input]:focus:shadow-none",
          )}
          onChange={(e) => {
            setAmount(parseUnits(e.toString(), 18));
          }}
          minValue={"0"}
          variant={notEnoughBalance ? "error" : undefined}
          defaultValue={
            typeof defaultValue !== "undefined"
              ? formatUnits(defaultValue, 18)
              : undefined
          }
          value={
            typeof value !== "undefined" ? formatUnits(value, 18) : undefined
          }
          isDisabled={isMerge}
        />
      </div>
      <span className="text-light-mode-red-2 absolute text-sm">
        {notEnoughBalance ? "Not enough balance." : undefined}
      </span>
      {!notEnoughBalance && (
        <span className="text-klerosUIComponentsSecondaryText absolute pt-1 text-sm">
          {!isUndefined(balance)
            ? `Available: ${formatValue(balance)}`
            : "Loading..."}
        </span>
      )}
      {isMerge ? null : (
        <LightButton
          small
          text="Max"
          onPress={handleMaxClick}
          className={clsx(
            "absolute -right-1 mt-1 px-1 py-0.5",
            "[&_.button-text]:text-klerosUIComponentsSecondaryText [&_.button-text]:text-sm",
          )}
        />
      )}
    </div>
  );
};
export default AmountInput;
