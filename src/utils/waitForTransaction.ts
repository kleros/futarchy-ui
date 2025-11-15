import { waitForTransactionReceipt } from "@wagmi/core";

import { config } from "@/wagmiConfig";

type TransactionFn = () => Promise<`0x${string}` | undefined>;

export type TransactionResult =
  | {
      status: true;
      hash: `0x${string}`;
    }
  | {
      status: false;
      hash?: `0x${string}`;
      error: Error;
    };

/**
 * Wraps a wagmi write contract call to wait for the transaction to be confirmed.
 * @param transactionFn A function that calls wagmi's writeContract or writeContractAsync and
 *                      returns a promise for the transaction hash.
 * @returns A promise that resolves with the transaction result.
 */
export const waitForTransaction = async (
  transactionFn: TransactionFn,
): Promise<TransactionResult> => {
  try {
    const hash = await transactionFn();

    if (!hash) {
      const error = new Error("Transaction failed to send or was rejected.");
      return { status: false, error };
    }

    const receipt = await waitForTransactionReceipt(config, {
      hash,
      confirmations: 2,
    });

    if (receipt.status === "reverted") {
      const error = new Error("Transaction was reverted.");
      return { status: false, hash, error };
    }

    return { status: true, hash };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    const error =
      e instanceof Error ? e : new Error(String(e.shortMessage ?? e.message));
    return { status: false, error };
  }
};
