import React, { useMemo } from "react";

import { Button } from "@kleros/ui-components-library";
import { waitForTransactionReceipt } from "@wagmi/core";
import { useAccount, useConfig } from "wagmi";

import {
  useSimulateGnosisRouterSplitPosition,
  useWriteGnosisRouterSplitPosition,
  gnosisRouterAddress,
  useReadSDaiAllowance,
  sDaiAddress,
  useWriteSDaiApprove,
} from "@/generated";

import { parentMarket } from "@/consts/markets";

interface ISDaiButton {
  amount: bigint;
  isMinting: boolean;
  toggleIsMinting: (value: boolean) => void;
  refetchSDai: () => void;
  refetchXDai: () => void;
  refetchBalances: () => void;
}

const SDaiButton: React.FC<ISDaiButton> = ({
  amount,
  isMinting,
  toggleIsMinting,
  refetchXDai,
  refetchSDai,
  refetchBalances,
}) => {
  const { address } = useAccount();

  const {
    data: result,
    isLoading,
    isError,
    refetch: refetchSimulation,
  } = useSimulateGnosisRouterSplitPosition({
    args: [sDaiAddress, parentMarket, amount],
    query: {
      enabled: typeof address !== "undefined" && amount > 0n,
    },
  });

  const { writeContractAsync } = useWriteGnosisRouterSplitPosition();

  const wagmiConfig = useConfig();

  const { data: allowance, refetch: refetchAllowance } = useReadSDaiAllowance({
    args: [address!, gnosisRouterAddress],
  });

  const isAllowance = useMemo(
    () => amount > (allowance ?? 0n),
    [amount, allowance],
  );

  const { writeContractAsync: increaseAllowance } = useWriteSDaiApprove();

  return (
    <Button
      isLoading={isMinting}
      isDisabled={
        amount === 0n || isMinting || (!isAllowance && (isLoading || isError))
      }
      className="absolute right-1/2 bottom-0 translate-1/2"
      text={isAllowance ? "Allow sDAI" : "Convert to Movie Tokens"}
      onPress={async () => {
        toggleIsMinting(true);
        try {
          if (isAllowance) {
            const hash = await increaseAllowance({
              args: [gnosisRouterAddress, amount],
            });
            await waitForTransactionReceipt(wagmiConfig, {
              hash,
              confirmations: 2,
            });
            refetchAllowance();
            refetchSimulation();
          } else if (typeof result !== "undefined") {
            const tx = await writeContractAsync(result.request);
            await waitForTransactionReceipt(wagmiConfig, { hash: tx });
            refetchSDai();
            refetchXDai();
            refetchBalances();
          }
        } finally {
          toggleIsMinting(false);
        }
      }}
    />
  );
};

export default SDaiButton;
