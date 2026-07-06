"use client";

import React, { useEffect, type ReactNode } from "react";

import { useWeb3Ready } from "@/context/Web3ReadyContext";

interface Web3GatedProps {
  children: ReactNode;
  fallback?: ReactNode;
  preload?: boolean;
}

const Web3Gated: React.FC<Web3GatedProps> = ({
  children,
  fallback = null,
  preload = false,
}) => {
  const { isWeb3Ready, ensureWeb3Loaded } = useWeb3Ready();

  useEffect(() => {
    if (preload) {
      ensureWeb3Loaded();
    }
  }, [preload, ensureWeb3Loaded]);

  if (!isWeb3Ready) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default Web3Gated;
