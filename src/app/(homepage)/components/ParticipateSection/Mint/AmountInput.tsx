import { BigNumberField, DropdownSelect } from "@kleros/ui-components-library";
import clsx from "clsx";
import { parseUnits } from "viem";

import DAIIcon from "@/assets/svg/dai.svg";

export enum TokenType {
  sDAI,
  xDAI,
}
interface IAmountInput {
  amount: bigint;
  setAmount: (amount: bigint) => void;
  setSelectedToken: (token: TokenType) => void;
}

const AmountInput: React.FC<IAmountInput> = ({
  setAmount,
  setSelectedToken,
}) => {
  return (
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
        // variant={resultDeposit.isError ? "error" : undefined}
        // message={
        //   resultDeposit.isError
        //     ? parseWagmiError(resultDeposit.error)
        //     : undefined
        // }
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
  );
};
export default AmountInput;
