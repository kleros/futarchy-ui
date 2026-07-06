"use client";

import { Button } from "@kleros/ui-components-library";
import { useAccount, useDisconnect } from "wagmi";

import { CopiableAddressDisplay } from "@/components/ConnectWallet/AccountDetails";
import {
  ChainDisplay,
  IdenticonOrAvatar,
} from "@/components/ConnectWallet/AccountDisplay";
import ConnectWalletSlot from "@/components/ConnectWallet/ConnectWalletSlot";

const MobileNavbarWallet: React.FC = () => {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (!isConnected) {
    return <ConnectWalletSlot />;
  }

  return (
    <>
      <div className="flex flex-col items-start gap-4 md:items-center">
        <div className="flex gap-2">
          <IdenticonOrAvatar size={24} />
          <CopiableAddressDisplay />
        </div>
        <ChainDisplay />
      </div>
      <Button
        small
        variant="primary"
        text="Disconnect"
        onPress={() => disconnect()}
      />
    </>
  );
};

export default MobileNavbarWallet;
