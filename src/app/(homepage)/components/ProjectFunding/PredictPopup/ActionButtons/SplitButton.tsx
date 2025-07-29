import React, { useMemo, useCallback } from "react";

import { Button } from "@kleros/ui-components-library";
import { waitForTransactionReceipt } from "@wagmi/core";
import { useToggle } from "react-use";
import { Address } from "viem";
import { useConfig, useAccount } from "wagmi";

import {
  useWriteErc20Approve,
  gnosisRouterAddress,
  useWriteGnosisRouterSplitPosition,
  sDaiAddress,
} from "@/generated";

import { useAllowance } from "@/hooks/useAllowance";
import { useBalance } from "@/hooks/useBalance";

import { isUndefined } from "@/utils";

interface ISplitButton {
  marketId: `0x${string}`;
  underlyingToken: Address;
  setNextStep: () => void;
}

const SplitButton: React.FC<ISplitButton> = ({
  marketId,
  underlyingToken,
  setNextStep,
}) => {
  const wagmiConfig = useConfig();
  const { address } = useAccount();
  const [isInteracting, toggleIsInteracting] = useToggle(false);

  const { data: underlyingBalance } = useBalance(underlyingToken);

  const { data: allowance, refetch: refetchAllowance } = useAllowance(
    underlyingToken,
    gnosisRouterAddress,
  );
  const isAllowance = useMemo(
    () =>
      !isUndefined(allowance) &&
      !isUndefined(underlyingBalance) &&
      allowance < underlyingBalance,
    [allowance, underlyingBalance],
  );

  const { writeContractAsync: increaseAllowance } = useWriteErc20Approve();

  const handleAllowance = useCallback(async () => {
    try {
      if (!isUndefined(underlyingBalance)) {
        const hash = await increaseAllowance({
          address: underlyingToken,
          args: [gnosisRouterAddress, underlyingBalance],
        });
        await waitForTransactionReceipt(wagmiConfig, {
          hash,
          confirmations: 2,
        });
        refetchAllowance();
      }
    } catch (err) {
      console.log("handleAllowance:", err);
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
    try {
      if (!isUndefined(underlyingBalance)) {
        const hash = await splitPosition({
          args: [sDaiAddress, marketId, underlyingBalance],
        });
        await waitForTransactionReceipt(wagmiConfig, {
          hash,
          confirmations: 2,
        });
        setNextStep();
      }
    } catch (err) {
      console.log("handleSplit:", err);
    }
  }, [splitPosition, marketId, underlyingBalance, setNextStep, wagmiConfig]);

  return (
    <Button
      isDisabled={
        isUndefined(address) || isUndefined(allowance) || isInteracting
      }
      isLoading={isInteracting}
      text={isAllowance ? "Allow" : "Mint"}
      aria-label="Mint Button"
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
