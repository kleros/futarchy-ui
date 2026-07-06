"use client";

import React, { useEffect, useState } from "react";

import { Button } from "@kleros/ui-components-library";

import { useWeb3Ready } from "@/context/Web3ReadyContext";

type ConnectWalletComponent = React.ComponentType<{
  text?: string;
  className?: string;
}>;

const ConnectWalletSlot: React.FC<{ text?: string; className?: string }> = ({
  text = "Connect",
  className,
}) => {
  const { isWeb3Ready, ensureWeb3Loaded } = useWeb3Ready();
  const [ConnectWallet, setConnectWallet] =
    useState<ConnectWalletComponent | null>(null);

  useEffect(() => {
    if (!isWeb3Ready) return;

    import("./index").then((mod) => {
      setConnectWallet(() => mod.default);
    });
  }, [isWeb3Ready]);

  if (!isWeb3Ready || !ConnectWallet) {
    return (
      <Button
        small
        text={text}
        className={className}
        onPress={() => ensureWeb3Loaded()}
      />
    );
  }

  return <ConnectWallet text={text} className={className} />;
};

export default ConnectWalletSlot;
