"use client";
import React from "react";

import { Button } from "@kleros/ui-components-library";

import { cn } from "@/utils";

const LightButton: React.FC<React.ComponentProps<typeof Button>> = ({
  className,
  ...props
}) => (
  <Button
    variant="primary"
    small
    {...props}
    className={cn(
      "hover-short-transition !rounded-[7px] bg-transparent p-2",
      "hover:bg-whiteLowOpacityStrong",
      "[&>svg]:mr-0 [&>svg]:fill-white/75 hover:[&>svg]:fill-white",
      className,
    )}
  />
);

export default LightButton;
