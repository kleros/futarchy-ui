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
  initialBalanceRef: React.MutableRefObject<bigint | null>;
}

const SplitButton: React.FC<ISplitButton> = ({
  marketId,
  underlyingToken,
  initialBalanceRef,
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
    if (!isUndefined(underlyingBalance)) {
      // keep track of the balance we started with,
      // so we don't accidentally trade the already existing UP/DOWN tokens user may have
      initialBalanceRef.current = underlyingBalance;

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
    initialBalanceRef,
  ]);

  const { writeContractAsync: splitPosition } =
    useWriteGnosisRouterSplitPosition();

  const handleSplit = useCallback(async () => {
    if (typeof underlyingBalance !== "undefined") {
      splitPosition({
        args: [sDaiAddress, marketId, underlyingBalance],
      });
    }
  }, [splitPosition, marketId, underlyingBalance]);

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
      text={isAllowance ? "Allow" : underlyingBalance === 0n ? "Done" : "Mint"}
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
