"use client";

import { useAccount } from "wagmi";

import ConnectWalletSlot from "@/components/ConnectWallet/ConnectWalletSlot";
import Web3Gated from "@/components/Web3Gated";

import { isUndefined } from "@/utils";

const EnsureChainInner: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { address } = useAccount();

  return isUndefined(address) ? <ConnectWalletSlot text="Connect" /> : children;
};

const EnsureChain: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Web3Gated preload fallback={<ConnectWalletSlot text="Connect" />}>
      <EnsureChainInner>{children}</EnsureChainInner>
    </Web3Gated>
  );
};

export default EnsureChain;
