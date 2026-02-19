import React from "react";

import clsx from "clsx";

export const DetailsCategory: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div>
    <div
      className={clsx(
        "border-klerosUIComponentsStroke border-b",
        "text-klerosUIComponentsPrimaryBlue mb-3 pb-2 text-xs font-semibold tracking-wide uppercase",
      )}
    >
      {title}
    </div>
    {children}
  </div>
);

export const DetailsGrid: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
    {children}
  </div>
);

export const DetailsListItem: React.FC<{
  label: string;
  value: React.ReactNode;
  small?: boolean;
}> = ({ label, value, small }) => (
  <div className="bg-klerosUIComponentsLightBackground flex flex-col rounded-lg p-2.5">
    <span className="text-klerosUIComponentsSecondaryText text-[11px] tracking-wide uppercase">
      {label}
    </span>
    <span
      className={clsx(
        "text-klerosUIComponentsPrimaryText font-medium",
        small ? "text-[11px] break-all" : "text-sm",
      )}
    >
      {value}
    </span>
  </div>
);
