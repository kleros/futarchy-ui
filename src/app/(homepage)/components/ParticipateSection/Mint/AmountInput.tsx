import { BigNumberField, DropdownSelect } from "@kleros/ui-components-library";
import clsx from "clsx";
import { parseUnits, formatUnits } from "viem";

import DAIIcon from "@/assets/svg/dai.svg";

export enum TokenType {
  sDAI,
  xDAI,
}
interface IAmountInput {
  setAmount: (amount: bigint) => void;
  setSelectedToken: (token: TokenType) => void;
  notEnoughBalance: boolean;
  defaultValue?: bigint;
  value?: bigint;
}

const AmountInput: React.FC<IAmountInput> = ({
  setAmount,
  setSelectedToken,
  notEnoughBalance,
  defaultValue,
  value,
}) => {
  return (
    <div className="relative mb-4">
      <div className="border-klerosUIComponentsStroke rounded-base flex h-fit flex-row border">
        <BigNumberField
          className={clsx(
            "inline-block w-36",
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
          isDisabled={typeof value !== "undefined"}
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
          defaultSelectedKey={TokenType.sDAI}
          items={[
            {
              text: "sDAI",
              itemValue: TokenType.sDAI,
              id: TokenType.sDAI,
              icon: <DAIIcon className="mr-2 size-6" />,
            },
            {
              text: "xDAI",
              itemValue: TokenType.xDAI,
              id: TokenType.xDAI,
              icon: <DAIIcon className="mr-2 size-6" />,
            },
          ]}
        />
      </div>
      <span className="text-light-mode-red-2 absolute text-sm">
        {notEnoughBalance ? "Not enough balance." : undefined}
      </span>
    </div>
  );
};
export default AmountInput;
