import React, { useMemo, useCallback } from "react";

import { Button } from "@kleros/ui-components-library";
import { waitForTransactionReceipt } from "@wagmi/core";
import { useToggle } from "react-use";
import { Address } from "viem";
import { useConfig, useAccount } from "wagmi";

import {
  useReadErc20Allowance,
  useReadErc20BalanceOf,
  useWriteErc20Approve,
  gnosisRouterAddress,
  useWriteGnosisRouterSplitPosition,
} from "@/generated";

interface ISplitButton {
  marketId: `0x${string}`;
  underlyingToken: Address;
}

const SplitButton: React.FC<ISplitButton> = ({ marketId, underlyingToken }) => {
  const wagmiConfig = useConfig();
  const { address } = useAccount();
  const [isInteracting, toggleIsInteracting] = useToggle(false);

  const { data: underlyingBalance } = useReadErc20BalanceOf({
    address: underlyingToken,
    args: [address ?? "0x"],
    query: {
      staleTime: 5000,
      enabled: typeof address !== "undefined",
    },
  });

  const { data: allowance, refetch: refetchAllowance } = useReadErc20Allowance({
    address: underlyingToken,
    args: [address ?? "0x", gnosisRouterAddress],
    query: {
      staleTime: 5000,
      enabled: typeof address !== "undefined",
    },
  });

  const isAllowance = useMemo(
    () =>
      typeof allowance !== "undefined" &&
      typeof underlyingBalance !== "undefined" &&
      allowance < underlyingBalance,
    [allowance, underlyingBalance],
  );

  const { writeContractAsync: increaseAllowance } = useWriteErc20Approve();

  const handleAllowance = useCallback(async () => {
    if (typeof underlyingBalance !== "undefined") {
      const hash = await increaseAllowance({
        address: underlyingToken,
        args: [gnosisRouterAddress, underlyingBalance],
      });
      await waitForTransactionReceipt(wagmiConfig, { hash, confirmations: 2 });
      refetchAllowance();
    }
  }, [
    wagmiConfig,
    increaseAllowance,
    refetchAllowance,
    underlyingBalance,
    underlyingToken,
  ]);

  const { writeContractAsync: splitPosition } =
    useWriteGnosisRouterSplitPosition();

  const handleSplit = useCallback(async () => {
    if (typeof underlyingBalance !== "undefined") {
      splitPosition({
        args: [underlyingToken, marketId, underlyingBalance],
      });
    }
  }, [splitPosition, underlyingToken, marketId, underlyingBalance]);

  return (
    <Button
      isDisabled={
        typeof address === "undefined" ||
        typeof underlyingBalance === "undefined" ||
        underlyingBalance === 0n ||
        typeof allowance === "undefined" ||
        isInteracting
      }
      isLoading={isInteracting}
      text={
        isAllowance ? "Allow" : underlyingBalance === 0n ? "Done" : "Predict"
      }
      aria-label="Predict Button"
      onPress={async () => {
        toggleIsInteracting(true);
        try {
          if (isAllowance) {
            await handleAllowance();
          } else {
            await handleSplit();
          }
        } finally {
          toggleIsInteracting(false);
        }
      }}
    />
  );
};

export default SplitButton;
