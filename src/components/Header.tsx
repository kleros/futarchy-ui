"use client";

import React from "react";

import ConnectButton from "@/components/ConnectButton";

import RealTLogo from "@/assets/svg/RealT.svg";

const Header = () => {
  return (
    <div className="flex h-16 items-center justify-between bg-white px-4">
      <RealTLogo />
      <div className="flex items-center gap-16">
        <p>Home</p>
        <p>Policy</p>
        <ConnectButton />
      </div>
    </div>
  );
};

export default Header;
