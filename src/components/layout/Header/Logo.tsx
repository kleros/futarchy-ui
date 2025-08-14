"use client";
import React from "react";

import { useTheme } from "next-themes";

import Image from "next/image";
import Link from "next/link";

import _Logo from "@/assets/png/retro_PGF.png";
import _LogoDark from "@/assets/png/retro_PGF_dark.png";

const Logo: React.FC = () => {
  const { theme } = useTheme();
  return (
    <div className="flex items-center gap-4">
      <Link href={"/"}>
        <Image
          src={theme === "light" ? _Logo : _LogoDark}
          alt="RetroPGF experiment logo"
          className="size-14 max-h-14 hover:brightness-105 md:ml-6"
        />
      </Link>
    </div>
  );
};

export default Logo;
