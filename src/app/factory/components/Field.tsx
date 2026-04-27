import React from "react";

import { Tooltip } from "@kleros/ui-components-library";
import clsx from "clsx";

import HelpIcon from "@/assets/menu-icons/help.svg";

interface FieldProps {
  label: string;
  tooltip?: string;
  className?: string;
  children: React.ReactNode;
}

const Field: React.FC<FieldProps> = ({
  label,
  tooltip,
  className,
  children,
}) => (
  <label className={clsx("flex w-full flex-col gap-1.5", className)}>
    <span className="text-klerosUIComponentsPrimaryText flex items-center gap-2 text-xs font-semibold">
      {label}
      {tooltip ? (
        <Tooltip
          small
          text={tooltip}
          place="top"
          className="max-w-94 [&>small]:text-xs [&>small]:whitespace-pre-line"
        >
          <HelpIcon className="size-3" />
        </Tooltip>
      ) : null}
    </span>
    {children}
  </label>
);

export default Field;
