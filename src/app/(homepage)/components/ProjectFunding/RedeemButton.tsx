import { Button } from "@kleros/ui-components-library";
import { Address } from "viem";

import { useMarketContext } from "@/context/MarketContext";
import { useRedeemToTradeExecutor } from "@/hooks/tradeWallet/useRedeemToTradeExecutor";
import { useTokenBalance } from "@/hooks/useTokenBalance";

import { isUndefined } from "@/utils";

interface IRedeemButton {
  tradeExecutor: Address;
}

const RedeemButton: React.FC<IRedeemButton> = ({ tradeExecutor }) => {
  const { market } = useMarketContext();
  const { upToken, downToken, marketId, parentMarketOutcome } = market;

  const { data: upBalanceData, isLoading: isLoadingUpBalance } =
    useTokenBalance({ token: upToken, address: tradeExecutor });
  const { data: downBalanceData, isLoading: isLoadingDownBalance } =
    useTokenBalance({ token: downToken, address: tradeExecutor });

  const redeemToTradeExecutor = useRedeemToTradeExecutor();
  const handleRedeem = async () => {
    if (
      isUndefined(upBalanceData?.value) ||
      isUndefined(downBalanceData?.value)
    )
      return;

    redeemToTradeExecutor.mutate({
      tradeExecutor,
      tokens: [upToken, downToken],
      amounts: [upBalanceData.value, downBalanceData.value],
      outcomeIndexes: [1n, 0n],
      parentMarketOutcome: BigInt(parentMarketOutcome),
      marketId,
    });
  };

  if (isLoadingUpBalance || isLoadingDownBalance) return null;

  return (
    <Button
      text="Claim"
      onPress={handleRedeem}
      isLoading={redeemToTradeExecutor.isPending}
      isDisabled={redeemToTradeExecutor.isPending}
    />
  );
};

export default RedeemButton;
