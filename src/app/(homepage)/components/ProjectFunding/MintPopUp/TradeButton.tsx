import { useCallback, useMemo } from "react";

import { Button } from "@kleros/ui-components-library";
import { SwaprV3Trade } from "@swapr/sdk";
import { sendTransaction, waitForTransactionReceipt } from "@wagmi/core";
import { useToggle } from "react-use";
import { Address, formatUnits } from "viem";
import { useAccount, useConfig } from "wagmi";

import { useWriteErc20Approve } from "@/generated";

import { useCardInteraction } from "@/context/CardInteractionContext";
import { useMarketContext } from "@/context/MarketContext";
import { useAllowance } from "@/hooks/useAllowance";
import { useBalance } from "@/hooks/useBalance";
import { useMarketQuote } from "@/hooks/useMarketQuote";

interface ITradeButton {
  buyToken: Address;
  sellToken: Address;
  amount?: bigint | null;
  quote?: SwaprV3Trade | null;
}

const TradeButton: React.FC<ITradeButton> = ({
  buyToken,
  sellToken,
  amount,
}) => {
  const { market } = useMarketContext();
  const { marketId } = market;
  const { activeCardId } = useCardInteraction();

  const { address } = useAccount();
  const wagmiConfig = useConfig();
  const [userInteracting, toggleUserInteracting] = useToggle(false);

  const { data: allowance, refetch: refetchAllowance } =
    useAllowance(sellToken);

  const { data: underlyingBalance, refetch: refetchBalance } =
    useBalance(sellToken);

  const amountToTrade = amount ?? underlyingBalance;

  const isAllowance = useMemo(
    () =>
      typeof allowance !== "undefined" &&
      typeof underlyingBalance !== "undefined" &&
      allowance < underlyingBalance,
    [allowance, underlyingBalance],
  );

  const { data: marketQuote } = useMarketQuote(
    buyToken,
    sellToken,
    amountToTrade ? formatUnits(amountToTrade, 18) : "1",
    activeCardId === marketId,
  );

  const { writeContractAsync: increaseAllowance } = useWriteErc20Approve();

  const handleAllowance = useCallback(async () => {
    if (typeof amountToTrade !== "undefined") {
      // approve swapr router
      const hash = await increaseAllowance({
        address: sellToken,
        args: ["0xffb643e73f280b97809a8b41f7232ab401a04ee1", amountToTrade],
      });
      await waitForTransactionReceipt(wagmiConfig, { hash, confirmations: 2 });
      refetchAllowance();
    }
  }, [
    wagmiConfig,
    increaseAllowance,
    refetchAllowance,
    amountToTrade,
    sellToken,
  ]);

  const handleTrade = useCallback(async () => {
    const tx = await marketQuote?.swapTransaction({
      recipient: address!,
    });
    const hash = await sendTransaction(wagmiConfig, {
      to: tx!.to as `0x${string}`,
      data: tx!.data!.toString() as `0x${string}`,
      value: BigInt(tx?.value?.toString() || 0),
    });
    await waitForTransactionReceipt(wagmiConfig, { hash, confirmations: 2 });
    refetchBalance();
  }, [address, wagmiConfig, refetchBalance, marketQuote]);

  return (
    <Button
      isDisabled={
        typeof address === "undefined" ||
        typeof underlyingBalance === "undefined" ||
        underlyingBalance === 0n ||
        typeof allowance === "undefined" ||
        userInteracting
      }
      isLoading={userInteracting}
      text={isAllowance ? "Allow" : underlyingBalance === 0n ? "Done" : "Trade"}
      aria-label="Trade Button"
      onPress={async () => {
        toggleUserInteracting(true);
        try {
          if (isAllowance) {
            await handleAllowance();
          } else {
            await handleTrade();
          }
        } finally {
          toggleUserInteracting(false);
        }
      }}
    />
  );
};

export default TradeButton;
