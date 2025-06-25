import React from "react";

import { Tooltip } from "@kleros/ui-components-library";

import HelpIcon from "@/assets/menu-icons/help.svg";

interface IWithHelpTooltip {
  tooltipMsg: string;
  place?: "bottom" | "left" | "right" | "top";
  children?: React.ReactNode;
}

const WithHelpTooltip: React.FC<IWithHelpTooltip> = ({
  tooltipMsg,
  children,
  place,
}) => (
  <div className="flex items-center">
    {children}
    <Tooltip
      small
      text={tooltipMsg}
      {...{ place }}
      className="max-w-94 [&>small]:text-sm [&>small]:whitespace-pre-line"
    >
      <HelpIcon className="ml-2 size-3 md:size-3.5" />
    </Tooltip>
  </div>
);

export default WithHelpTooltip;
