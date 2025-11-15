import React from "react";

import { BigNumberField, Tooltip } from "@kleros/ui-components-library";
import { formatUnits } from "viem";

import { shortenName } from "@/utils";

interface IProjectAmount {
  balance?: bigint;
  name: string;
  color: string;
}

const ProjectAmount: React.FC<IProjectAmount> = ({ balance, name, color }) => {
  return (
    <div>
      <div className="bg-klerosUIComponentsMediumBlue flex h-min items-center">
        <BigNumberField
          className="mr-4 w-24 [&_input]:rounded-r-none [&_input]:border-r-0"
          inputProps={{ className: "text-klerosUIComponentsSecondaryText" }}
          value={formatUnits(balance ?? 0n, 18)}
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
