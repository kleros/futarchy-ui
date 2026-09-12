import { readContracts } from "@wagmi/core";
import type { Address } from "viem";

import { seerMarketAbi } from "@/contracts/abis/SeerMarketAbi";
import { config } from "@/wagmiConfig";

import { DEFAULT_CHAIN } from "@/consts";

/** Token metadata read from Seer `Market` for exporter / `markets.ts` integration. All hex addresses and `conditionId` lowercase. */
export interface SeerChildMarketSnapshotFields {
  underlyingToken: string;
  downToken: string;
  upToken: string;
  invalidToken: string;
  /** `Market.parentOutcome()` */
  parentOutcome: string;
  conditionId: string;
}

function decodeWrapped1155(slot: unknown): Address {
  if (Array.isArray(slot) && slot[0]) return slot[0] as Address;
  if (
    slot &&
    typeof slot === "object" &&
    "wrapped1155" in slot &&
    (slot as { wrapped1155: Address }).wrapped1155
  ) {
    return (slot as { wrapped1155: Address }).wrapped1155;
  }
  throw new Error("Unexpected wrappedOutcome return shape.");
}

function lowercaseAddress(a: Address): string {
  return a.toLowerCase();
}

function lowercaseBytes32(h: `0x${string}`): string {
  return h.toLowerCase();
}

const READS_PER_MARKET = 6;

const chainId = DEFAULT_CHAIN.id;

/** Batch-read each child scalar `Market`; order matches `childAddresses`. */
export async function fetchSeerChildMarketSnapshotFields(
  childAddresses: readonly Address[],
): Promise<(SeerChildMarketSnapshotFields | null)[]> {
  if (!childAddresses.length) return [];

  const contracts = childAddresses.flatMap((address) => [
    {
      address,
      abi: seerMarketAbi,
      chainId,
      functionName: "parentOutcome" as const,
    },
    {
      address,
      abi: seerMarketAbi,
      chainId,
      functionName: "parentWrappedOutcome" as const,
    },
    {
      address,
      abi: seerMarketAbi,
      chainId,
      functionName: "wrappedOutcome" as const,
      args: [0n],
    },
    {
      address,
      abi: seerMarketAbi,
      chainId,
      functionName: "wrappedOutcome" as const,
      args: [1n],
    },
    {
      address,
      abi: seerMarketAbi,
      chainId,
      functionName: "wrappedOutcome" as const,
      args: [2n],
    },
    {
      address,
      abi: seerMarketAbi,
      chainId,
      functionName: "conditionId" as const,
    },
  ]);

  const results = await readContracts(config, {
    contracts,
    allowFailure: true,
  });

  const out: (SeerChildMarketSnapshotFields | null)[] = [];

  for (let i = 0; i < childAddresses.length; i++) {
    const base = i * READS_PER_MARKET;
    const bundle = results.slice(base, base + READS_PER_MARKET);
    if (bundle.length !== READS_PER_MARKET) {
      out.push(null);
      continue;
    }

    try {
      if (bundle.some((r) => r.status !== "success")) {
        out.push(null);
        continue;
      }

      const parentOutcomeBn = bundle[0].result as bigint;
      const parentWrapped = decodeWrapped1155(bundle[1].result);
      const down = decodeWrapped1155(bundle[2].result);
      const up = decodeWrapped1155(bundle[3].result);
      const invalid = decodeWrapped1155(bundle[4].result);
      const conditionId = bundle[5].result as `0x${string}`;

      out.push({
        parentOutcome: parentOutcomeBn.toString(10),
        underlyingToken: lowercaseAddress(parentWrapped),
        downToken: lowercaseAddress(down),
        upToken: lowercaseAddress(up),
        invalidToken: lowercaseAddress(invalid),
        conditionId: lowercaseBytes32(conditionId),
      });
    } catch {
      out.push(null);
    }
  }

  return out;
}
