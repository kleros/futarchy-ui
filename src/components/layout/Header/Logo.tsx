"use client";
import React from "react";

import Image from "next/image";
import Link from "next/link";

import _Logo from "@/assets/png/retro_PGF.png";

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-4">
      <Link href={"/"}>
        <Image
          src={_Logo}
          alt="RetroPGF experiment logo"
          className="size-14 max-h-14 hover:brightness-105 md:ml-6"
        />
      </Link>
    </div>
  );
};

export default Logo;
