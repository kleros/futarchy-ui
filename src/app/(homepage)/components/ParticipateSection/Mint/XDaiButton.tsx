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
  setAmount: (a: bigint) => void;
  toggleIsMinting: (value: boolean) => void;
  refetchSDai: () => void;
  refetchXDai: () => void;
  refetchBalances: () => void;
}

const XDaiButton: React.FC<IXDaiButton> = ({
  amount,
  isMinting,
  toggleIsMinting,
  refetchXDai,
  refetchSDai,
  refetchBalances,
  setAmount,
}) => {
  const {
    data: result,
    isLoading,
    isError,
  } = useSimulateGnosisRouterSplitFromBase({
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
      isDisabled={isMinting || isLoading || isError}
      className="absolute right-1/2 bottom-0 translate-1/2"
      text="Convert to Movie Tokens"
      onPress={async () => {
        toggleIsMinting(true);
        try {
          if (typeof result !== "undefined") {
            const tx = await writeContractAsync(result.request);
            await waitForTransactionReceipt(config, { hash: tx });
            refetchSDai();
            refetchXDai();
            refetchBalances();
            setAmount(0n);
          }
        } finally {
          toggleIsMinting(false);
        }
      }}
    />
  );
};

export default XDaiButton;
