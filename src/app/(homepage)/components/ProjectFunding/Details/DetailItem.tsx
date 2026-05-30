import React from "react";

const DetailItem: React.FC<{ icon: string; label: string; value: string }> = ({
  icon,
  label,
  value,
}) => (
  <div className="bg-klerosUIComponentsLightBackground flex items-center gap-2.5 rounded-xl p-3">
    <span className="text-base">{icon}</span>
    <div className="flex flex-col">
      <span className="text-klerosUIComponentsPrimaryText text-sm font-semibold">
        {value}
      </span>
      <span className="text-klerosUIComponentsSecondaryText text-[11px] tracking-wide uppercase">
        {label}
      </span>
    </div>
  </div>
);

export default DetailItem;
