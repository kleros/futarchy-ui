import React, { useMemo } from "react";

import { Card, Button } from "@kleros/ui-components-library";
import { waitForTransactionReceipt } from "@wagmi/core";
import clsx from "clsx";
import { useToggle } from "react-use";
import { useConfig } from "wagmi";

import {
  gnosisRouterAddress,
  useReadGnosisRouterGetWinningOutcomes,
  useWriteGnosisRouterRedeemPositions,
  useWriteErc20Approve,
  sDaiAddress,
} from "@/generated";

import { useNeedsApproval } from "@/hooks/useNeedsApproval";
import { useTokenBalances } from "@/hooks/useTokenBalances";

import { shortenName, isUndefined } from "@/utils";

import { markets, parentConditionId, parentMarket } from "@/consts/markets";

const RedeemParentMarket: React.FC = () => {
  const [isLoading, setIsLoading] = useToggle(false);
  const wagmiConfig = useConfig();

  const { data: winningOutcomes, isLoading: winningOutcomesLoading } =
    useReadGnosisRouterGetWinningOutcomes({
      args: [parentConditionId],
    });

  const winningTokens = useMemo(() => {
    if (!winningOutcomesLoading && !isUndefined(winningOutcomes)) {
      return markets
        .map((market, i) => ({ ...market, index: i }))
        .filter((_, i) => winningOutcomes[i])
        .map(({ underlyingToken, index }) => ({ underlyingToken, index }));
    }
  }, [winningOutcomesLoading, winningOutcomes]);

  const {
    data: balances,
    isLoading: balancesLoading,
    refetch: refetchBalances,
  } = useTokenBalances(
    winningTokens?.map(({ underlyingToken }) => underlyingToken) ?? [],
  );

  const winningTokensWithBalance = useMemo(
    () =>
      winningTokens
        ?.map(({ underlyingToken, index }, i) => ({
          address: underlyingToken,
          index,
          balance: balances?.[i].result as bigint,
        }))
        .filter(({ balance }) => balance > 0n),
    [balances, winningTokens],
  );

  const { needsApproval, refetch: refetchNeedsApproval } = useNeedsApproval(
    winningTokensWithBalance?.map(({ address }) => address) ?? [],
    winningTokensWithBalance?.map(({ balance }) => (balance as bigint) ?? 0n) ??
      [],
    gnosisRouterAddress,
  );

  const approvalsWithBalance = useMemo(
    () =>
      winningTokensWithBalance?.filter(({ address }) =>
        needsApproval.includes(address),
      ) ?? [],
    [winningTokensWithBalance, needsApproval],
  );

  const { writeContractAsync: approve } = useWriteErc20Approve();
  const { writeContractAsync: redeem } = useWriteGnosisRouterRedeemPositions();

  const nextApprovalName = useMemo(() => {
    const targetMarket = markets.find(
      ({ underlyingToken }) =>
        underlyingToken === approvalsWithBalance.at(0)?.address,
    );
    if (targetMarket) {
      return shortenName(targetMarket.name);
    }
  }, [approvalsWithBalance]);

  if (winningTokensWithBalance?.length ?? 0 > 0) {
    return (
      <Card
        round
        className={clsx(
          "border-gradient-purple-blue flex h-auto w-full items-center",
          "justify-between border-none px-4 py-6 md:px-8",
        )}
      >
        <p className="text-klerosUIComponentsPrimaryText">
          <strong>
            Tokens from the selected projects were not spent, you can redeem
            them here.
          </strong>
        </p>
        <Button
          isLoading={isLoading}
          isDisabled={isLoading || balancesLoading || winningOutcomesLoading}
          className=""
          text={
            approvalsWithBalance.length === 0
              ? "Redeem"
              : `Approve ${nextApprovalName}`
          }
          onPress={async () => {
            setIsLoading(true);
            if (approvalsWithBalance.length > 0) {
              try {
                const hash = await approve({
                  address: approvalsWithBalance[0].address,
                  args: [gnosisRouterAddress, approvalsWithBalance[0].balance],
                });
                await waitForTransactionReceipt(wagmiConfig, {
                  hash,
                  confirmations: 2,
                });
              } finally {
                refetchNeedsApproval();
                setIsLoading(false);
              }
            } else {
              try {
                const hash = await redeem({
                  args: [
                    sDaiAddress,
                    parentMarket,
                    winningTokensWithBalance?.map(({ index }) =>
                      BigInt(index),
                    ) ?? [],
                    winningTokensWithBalance?.map(({ balance }) => balance) ??
                      [],
                  ],
                });
                await waitForTransactionReceipt(wagmiConfig, {
                  hash,
                  confirmations: 2,
                });
              } finally {
                refetchBalances();
                setIsLoading(false);
              }
            }
          }}
        />
      </Card>
    );
  }
};

export default RedeemParentMarket;
