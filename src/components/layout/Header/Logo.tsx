"use client";
import React, { useEffect, useState } from "react";

import { useTheme } from "next-themes";

import Image from "next/image";
import Link from "next/link";

import _LogoDark from "@/assets/png/realt-logo-dark.png";
import _Logo from "@/assets/png/realt-logo.png";

const Logo: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-4">
        <Link href={"/"}>
          <Image
            src={_Logo}
            alt="RealT Distilled Judgement"
            className="max-h-14 w-27 hover:brightness-105 md:ml-6"
          />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link href={"/"}>
        <Image
          src={resolvedTheme === "dark" ? _LogoDark : _Logo}
          alt="RealT Distilled Judgement"
          className="max-h-14 w-27 hover:brightness-105 md:ml-6"
        />
      </Link>
    </div>
  );
};

export default Logo;
