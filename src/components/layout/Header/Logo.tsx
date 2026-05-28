"use client";
import React from "react";

import Link from "next/link";

import BuiltByKlerosLogo from "@/assets/svg/built-by-kleros.svg";
import ForesightLogo from "@/assets/svg/foresight-logo-navbar.svg";

const Logo: React.FC = () => {
  return (
    <div className="flex items-center md:ml-2">
      <Link href="/" className="flex items-center">
        <ForesightLogo />
      </Link>
      <BuiltByKlerosLogo />
    </div>
  );
};

export default Logo;
