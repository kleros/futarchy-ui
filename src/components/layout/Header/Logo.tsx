import React from "react";

import Link from "next/link";

import RealTLogo from "@/assets/svg/RealT.svg";

const Logo: React.FC = () => (
  <div className="flex items-center gap-4">
    <Link href={"/"}>
      <RealTLogo className="hover-short-transition max-h-12 hover:brightness-105 md:ml-6" />
    </Link>
  </div>
);

export default Logo;
