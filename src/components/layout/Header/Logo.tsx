"use client";
import React, { useEffect, useState } from "react";

import { useTheme } from "next-themes";

import Image from "next/image";
import Link from "next/link";

import _LogoDark from "@/assets/png/movies-logo-dark.png";
import _Logo from "@/assets/png/movies-logo.png";

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
            alt="Movies experiment logo"
            className="size-12 max-h-12 hover:brightness-105 md:ml-6"
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
          alt="Movies experiment logo"
          className="size-12 max-h-12 hover:brightness-105 md:ml-6"
        />
      </Link>
    </div>
  );
};

export default Logo;
