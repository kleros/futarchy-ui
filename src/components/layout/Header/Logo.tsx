"use client";
import React from "react";

import { useTheme } from "next-themes";

import clsx from "clsx";
import Link from "next/link";

import _Logo from "@/assets/svg/futarchy-logo.svg";

const Logo: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="flex items-center gap-4">
      <Link href={"/"}>
        <_Logo
          className={clsx(
            "hover-short-transition size-14 max-h-14 hover:brightness-105 md:ml-6",
            theme === "dark" && "[&_path]:!fill-white",
          )}
        />
      </Link>
    </div>
  );
};

export default Logo;
