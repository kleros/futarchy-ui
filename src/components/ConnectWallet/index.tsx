"use client";
import React, { useCallback } from "react";

import { Button } from "@kleros/ui-components-library";
import { useAppKit, useAppKitState } from "@reown/appkit/react";
import { useAccount, useSwitchChain } from "wagmi";

import { DEFAULT_CHAIN } from "@/consts";

import AccountDisplay from "./AccountDisplay";

export const SwitchChainButton: React.FC<{ className?: string }> = ({
  className,
}) => {
  // @ts-expect-error  isLoading is not documented, but exists in the type, might have changed to isPending
  const { switchChain, isLoading } = useSwitchChain();
  const handleSwitch = useCallback(() => {
    if (!switchChain) {
      console.error("Cannot switch network. Please do it manually.");
      return;
    }
    try {
      switchChain({ chainId: DEFAULT_CHAIN.id });
    } catch (err) {
      console.error(err);
    }
  }, [switchChain]);
  return (
    <Button
      text={`Switch to ${DEFAULT_CHAIN.name}`}
      {...{ className }}
      isLoading={isLoading}
      isDisabled={isLoading}
      onPress={handleSwitch}
    />
  );
};

const ConnectButton: React.FC<{ text?: string; className?: string }> = ({
  text,
  className,
}) => {
  const { open } = useAppKit();
  const { open: isOpen } = useAppKitState();
  return (
    <Button
      {...{ className }}
      isDisabled={isOpen}
      small
      text={text ?? "Connect"}
      onPress={async () => open({ view: "Connect" })}
    />
  );
};

const ConnectWallet: React.FC<{ text?: string; className?: string }> = ({
  className,
  text,
}) => {
  const { isConnected, chainId } = useAccount();

  if (isConnected) {
    if (chainId !== DEFAULT_CHAIN.id) {
      return <SwitchChainButton {...{ className }} />;
    } else return <AccountDisplay />;
  } else return <ConnectButton {...{ text, className }} />;
};

export default ConnectWallet;
