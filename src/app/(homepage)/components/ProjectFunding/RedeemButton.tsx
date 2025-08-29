import { useMemo, useState } from "react";

import { Button } from "@kleros/ui-components-library";
import { useQueryClient } from "@tanstack/react-query";
import { waitForTransactionReceipt } from "@wagmi/core";
import { useConfig } from "wagmi";

import {
  conditionalRouterAddress,
  sDaiAddress,
  useSimulateConditionalRouterRedeemConditionalToCollateral,
  useWriteConditionalRouterRedeemConditionalToCollateral,
} from "@/generated";

import { useMarketContext } from "@/context/MarketContext";
import { useAllowance } from "@/hooks/useAllowance";
import { useBalance } from "@/hooks/useBalance";

import ApproveButton from "@/components/ApproveButton";

import { isUndefined } from "@/utils";

import { marketsParentOutcome } from "@/consts/markets";

const RedeemButton: React.FC = () => {
  const wagmiConfig = useConfig();
  const queryClient = useQueryClient();

  const [isSending, setIsSending] = useState(false);
  const { market } = useMarketContext();
  const { upToken, downToken, marketId } = market;

  const { data: upBalance } = useBalance(upToken);
  const { data: downBalance } = useBalance(downToken);

  const { data: upAllowance } = useAllowance(upToken, conditionalRouterAddress);
  const { data: downAllowance } = useAllowance(
    downToken,
    conditionalRouterAddress,
  );

  // we only redeem one direction, the app works so as the user only has stake in one direction.
  // if a user happens to have both UP and DOWN tokens somehow, from Seer, they can claim twice.
  const { outcomeIndex, amount, approvalConfig } = useMemo(() => {
    if (
      isUndefined(upBalance) ||
      isUndefined(downBalance) ||
      isUndefined(upAllowance) ||
      isUndefined(downAllowance)
    )
      return {
        outcomeIndex: undefined,
        amount: undefined,
        approvalConfig: undefined,
      };

    if (upBalance > 0) {
      // 1 index is UP
      return {
        outcomeIndex: BigInt(1),
        amount: upBalance,
        approvalConfig:
          upBalance > upAllowance
            ? { token: upToken, name: "UP", amount: upBalance - upAllowance }
            : undefined,
      };
    }
    if (downBalance > 0) {
      // 0 index is DOWN
      return {
        outcomeIndex: BigInt(0),
        amount: downBalance,
        approvalConfig:
          downBalance > downAllowance
            ? {
                token: downToken,
                name: "DOWN",
                amount: downBalance - downAllowance,
              }
            : undefined,
      };
    }
    return {
      outcomeIndex: undefined,
      amount: undefined,
      approvalConfig: undefined,
    };
  }, [upBalance, upAllowance, downBalance, downAllowance, upToken, downToken]);

  const {
    data: redeemPositionConfig,
    isLoading,
    isError,
  } = useSimulateConditionalRouterRedeemConditionalToCollateral({
    query: {
      enabled:
        !isUndefined(outcomeIndex) &&
        !isUndefined(amount) &&
        isUndefined(approvalConfig),
    },
    args: [
      sDaiAddress,
      marketId,
      [outcomeIndex ?? 0n],
      [marketsParentOutcome],
      [amount ?? 0n],
    ],
  });

  const { writeContractAsync: redeemPosition } =
    useWriteConditionalRouterRedeemConditionalToCollateral();

  const handleRedeem = async () => {
    if (isUndefined(redeemPositionConfig)) return;
    setIsSending(true);

    const hash = await redeemPosition(redeemPositionConfig.request);
    await waitForTransactionReceipt(wagmiConfig, {
      hash,
      confirmations: 2,
    });
    setIsSending(false);
  };

  if (upBalance === 0n && downBalance === 0n) return null;

  return approvalConfig ? (
    <ApproveButton
      {...approvalConfig}
      spender={conditionalRouterAddress}
      callback={() => {
        queryClient.invalidateQueries();
      }}
    />
  ) : (
    <Button
      text="Claim"
      onPress={handleRedeem}
      isLoading={isLoading || isSending}
      isDisabled={isLoading || isError || isSending}
    />
  );
};

export default RedeemButton;
