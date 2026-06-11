"use client";

import React, { type ReactNode } from "react";

import { AtlasProvider, SignupProduct } from "@kleros/kleros-app";
import { gnosis } from "@reown/appkit/networks";
import { createAppKit } from "@reown/appkit/react";
import { configureRpcProviders } from "@swapr/sdk";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";

import { wagmiAdapter } from "@/wagmiConfig";

import { reownProjectId, GNOSIS_RPC } from "@/consts";
import {
  siteName,
  metadata as websiteMetadata,
  websiteUrl,
} from "@/consts/metadata";

const queryClient = new QueryClient();
const atlasUri = process.env.NEXT_PUBLIC_ATLAS_URI;

if (!reownProjectId) {
  throw new Error("Project ID is not defined");
}

configureRpcProviders({
  [gnosis.id]: GNOSIS_RPC,
});

const metadata = {
  name: siteName,
  description: websiteMetadata.description ?? "",
  url: websiteUrl,
  icons: ["icon1.png"],
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

  if (!atlasUri) {
    throw Error("NEXT_PUBLIC_ATLAS_URI not configured");
  }

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      {...{ initialState }}
    >
      <QueryClientProvider client={queryClient}>
        <AtlasProvider
          config={{
            uri: atlasUri,
            signupProduct: SignupProduct.Foresight,
            wagmiConfig: wagmiAdapter.wagmiConfig,
          }}
        >
          {children}
        </AtlasProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Web3Context;
