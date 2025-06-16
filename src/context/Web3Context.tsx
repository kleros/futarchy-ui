"use client";

import React, { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { gnosis } from "@reown/appkit/networks";

import { reownProjectId } from "@/consts";
import { wagmiAdapter } from "@/wagmiConfig";

const queryClient = new QueryClient();

if (!reownProjectId) {
  throw new Error("Project ID is not defined");
}

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
