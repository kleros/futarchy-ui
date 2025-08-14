import React from "react";

import { BigNumberField, Tooltip } from "@kleros/ui-components-library";
import { formatUnits } from "viem";

import { formatValue } from "@/utils";

interface IProjectAmount {
  amount: bigint;
  balance?: bigint;
  name: string;
  color: string;
}

const shortenName = (name: string) =>
  name.length > 16 ? `${name.slice(0, 12)}...` : name;

const ProjectAmount: React.FC<IProjectAmount> = ({
  amount,
  balance,
  name,
  color,
}) => {
  return (
    <div>
      <span className="text-klerosUIComponentsSecondaryText text-xs">
        {`Balance: ${formatValue(balance ?? 0n)}`}
      </span>
      <div className="bg-klerosUIComponentsMediumBlue flex h-min items-center">
        <BigNumberField
          className="mr-4 w-24 [&_input]:rounded-r-none [&_input]:border-r-0"
          inputProps={{ className: "text-klerosUIComponentsSecondaryText" }}
          value={formatUnits(amount, 18)}
          isDisabled
        />
        <span
          className="mr-2 size-2 rounded-full"
          style={{ backgroundColor: color }}
        />
        <Tooltip text={name} closeDelay={125}>
          <label className="text-klerosUIComponentsPrimaryText">
            {shortenName(name)}
          </label>
        </Tooltip>
      </div>
    </div>
  );
};

export default ProjectAmount;
