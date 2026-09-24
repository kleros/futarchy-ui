import { NextResponse } from "next/server";
import {
  type Abi,
  type Address,
  createPublicClient,
  type Hex,
  http,
} from "viem";

import { MarketAbi } from "@/abi/Market";
import { DEFAULT_CHAIN, GNOSIS_RPC, getContractInfo } from "@/consts";
import { experimentChildMarkets } from "@/consts/experimentChildMarkets";
import { experiments } from "@/consts/experiments";

export const dynamic = "force-dynamic";

export type ExperimentRedeemStatus = {
  slug: string;
  parentMarket: string;
  isRedeemable: boolean;
};

export type RedeemableResponse = {
  anyRedeemable: boolean;
  experiments: ExperimentRedeemStatus[];
};

const router = getContractInfo("gnosisRouter");

const client = createPublicClient({
  chain: DEFAULT_CHAIN,
  transport: http(GNOSIS_RPC, { batch: true }),
});

const marketContract = (address: Address, functionName: string) =>
  ({ address, abi: MarketAbi, functionName }) as const;

const winningOutcomesContract = (conditionId: Hex) =>
  ({
    address: router.address,
    abi: router.abi as Abi,
    functionName: "getWinningOutcomes",
    args: [conditionId],
  }) as const;

type Experiment = { slug: string; parentMarket: Address };

type MarketIdentity = {
  conditionId: Hex;
  parentOutcome: number;
  parentMarket: Address;
};

/**
 * A market's identity is fixed at deployment, so a failed read means the
 * address is not a Seer market at all.
 */
async function readMarketIdentities(addresses: Address[]) {
  if (addresses.length === 0) return new Map<Address, MarketIdentity>();

  const results = await client.multicall({
    contracts: addresses.flatMap((address) => [
      marketContract(address, "conditionId"),
      marketContract(address, "parentOutcome"),
      marketContract(address, "parentMarket"),
    ]),
  });

  const identities = new Map<Address, MarketIdentity>();
  addresses.forEach((address, index) => {
    const [conditionId, parentOutcome, parentMarket] = results.slice(
      index * 3,
      index * 3 + 3,
    );
    if (
      conditionId.status !== "success" ||
      parentOutcome.status !== "success" ||
      parentMarket.status !== "success"
    ) {
      console.error(`redeemable: ${address} is not readable as a market`);
      return;
    }
    identities.set(address, {
      conditionId: conditionId.result as Hex,
      parentOutcome: Number(parentOutcome.result as bigint),
      parentMarket: (parentMarket.result as Address).toLowerCase() as Address,
    });
  });
  return identities;
}

// an unreported condition reads back as all-false rather than reverting
async function readWinningOutcomes(conditionIds: Hex[]) {
  if (conditionIds.length === 0) return new Map<Hex, boolean[]>();

  const results = await client.multicall({
    contracts: conditionIds.map(winningOutcomesContract),
  });

  const byConditionId = new Map<Hex, boolean[]>();
  conditionIds.forEach((conditionId, index) => {
    const result = results[index];
    byConditionId.set(
      conditionId,
      result.status === "success" ? (result.result as boolean[]) : [],
    );
  });
  return byConditionId;
}

async function getRedeemableSlugs(entries: Experiment[]) {
  // the child set is pinned per experiment; the chain supplies everything else
  const children = new Map(
    entries.map(({ slug }) => [slug, experimentChildMarkets[slug] ?? []]),
  );
  for (const [slug, addresses] of children) {
    if (addresses.length === 0) {
      console.error(`redeemable: ${slug} has no pinned child markets`);
    }
  }

  const identities = await readMarketIdentities([
    ...entries.map(({ parentMarket }) => parentMarket),
    ...[...children.values()].flat(),
  ]);

  const conditionIds = [...identities.values()].map(
    ({ conditionId }) => conditionId,
  );
  const winningOutcomes = await readWinningOutcomes([...new Set(conditionIds)]);

  const resolved = (conditionId: Hex) =>
    (winningOutcomes.get(conditionId) ?? []).some(Boolean);

  const redeemable = new Set<string>();
  for (const { slug, parentMarket } of entries) {
    const parent = identities.get(parentMarket);
    const pinned = children.get(slug) ?? [];
    if (!parent || pinned.length === 0) continue;

    const winners = new Set(
      (winningOutcomes.get(parent.conditionId) ?? []).flatMap((won, index) =>
        won ? [index] : [],
      ),
    );
    if (winners.size === 0) continue;

    // a child that drops out here would leave the experiment looking settled on
    // a short set, so any bad pin disqualifies the whole experiment
    const winningChildren: MarketIdentity[] = [];
    let pinsAreSound = true;
    for (const address of pinned) {
      const child = identities.get(address);
      if (!child || child.parentMarket !== parentMarket) {
        console.error(
          `redeemable: ${slug} pins ${address}, not one of its own`,
        );
        pinsAreSound = false;
        break;
      }
      if (winners.has(child.parentOutcome)) winningChildren.push(child);
    }
    if (!pinsAreSound) continue;

    // mirrors isMarketResolved: some outcome won, and every child under a
    // winning outcome has reported
    if (
      winningChildren.length > 0 &&
      winningChildren.every((child) => resolved(child.conditionId))
    ) {
      redeemable.add(slug);
    }
  }
  return redeemable;
}

export async function GET() {
  try {
    const redeemable = await getRedeemableSlugs(
      experiments.map(({ slug, parentMarket }) => ({
        slug,
        parentMarket: parentMarket.toLowerCase() as Address,
      })),
    );

    const statuses = experiments.map(({ slug, parentMarket }) => ({
      slug,
      parentMarket,
      isRedeemable: redeemable.has(slug),
    }));

    const res = NextResponse.json({
      anyRedeemable: statuses.some(({ isRedeemable }) => isRedeemable),
      experiments: statuses,
    } satisfies RedeemableResponse);

    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set(
      "Netlify-CDN-Cache-Control",
      "public, max-age=300, stale-while-revalidate=3600, durable",
    );
    res.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
    return res;
  } catch (error) {
    console.error("redeemable", error);
    return NextResponse.json(
      { error: "Failed to fetch redeem status" },
      { status: 500 },
    );
  }
}
