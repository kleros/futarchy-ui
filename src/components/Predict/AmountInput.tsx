import { useMemo } from "react";

import { BigNumberField, DropdownSelect } from "@kleros/ui-components-library";
import clsx from "clsx";
import { parseUnits, formatUnits } from "viem";

import { cn, formatValue, isUndefined } from "@/utils";

import { Tokens, TokenType } from "@/consts/tokens";

import LightButton from "../LightButton";

interface IPredictAmountInput {
  setAmount: (amount: bigint) => void;
  setSelectedToken: (token: TokenType) => void;
  defaultValue?: bigint;
  value?: bigint;
  balance?: bigint;
  equivalentSDAI?: bigint;
  selectedToken: TokenType;
  className?: string;
  inputProps?: React.ComponentProps<typeof BigNumberField>;
}

const PredictAmountInput: React.FC<IPredictAmountInput> = ({
  setAmount,
  selectedToken,
  setSelectedToken,
  defaultValue,
  value,
  balance,
  equivalentSDAI,
  className,
  inputProps,
}) => {
  const notEnoughBalance = useMemo(() => {
    if (!isUndefined(value) && !isUndefined(balance) && value > balance)
      return true;
    return false;
  }, [value, balance]);

  const handleMaxClick = () => {
    if (!isUndefined(balance)) {
      setAmount(balance);
    }
  };
  const SDAIIcon = Tokens[TokenType.sDAI].Icon;
  const items = [
    {
      text: "sDAI",
      itemValue: TokenType.sDAI,
      id: TokenType.sDAI,
      icon: <SDAIIcon className="mr-2 size-6" />,
    },
    {
      text: "xDAI",
      itemValue: TokenType.xDAI,
      id: TokenType.xDAI,
      icon: <SDAIIcon className="mr-2 size-6" />,
    },
  ];

  const isXDai = selectedToken === TokenType.xDAI;

  return (
    <div className={cn("relative mb-8 w-full md:min-w-lg", className)}>
      <div className="flex items-center justify-between">
        <span className="text-klerosUIComponentsSecondaryText mb-1 text-sm">
          You pay
        </span>
        <LightButton
          small
          text="Max"
          onPress={handleMaxClick}
          className={clsx(
            "absolute -right-1 px-1 py-0.5",
            "[&_.button-text]:text-klerosUIComponentsPrimaryBlue [&_.button-text]:text-sm",
          )}
          isDisabled={inputProps?.isReadOnly}
        />
      </div>

      <div className="border-klerosUIComponentsStroke rounded-base flex h-fit flex-row border">
        <BigNumberField
          isRequired
          className={clsx(
            "inline-block flex-1 max-md:w-fit",
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
              : "0"
          }
          value={
            typeof value !== "undefined" ? formatUnits(value, 18) : undefined
          }
          formatOptions={{
            suffix:
              isXDai && equivalentSDAI
                ? `~ ${formatValue(equivalentSDAI)} sDAI`
                : "",
          }}
          {...inputProps}
        />
        <DropdownSelect
          className={clsx(
            "[&>button]:bg-klerosUIComponentsMediumBlue [&>button]:h-11.25 [&>button]:w-fit",
            "[&>button]:border-none [&>button]:focus:shadow-none",
            "[&>button]:rounded-l-none",
            "[&>button>svg]:fill-klerosUIComponentsSecondaryText [&>button>svg]:size-3",
          )}
          callback={(item) => {
            setSelectedToken(item.itemValue);
          }}
          defaultSelectedKey={selectedToken}
          items={items}
          isDisabled={inputProps?.isReadOnly}
        />
      </div>

      {!notEnoughBalance && isXDai ? (
        <span className="text-klerosUIComponentsPrimaryText absolute mt-1 text-xs">
          {!isUndefined(equivalentSDAI)
            ? `Equivalent sDAI ~${formatValue(equivalentSDAI)}`
            : "Loading..."}
        </span>
      ) : null}
      <span className="text-red-2 absolute text-xs">
        {notEnoughBalance ? "Not enough balance." : undefined}
      </span>
    </div>
  );
};
export default PredictAmountInput;
