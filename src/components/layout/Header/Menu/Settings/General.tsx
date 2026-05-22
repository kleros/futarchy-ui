import React, { useMemo } from "react";

import clsx from "clsx";
import { useAccount } from "wagmi";

import { DisconnectWalletButton } from "@/components/ConnectWallet";
import {
  AddressOrName,
  ChainDisplay,
  IdenticonOrAvatar,
} from "@/components/ConnectWallet/AccountDisplay";
import EnsureChain from "@/components/EnsureChain";

const General: React.FC = () => {
  const { address, chain } = useAccount();

  const addressExplorerLink = useMemo(() => {
    return `${chain?.blockExplorers?.default.url}/address/${address}`;
  }, [address, chain]);

  return (
    <div className="flex justify-center pt-4">
      <EnsureChain>
        <div className="mt-3 flex flex-col justify-center">
          {address && (
            <div className="flex flex-col gap-3">
              <div className="mt-3 flex justify-center">
                <IdenticonOrAvatar size={48} />
              </div>
              <div
                className={clsx(
                  "flex justify-center",
                  "[&>label]:text-klerosUIComponentsPrimaryText [&>label]:text-base [&>label]:font-semibold",
                )}
              >
                <a
                  href={addressExplorerLink}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="[&_label]:text-klerosUIComponentsPrimaryBlue hover:underline [&_label]:cursor-pointer"
                >
                  <AddressOrName />
                </a>
              </div>
              <div className="flex h-[34px] items-center justify-center gap-2">
                <ChainDisplay />
              </div>
              <div className="mt-4 flex justify-center">
                <DisconnectWalletButton />
              </div>
            </div>
          )}
        </div>
      </EnsureChain>
    </div>
  );
};

export default General;
