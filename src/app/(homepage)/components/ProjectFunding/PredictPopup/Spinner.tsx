import React from "react";

import clsx from "clsx";

import SpinnerIcon from "@/assets/svg/spinner.svg";
const Spinner: React.FC = () => (
  <SpinnerIcon
    className={clsx(
      "[&_path]:fill-klerosUIComponentsPrimaryBlue size-4 shrink-0",
      "animate-spinner origin-center transform-fill",
    )}
  />
);

export default Spinner;
