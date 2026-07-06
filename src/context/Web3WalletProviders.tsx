"use client";

import React, { type ReactNode } from "react";

import { AtlasProvider, SignupProduct } from "@kleros/kleros-app";
import { gnosis } from "@reown/appkit/networks";
import { createAppKit } from "@reown/appkit/react";
import { configureRpcProviders } from "@swapr/sdk";

import { wagmiAdapter } from "@/wagmiConfig";

import { reownProjectId, GNOSIS_RPC } from "@/consts";
import {
  siteName,
  metadata as websiteMetadata,
  websiteUrl,
} from "@/consts/metadata";

import { TradeWalletProvider } from "./TradeWalletContext";

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

const Web3WalletProviders: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  if (!atlasUri) {
    throw Error("NEXT_PUBLIC_ATLAS_URI not configured");
  }

  return (
    <AtlasProvider
      config={{
        uri: atlasUri,
        signupProduct: SignupProduct.Foresight,
        wagmiConfig: wagmiAdapter.wagmiConfig,
      }}
    >
      <TradeWalletProvider>{children}</TradeWalletProvider>
    </AtlasProvider>
  );
};

export default Web3WalletProviders;
