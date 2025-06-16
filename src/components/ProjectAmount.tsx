import React from "react";

import { BigNumberField } from "@kleros/ui-components-library";

interface IProjectAmount {
  amount: BigNumber;
  name: string;
  color: string;
}

const ProjectAmount: React.FC<IProjectAmount> = ({ amount, name, color }) => {
  return (
    <div className="bg-klerosUIComponentsMediumBlue flex h-min items-center">
      <BigNumberField
        className="mr-4 w-24"
        inputProps={{ className: "text-klerosUIComponentsSecondaryText" }}
        value={amount}
        isDisabled
      />
      <span
        className="mr-2 size-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      <label className="text-klerosUIComponentsPrimaryText">{name}</label>
    </div>
  );
};

export default ProjectAmount;
