import type { PublicClient } from "viem";

export const GNOSIS_BLOCK_GAS_LIMIT = 17_000_000n;

/** Buffer multiplier for gas estimation (20% ) */
const GAS_BUFFER_MULTIPLIER = 1.2;

/**
 * Computes a gas limit with buffer, capped at the Gnosis block gas limit.
 */
export function getGasLimitWithBuffer(estimatedGas: bigint) {
  const withBuffer =
    (estimatedGas * BigInt(Math.floor(GAS_BUFFER_MULTIPLIER * 100))) / 100n;
  return withBuffer > GNOSIS_BLOCK_GAS_LIMIT
    ? GNOSIS_BLOCK_GAS_LIMIT
    : withBuffer;
}

type EstimateGasParams = Parameters<PublicClient["estimateContractGas"]>[0];

/**
 * Estimates gas for a contract call, applies buffer, and caps at Gnosis block limit.
 * Returns undefined if estimation fails (should fall back to wallet default).
 */
export async function estimateGasWithBuffer(
  publicClient: PublicClient,
  params: EstimateGasParams,
) {
  try {
    const estimated = await publicClient.estimateContractGas(params);
    return getGasLimitWithBuffer(estimated);
  } catch {
    return undefined;
  }
}
