import React, { useCallback } from "react";

import { Modal, Button } from "@kleros/ui-components-library";
import { waitForTransactionReceipt, sendTransaction } from "@wagmi/core";
import { Address } from "viem";
import { useConfig, useAccount } from "wagmi";

import {
  useReadErc20Allowance,
  useReadErc20BalanceOf,
  useWriteErc20Approve,
  gnosisRouterAddress,
  useSimulateGnosisRouterSplitPosition,
  useWriteGnosisRouterSplitPosition,
} from "@/generated";

import { useMarketQuote } from "@/hooks/useMarketQuote";

interface IMintPopUp {
  isUpPredict: boolean;
  upToken: Address;
  downToken: Address;
  underlyingToken: Address;
  isOpen?: boolean;
  toggleIsOpen?: () => void;
}

const MintPopUp: React.FC<IMintPopUp> = ({
  isUpPredict,
  upToken,
  downToken,
  underlyingToken,
  isOpen,
  toggleIsOpen,
}) => {
  const wagmiConfig = useConfig();
  const { address } = useAccount();

  const { data: underlyingBalance, refetch: refetchBalance } =
    useReadErc20BalanceOf({
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

  const {
    data: resultSplitPosition,
    isLoading,
    isError,
  } = useSimulateGnosisRouterSplitPosition({
    args: [underlyingToken, marketId, underlyingBalance!],
    query: {
      enabled: typeof address !== "undefined" && (underlyingBalance ?? 0n) > 0n,
    },
  });

  const { writeContractAsync: splitPosition } =
    useWriteGnosisRouterSplitPosition();

  const { data: marketQuote } = useMarketQuote(
    upToken,
    underlyingToken,
    underlyingBalance ? formatUnits(underlyingBalance, 18) : "1",
  );

  const upPrice = useMemo(
    () => 1 / parseFloat(marketQuote?.executionPrice.toFixed(4) ?? "0"),
    [marketQuote],
  );

  return (
    <Modal
      className="w-[500px]"
      isDismissable
      onOpenChange={toggleIsOpen}
      {...{ isOpen }}
    >
      <div className="flex size-full items-center justify-center">
        <p className="text-klerosUIComponentsPrimaryText font-semibold">
          {"It's better to mint and sell."}
        </p>
        <Button text="Batch" />
        <Button text="Approve" />
      </div>
    </Modal>
  );
};

export default MintPopUp;
