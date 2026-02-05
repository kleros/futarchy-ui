import { useEffect, useMemo } from "react";

import { useLocalStorage } from "react-use";
import type { Address } from "viem";

const STORAGE_KEY = "hasPredictedBefore";

interface UseFirstPredictionStatusArgs {
  tradeExecutor?: Address;
  outcomeTokenBalances?: bigint[];
}

/**
 * This hook checks if the user had already predicted before.
 * User hasn't predicted before if:
 *  - TradeWallet isn't created
 *  - Outcome token balances are zero. Checks for Invalid token too in case user sold the UP/DOWN tokens
 * @returns If user has already predicted before
 * @remarks Persists the status in localStorage
 */
export const useFirstPredictionStatus = ({
  tradeExecutor,
  outcomeTokenBalances,
}: UseFirstPredictionStatusArgs) => {
  const [storedHasPredicted, setStoredHasPredicted] = useLocalStorage<boolean>(
    STORAGE_KEY,
    false,
  );

  const hasOnChainPrediction = useMemo(() => {
    if (!tradeExecutor) return false;
    if (!outcomeTokenBalances) return false;

    return outcomeTokenBalances.some((val) => val > 0n);
  }, [tradeExecutor, outcomeTokenBalances]);

  // once true => always true
  useEffect(() => {
    if (hasOnChainPrediction && !storedHasPredicted) {
      setStoredHasPredicted(true);
    }
  }, [hasOnChainPrediction, storedHasPredicted, setStoredHasPredicted]);

  const hasPredictedBefore = storedHasPredicted || hasOnChainPrediction;

  return {
    hasPredictedBefore,
    isFirstPrediction: !hasPredictedBefore,
    setStoredHasPredicted,
  };
};
