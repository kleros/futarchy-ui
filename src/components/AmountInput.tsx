import { useMemo } from "react";

import { BigNumberField, DropdownSelect } from "@kleros/ui-components-library";
import clsx from "clsx";
import { parseUnits, formatUnits } from "viem";

import { cn, formatValue, isUndefined } from "@/utils";

import LightButton from "./LightButton";
import { Tokens, TokenType } from "@/consts";

interface IAmountInput {
  setAmount: (amount: bigint) => void;
  setSelectedToken: (token: TokenType) => void;
  defaultValue?: bigint;
  value?: bigint;
  balance?: bigint;
  selectedToken: TokenType;
  className?: string;
  inputProps?: React.ComponentProps<typeof BigNumberField>;
  isWithdraw?: boolean;
}

const AmountInput: React.FC<IAmountInput> = ({
  setAmount,
  selectedToken,
  setSelectedToken,
  defaultValue,
  value,
  balance,
  className,
  inputProps,
  isWithdraw,
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

  const items = useMemo(() => {
    const SDAIIcon = Tokens[TokenType.sDAI].Icon;
    const SeerCreditsIcon = Tokens[TokenType.SeerCredits].Icon;
    const tokens = [
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
    if (isWithdraw) {
      tokens.push(
        ...[
          {
            text: "wxDAI",
            itemValue: TokenType.WXDAI,
            id: TokenType.WXDAI,
            icon: <SDAIIcon className="mr-2 size-6" />,
          },
          {
            text: "Seer Credits",
            itemValue: TokenType.SeerCredits,
            id: TokenType.SeerCredits,
            icon: <SeerCreditsIcon className="mr-2 size-6" />,
          },
        ],
      );
    }
    return tokens;
  }, [isWithdraw]);

  return (
    <div className={cn("relative mb-8 w-full md:min-w-lg", className)}>
      <div className="border-klerosUIComponentsStroke rounded-base flex h-fit flex-row border">
        <BigNumberField
          isRequired
          className={clsx(
            "inline-block flex-1 max-md:w-max",
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
          {...inputProps}
        />
        <DropdownSelect
          className={clsx(
            "[&>button]:bg-klerosUIComponentsMediumBlue [&>button]:h-11.25 [&>button]:w-fit",
            "[&>button]:border-none [&>button]:focus:shadow-none",
            "[&>button]:rounded-l-none",
          )}
          callback={(item) => {
            setSelectedToken(item.itemValue);
          }}
          defaultSelectedKey={selectedToken}
          items={items}
          isDisabled={inputProps?.isReadOnly}
        />
      </div>
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
      {!notEnoughBalance && (
        <span className="text-klerosUIComponentsPrimaryText absolute mt-1 text-xs">
          {!isUndefined(balance)
            ? `Available: ${formatValue(balance)}`
            : "Loading..."}
        </span>
      )}
      <span className="text-red-2 absolute text-xs">
        {notEnoughBalance ? "Not enough balance." : undefined}
      </span>
    </div>
  );
};
export default AmountInput;
