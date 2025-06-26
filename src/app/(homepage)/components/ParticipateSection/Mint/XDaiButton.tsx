import React from "react";

import { Button } from "@kleros/ui-components-library";
import { waitForTransactionReceipt } from "@wagmi/core";
import { useConfig } from "wagmi";

import {
  useSimulateGnosisRouterSplitFromBase,
  useWriteGnosisRouterSplitFromBase,
} from "@/generated";

import { parentMarket } from "@/consts/markets";

interface IXDaiButton {
  amount: bigint;
  isMinting: boolean;
  toggleIsMinting: (value: boolean) => void;
  refetchSDai: () => void;
  refetchXDai: () => void;
}

const XDaiButton: React.FC<IXDaiButton> = ({
  amount,
  isMinting,
  toggleIsMinting,
  refetchXDai,
  refetchSDai,
}) => {
  const result = useSimulateGnosisRouterSplitFromBase({
    args: [parentMarket],
    value: amount,
    query: {
      enabled: amount > 0,
    },
  });
  const { writeContractAsync } = useWriteGnosisRouterSplitFromBase();

  const config = useConfig();

  return (
    <Button
      isLoading={isMinting}
      isDisabled={isMinting}
      className="absolute right-1/2 bottom-0 translate-1/2"
      text="Convert to Movie Tokens"
      onPress={async () => {
        toggleIsMinting(true);
        try {
          if (typeof result.data !== "undefined") {
            const tx = await writeContractAsync(result.data?.request);
            await waitForTransactionReceipt(config, { hash: tx });
            refetchSDai();
            refetchXDai();
          }
        } finally {
          toggleIsMinting(false);
        }
      }}
    />
  );
};

export default XDaiButton;
