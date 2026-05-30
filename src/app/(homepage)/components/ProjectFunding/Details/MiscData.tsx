import React from "react";

import clsx from "clsx";

interface MiscDataProps {
  data: Record<string, unknown>;
}

const MiscData: React.FC<MiscDataProps> = ({ data }) => (
  <div className="max-h-[400px] overflow-y-auto">
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {Object.entries(data).map(([key, value]) => (
        <div
          key={key}
          className={clsx(
            "bg-klerosUIComponentsLightBackground border-klerosUIComponentsStroke border",
            "flex flex-col rounded-md p-2",
          )}
        >
          <span className="text-klerosUIComponentsSecondaryText text-[10px] font-medium tracking-wide uppercase">
            {key}
          </span>
          <span
            className={clsx(
              "text-klerosUIComponentsPrimaryText font-mono text-xs font-medium break-all",
              !value && "text-klerosUIComponentsSecondaryText italic",
            )}
          >
            {value === null || value === undefined || value === ""
              ? "(empty)"
              : typeof value === "object"
                ? JSON.stringify(value)
                : String(value)}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default MiscData;
