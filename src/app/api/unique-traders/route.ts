import { GraphQLClient } from "graphql-request";
import { type NextRequest, NextResponse } from "next/server";
import { type Address, isAddress } from "viem";

import {
  OrderDirection,
  Swap_OrderBy,
  getSdk as getSwaprSdk,
} from "@/hooks/liquidity/gql/gql";
import { getGraphUrl, getToken0Token1 } from "@/hooks/liquidity/utils";

const PAGE_SIZE = 1000;
const REVALIDATE_SECONDS = 300;

// Envio indexer behind Seer's app proxy (Hasura-style schema, addresses lowercase)
const SEER_SUBGRAPH_URL =
  process.env.SEER_SUBGRAPH_URL ??
  "https://app.seer.pm/subgraph?_subgraph=seer&_chainId=100";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export type UniqueTradersResponse = {
  uniqueTraders: number;
  traders: Address[];
};

type SeerChildMarket = {
  address: Address;
  outcomes: string[];
  parentOutcome: string;
  wrappedTokens: Address[];
};

type SeerParentMarket = {
  wrappedTokens: Address[];
  childMarkets: SeerChildMarket[];
};

const childMarketsQuery = /* GraphQL */ `
  query GetChildMarkets($parentMarket: String!) {
    Market(where: { address: { _eq: $parentMarket }, chainId: { _eq: 100 } }) {
      wrappedTokens
      childMarkets {
        address
        outcomes
        parentOutcome
        wrappedTokens
      }
    }
  }
`;

const conditionalEventsQuery = /* GraphQL */ `
  query GetConditionalEvents($marketIds: [String!], $cursor: String!) {
    ConditionalEvent(
      where: { market_id: { _in: $marketIds }, id: { _gt: $cursor } }
      order_by: { id: asc }
      limit: ${PAGE_SIZE}
    ) {
      id
      accountId
    }
  }
`;

async function querySeerSubgraph<T>(
  query: string,
  variables: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(SEER_SUBGRAPH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) {
    throw new Error(`Seer subgraph responded with ${res.status}`);
  }
  const { data, errors } = await res.json();
  if (errors?.length) {
    throw new Error(`Seer subgraph error: ${errors[0].message}`);
  }
  return data as T;
}

async function getSeerParentMarket(
  parentMarket: Address,
): Promise<SeerParentMarket | undefined> {
  const data = await querySeerSubgraph<{ Market: SeerParentMarket[] }>(
    childMarketsQuery,
    { parentMarket: parentMarket.toLowerCase() },
  );
  return data.Market?.[0];
}

// accounts that split/merged/redeemed on the parent or a child market; catches
// people who minted UP/DOWN tokens but never swapped them on a pool. the
// indexer attributes these events to the transaction sender, so like swap
// origins they are user EOAs, not routers or pools
async function getConditionalEventAccounts(marketIds: string[]) {
  const accounts = new Set<string>();
  let cursor = "";
  for (;;) {
    const { ConditionalEvent: events } = await querySeerSubgraph<{
      ConditionalEvent: { id: string; accountId: string }[];
    }>(conditionalEventsQuery, { marketIds, cursor });
    for (const event of events) {
      accounts.add(event.accountId.toLowerCase());
    }
    if (events.length < PAGE_SIZE) break;
    cursor = events[events.length - 1].id;
  }
  return accounts;
}

// each child scalar market trades its UP and DOWN tokens against the parent
// outcome token it is conditional on
function getChildTokenPairs(parent: SeerParentMarket) {
  return parent.childMarkets.flatMap((child) => {
    const underlying = parent.wrappedTokens[Number(child.parentOutcome)];
    const up = child.wrappedTokens[child.outcomes.indexOf("UP")];
    const down = child.wrappedTokens[child.outcomes.indexOf("DOWN")];
    if (!underlying || !up || !down) return [];
    return [getToken0Token1(underlying, up), getToken0Token1(underlying, down)];
  });
}

async function getSwapTraders(
  tokenPairs: ReturnType<typeof getChildTokenPairs>,
) {
  const subgraphUrl = getGraphUrl();
  if (!subgraphUrl.startsWith("http")) {
    throw new Error("Swapr subgraph URL is not configured");
  }

  const client = new GraphQLClient(subgraphUrl, {
    fetch: (url, options) =>
      fetch(url, { ...options, next: { revalidate: REVALIDATE_SECONDS } }),
  });
  const sdk = getSwaprSdk(client);

  const { pools } = await sdk.GetPools({
    where: {
      or: tokenPairs.map((pair) => ({
        token0: pair.token0.toLowerCase(),
        token1: pair.token1.toLowerCase(),
      })),
    },
    first: PAGE_SIZE,
  });
  const poolIds = pools.map((pool) => pool.id.toLowerCase());

  // a swap's origin is the EOA that sent the transaction, so unlike token
  // holders it never points at pools, routers or trade executors
  const traders = new Set<string>();
  let cursor = "";
  for (;;) {
    const { swaps } = await sdk.GetSwaps({
      where: { pool_in: poolIds, id_gt: cursor },
      orderBy: Swap_OrderBy.Id,
      orderDirection: OrderDirection.Asc,
      first: PAGE_SIZE,
    });
    for (const swap of swaps) {
      traders.add(swap.origin.toLowerCase());
    }
    if (swaps.length < PAGE_SIZE) break;
    cursor = swaps[swaps.length - 1].id;
  }

  return traders;
}

async function getUniqueTraders(parentMarket: Address) {
  const parent = await getSeerParentMarket(parentMarket);
  if (!parent) return undefined;

  const tokenPairs = getChildTokenPairs(parent);
  const marketIds = [
    parentMarket,
    ...parent.childMarkets.map((child) => child.address),
  ].map((address) => `100:${address.toLowerCase()}`);

  const [swapTraders, minters] = await Promise.all([
    tokenPairs.length > 0 ? getSwapTraders(tokenPairs) : new Set<string>(),
    getConditionalEventAccounts(marketIds),
  ]);

  return [...new Set([...swapTraders, ...minters])].sort() as Address[];
}

export async function GET(request: NextRequest) {
  const parentMarket = request.nextUrl.searchParams.get("parentMarket");
  if (!parentMarket || !isAddress(parentMarket)) {
    return NextResponse.json(
      { error: "parentMarket query param must be a valid address" },
      { status: 400 },
    );
  }

  try {
    const traders = await getUniqueTraders(parentMarket);
    if (traders === undefined) {
      return NextResponse.json({ error: "Market not found" }, { status: 404 });
    }

    const res = NextResponse.json({
      uniqueTraders: traders.length,
      traders,
    } satisfies UniqueTradersResponse);

    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set(
      "Netlify-CDN-Cache-Control",
      "public, max-age=60, stale-while-revalidate=300, durable",
    );
    res.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
    return res;
  } catch (error) {
    console.error("unique-traders", error);
    return NextResponse.json(
      { error: "Failed to fetch traders data" },
      { status: 500 },
    );
  }
}
