import React from "react";

import clsx from "clsx";

import InfoCircle from "@/assets/svg/info.svg";

interface IInfoCard {
  msg: string;
  className?: string;
}

const InfoCard: React.FC<IInfoCard> = ({ msg, className }) => {
  return (
    <div
      className={clsx(
        "grid grid-cols-[16px_auto] items-center justify-start gap-2",
        "text-klerosUIComponentsSecondaryText text-start",
        className,
      )}
    >
      <InfoCircle />
      {msg}
    </div>
  );
};

export default InfoCard;
