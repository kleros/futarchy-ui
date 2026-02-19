"use client";
import React, { useEffect, useState } from "react";

import { useTheme } from "next-themes";

import Image from "next/image";
import Link from "next/link";

import _LogoDark from "@/assets/png/realt-logo-custom.png";
import _Logo from "@/assets/png/realt-logo.png";
import BuiltByKleros from "@/assets/svg/badge-built-by-kleros-black.svg";

const Logo: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Link href={"/"} className="flex items-center gap-6 md:gap-9">
        <Image
          src={_Logo}
          alt="RealT Distilled Judgement"
          className="max-h-14 w-27 hover:brightness-105 max-md:max-h-10 md:ml-6"
        />
        <BuiltByKleros className="[&_path]:fill-klerosUIComponentsPrimaryText w-37.5 max-md:w-30" />
      </Link>
    );
  }

  return (
    <Link href={"/"} className="flex items-center gap-6 md:gap-9">
      <Image
        src={resolvedTheme === "dark" ? _LogoDark : _Logo}
        alt="RealT Distilled Judgement"
        className="max-h-14 w-27 hover:brightness-105 max-md:max-h-10 md:ml-6"
      />
      <BuiltByKleros className="[&_path]:fill-klerosUIComponentsPrimaryText w-37.5 max-md:w-30" />
    </Link>
  );
};

export default Logo;
