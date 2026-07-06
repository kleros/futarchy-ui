"use client";

import React, { type ReactNode } from "react";

import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";

import { wagmiAdapter } from "@/wagmiConfig";

interface WagmiShellProps {
  children: ReactNode;
  cookies: string | null;
}

const WagmiShell: React.FC<WagmiShellProps> = ({ children, cookies }) => {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies,
  );

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      {...{ initialState }}
    >
      {children}
    </WagmiProvider>
  );
};

export default WagmiShell;
