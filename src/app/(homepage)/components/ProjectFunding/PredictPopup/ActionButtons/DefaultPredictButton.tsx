import { useCallback, useMemo } from "react";

import { Button } from "@kleros/ui-components-library";
import { sendTransaction, waitForTransactionReceipt } from "@wagmi/core";
import { useToggle } from "react-use";
import { useAccount, useConfig } from "wagmi";

import { useWriteErc20Approve } from "@/generated";

import { useMarketContext } from "@/context/MarketContext";
import { useAllowance } from "@/hooks/useAllowance";
import { useBalance } from "@/hooks/useBalance";

import { isUndefined } from "@/utils";

import { SWAPR_CONTRACT } from "@/consts";

const DefaultPredictButton: React.FC<{ toggleIsOpen?: () => void }> = ({
  toggleIsOpen,
}) => {
  const {
    marketQuote,
    marketDownQuote,
    isUpPredict,
    market,
    isLoading,
    hasLiquidity,
    refetchQuotes,
  } = useMarketContext();
  const { underlyingToken } = market;

  const wagmiConfig = useConfig();
  const { address } = useAccount();
  const [userInteracting, toggleUserInteracting] = useToggle(false);
  const { data: allowance, refetch: refetchAllowance } =
    useAllowance(underlyingToken);

  const { data: underlyingBalance, refetch: refetchBalance } =
    useBalance(underlyingToken);

  const isAllowance = useMemo(
    () =>
      typeof allowance !== "undefined" &&
      typeof underlyingBalance !== "undefined" &&
      allowance < underlyingBalance,
    [allowance, underlyingBalance],
  );

  const { writeContractAsync: increaseAllowance } = useWriteErc20Approve();

  const handleAllowance = useCallback(async () => {
    try {
      if (!isUndefined(underlyingBalance)) {
        const hash = await increaseAllowance({
          address: underlyingToken,
          args: [SWAPR_CONTRACT, underlyingBalance],
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

  const handlePredict = useCallback(async () => {
    try {
      const tx = await (
        isUpPredict ? marketQuote : marketDownQuote
      )?.swapTransaction({
        recipient: address!,
      });
      const hash = await sendTransaction(wagmiConfig, {
        to: tx!.to as `0x${string}`,
        data: tx!.data!.toString() as `0x${string}`,
        value: BigInt(tx?.value?.toString() || 0),
      });
      await waitForTransactionReceipt(wagmiConfig, { hash, confirmations: 2 });
      refetchBalance();
      refetchQuotes();
      toggleIsOpen?.();
    } catch (err) {
      console.log("handlePredict:", err);
    }
  }, [
    address,
    marketQuote,
    marketDownQuote,
    wagmiConfig,
    isUpPredict,
    refetchBalance,
    refetchQuotes,
    toggleIsOpen,
  ]);
  return (
    <Button
      isDisabled={
        !hasLiquidity ||
        isUndefined(address) ||
        isUndefined(underlyingBalance) ||
        isUndefined(allowance) ||
        userInteracting ||
        underlyingBalance === 0n ||
        isLoading
      }
      isLoading={userInteracting || isLoading}
      text={isAllowance ? "Allow" : "Predict"}
      aria-label="Predict Button"
      onPress={async () => {
        toggleUserInteracting(true);
        try {
          if (isAllowance) {
            await handleAllowance();
          } else {
            await handlePredict();
          }
        } finally {
          toggleUserInteracting(false);
        }
      }}
    />
  );
};

export default DefaultPredictButton;
