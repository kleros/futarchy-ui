import { useCallback, useMemo } from "react";

import { Button } from "@kleros/ui-components-library";
import { SwaprV3Trade } from "@swapr/sdk";
import { sendTransaction, waitForTransactionReceipt } from "@wagmi/core";
import { useToggle } from "react-use";
import { Address, parseUnits } from "viem";
import { useAccount, useConfig } from "wagmi";

import { useWriteErc20Approve } from "@/generated";

import { useAllowance } from "@/hooks/useAllowance";

import { isUndefined } from "@/utils";

import { SWAPR_CONTRACT } from "@/consts";

interface ITradeButton {
  sellToken: Address;
  quote?: SwaprV3Trade | null;
  setNextStep: () => void;
}

const TradeButton: React.FC<ITradeButton> = ({
  sellToken,
  quote,
  setNextStep,
}) => {
  const { address } = useAccount();
  const wagmiConfig = useConfig();
  const [userInteracting, toggleUserInteracting] = useToggle(false);

  const { data: allowance, refetch: refetchAllowance } =
    useAllowance(sellToken);

  const amountToTrade = useMemo(
    () =>
      isUndefined(quote)
        ? undefined
        : parseUnits(quote.inputAmount.toExact(), 18),
    [quote],
  );

  const isAllowance = useMemo(
    () =>
      !isUndefined(allowance) &&
      !isUndefined(amountToTrade) &&
      allowance < amountToTrade,
    [allowance, amountToTrade],
  );

  const { writeContractAsync: increaseAllowance } = useWriteErc20Approve();

  const handleAllowance = useCallback(async () => {
    try {
      if (!isUndefined(amountToTrade)) {
        // approve swapr router
        const hash = await increaseAllowance({
          address: sellToken,
          args: [SWAPR_CONTRACT, amountToTrade ?? 0],
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
    sellToken,
    amountToTrade,
  ]);

  const handleTrade = useCallback(async () => {
    try {
      const tx = await quote?.swapTransaction({
        recipient: address!,
      });

      const hash = await sendTransaction(wagmiConfig, {
        to: tx!.to as `0x${string}`,
        data: tx!.data!.toString() as `0x${string}`,
        value: BigInt(tx?.value?.toString() || 0),
      });
      await waitForTransactionReceipt(wagmiConfig, { hash, confirmations: 2 });
      setNextStep();
    } catch (err) {
      console.log("handleTrade:", err);
    }
  }, [address, wagmiConfig, quote, setNextStep]);

  return (
    <Button
      isDisabled={
        isUndefined(address) || isUndefined(allowance) || userInteracting
      }
      isLoading={userInteracting}
      text={isAllowance ? "Allow" : "Trade"}
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
