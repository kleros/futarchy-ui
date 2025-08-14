import React, { useMemo } from "react";

import { Button } from "@kleros/ui-components-library";
import { waitForTransactionReceipt } from "@wagmi/core";
import { encodeFunctionData, erc20Abi, Address } from "viem";
import { useConfig, useSendCalls, useCapabilities } from "wagmi";

import {
  gnosisRouterAddress,
  gnosisRouterAbi,
  sDaiAddress,
  useWriteErc20Approve,
  useWriteGnosisRouterMergePositions,
} from "@/generated";

import { useTokenAllowances } from "@/hooks/useTokenAllowances";

import { parentMarket, invalidMarket, markets } from "@/consts/markets";

interface IMergeButton {
  amount: bigint;
  isMinting: boolean;
  toggleIsMinting: (value: boolean) => void;
  refetchSDai: () => void;
  refetchBalances: () => void;
}

const MergeButton: React.FC<IMergeButton> = ({
  amount,
  isMinting,
  toggleIsMinting,
  refetchSDai,
  refetchBalances,
}) => {
  const wagmiConfig = useConfig();
  const { sendCalls } = useSendCalls();

  const atomicSupport = false;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: capabilities } = useCapabilities();
  // const atomicSupport = useMemo(
  //   () =>
  //     ["ready", "supported"].includes(capabilities?.[100].atomic?.status ?? ""),
  //   [capabilities],
  // );

  const allowances = useTokenAllowances(
    markets
      .map(({ underlyingToken }) => underlyingToken)
      .concat([invalidMarket]),
    gnosisRouterAddress,
  );

  const needApproval = useMemo(() => {
    const queryKey = allowances.queryKey as readonly [
      unknown,
      { contracts: { address: Address }[] },
    ];
    if (typeof allowances?.data !== "undefined") {
      return allowances.data
        .map(({ result }, i) => ({
          address: queryKey[1].contracts[i].address,
          result,
        }))
        .filter(({ result }) => typeof result === "bigint" && result < amount)
        .map(({ address }) => address);
    }
    return [];
  }, [allowances, amount]);

  const calls = useMemo(() => {
    const calls = needApproval.map((address) => ({
      to: address,
      value: 0n,
      data: encodeFunctionData({
        abi: erc20Abi,
        functionName: "approve",
        args: [gnosisRouterAddress, amount],
      }),
    }));
    calls.push({
      to: gnosisRouterAddress,
      value: 0n,
      data: encodeFunctionData({
        abi: gnosisRouterAbi,
        functionName: "mergePositions",
        args: [sDaiAddress, parentMarket, amount],
      }),
    });
    return calls;
  }, [amount, needApproval]);

  const { writeContractAsync: approve } = useWriteErc20Approve();
  const { writeContractAsync: mergePositions } =
    useWriteGnosisRouterMergePositions();

  return (
    <Button
      isLoading={isMinting}
      isDisabled={isMinting}
      className="absolute right-1/2 bottom-0 translate-1/2"
      text={
        atomicSupport || needApproval.length === 0
          ? "Merge to sDAI"
          : `Approve ${markets.length + 2 - needApproval.length}/${markets.length + 1}`
      }
      onPress={async () => {
        toggleIsMinting(true);
        if (atomicSupport && typeof calls !== "undefined") {
          sendCalls(
            { calls },
            {
              onSettled: () => {
                refetchSDai();
                toggleIsMinting(false);
              },
            },
          );
        } else if (needApproval.length > 0) {
          try {
            const hash = await approve({
              address: needApproval[0],
              args: [gnosisRouterAddress, amount],
            });
            await waitForTransactionReceipt(wagmiConfig, {
              hash,
              confirmations: 2,
            });
            allowances.refetch();
          } finally {
            toggleIsMinting(false);
          }
        } else {
          try {
            const hash = await mergePositions({
              args: [sDaiAddress, parentMarket, amount],
            });
            await waitForTransactionReceipt(wagmiConfig, {
              hash,
              confirmations: 2,
            });
          } finally {
            refetchSDai();
            refetchBalances();
            toggleIsMinting(false);
          }
        }
      }}
    />
  );
};

export default MergeButton;
