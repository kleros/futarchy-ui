"use client";

import React, { type ReactNode } from "react";

import { gnosis } from "@reown/appkit/networks";
import { createAppKit } from "@reown/appkit/react";
import { configureRpcProviders } from "@swapr/sdk";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";

import { wagmiAdapter } from "@/wagmiConfig";

import { reownProjectId, GNOSIS_RPC } from "@/consts";
const queryClient = new QueryClient();

if (!reownProjectId) {
  throw new Error("Project ID is not defined");
}

configureRpcProviders({
  [gnosis.id]: GNOSIS_RPC,
});

const metadata = {
  name: "Test",
  description: "AppKit Example",
  url: "https://reown.com/appkit", // origin must match your domain & subdomain
  icons: ["https://assets.reown.com/reown-profile-pic.png"],
};

createAppKit({
  adapters: [wagmiAdapter],
  projectId: reownProjectId,
  networks: [gnosis],
  defaultNetwork: gnosis,
  metadata: metadata,
  enableCoinbase: false,
  features: {
    analytics: false,
  },
});

interface IWeb3Context {
  children: ReactNode;
  cookies: string | null;
}

const Web3Context: React.FC<IWeb3Context> = ({ children, cookies }) => {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies,
  );

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      {...{ initialState }}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};

export default Web3Context;
