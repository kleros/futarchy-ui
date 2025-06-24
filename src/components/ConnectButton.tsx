import React from "react";

import { Button } from "@kleros/ui-components-library";
import { useAppKit } from "@reown/appkit/react";
import { useAccount } from "wagmi";

import { shortenAddress } from "@/utils";

const ConnectButton: React.FC = () => {
  const { open } = useAppKit();
  const { address } = useAccount();

  return (
    <div>
      {address ? (
        <button
          className="bg-klerosUIComponentsStroke h-6 rounded-full px-2 hover:cursor-pointer"
          onClick={() => open({ view: "Account" })}
        >
          <span className="text-klerosUIComponentsPrimaryText text-sm">
            {shortenAddress(address)}
          </span>
        </button>
      ) : (
        <Button
          small
          text="Connect"
          onClick={() => open({ view: "Connect" })}
        />
      )}
    </div>
  );
};

export default ConnectButton;
