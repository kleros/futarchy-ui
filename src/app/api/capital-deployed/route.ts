export const revalidate = 60;

import { unstable_cache } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import {
  Address,
  createPublicClient,
  decodeFunctionData,
  fallback,
  Hex,
  http,
  isAddress,
} from "viem";

import { TradeExecutorAbi } from "@/contracts/abis/TradeExecutorAbi";
import { gnosisRouterAbi, gnosisRouterAddress } from "@/generated";

import { collateral, DEFAULT_CHAIN, GNOSIS_RPC } from "@/consts";
import { parentMarket } from "@/consts/markets";

// every prediction is funded by splitting collateral on the parent market, so the
// split events are the collateral the account committed to this session
const SPLIT_EVENT = "split";

type SeerPortfolioEvent = {
  type: string;
  collateral: Address;
  amount: string;
  transactionHash: Hex;
};

type SeerPortfolioPlResponse = {
  events?: SeerPortfolioEvent[];
};

export type CapitalDeployedResponse = {
  /** sDAI committed to the parent market, in wei */
  capitalDeployed: string;
};

const publicClient = createPublicClient({
  chain: DEFAULT_CHAIN,
  transport: fallback([
    http(GNOSIS_RPC, { batch: true }),
    http("https://rpc.gnosis.gateway.fm", { batch: true }),
  ]),
});

async function fetchParentMarketEvents(
  account: Address,
): Promise<SeerPortfolioEvent[]> {
  const params = new URLSearchParams({
    account,
    chainId: String(DEFAULT_CHAIN.id),
    period: "all",
    collateralProfile: "default",
    marketId: parentMarket,
  });

  const response = await fetch(
    `https://app.seer.pm/.netlify/functions/get-portfolio-pl?${params.toString()}`,
    { next: { revalidate: 60 } },
  );

  if (!response.ok) {
    throw new Error(`Seer portfolio request failed: ${response.status}`);
  }

  const portfolio: SeerPortfolioPlResponse = await response.json();

  if (!Array.isArray(portfolio.events)) {
    throw new Error("Seer portfolio response has no events");
  }

  return portfolio.events;
}

type BatchedCall = { to: Address; data: Hex };

function unwrapBatch(input: Hex): readonly BatchedCall[] {
  try {
    const { functionName, args } = decodeFunctionData({
      abi: TradeExecutorAbi,
      data: input,
    });
    // both batch entrypoints take the calls as their only argument
    if (functionName === "batchExecute" || functionName === "batchValueExecute")
      return (args as [readonly BatchedCall[]])[0];
  } catch {
    // not a trade wallet batch, treat the transaction as a single call
  }
  return [];
}

/**
 * Markets split on in a transaction. Sibling sessions can share a conditionId,
 * so the router argument is the only place the specific market is recorded.
 */
function splitMarkets(to: Address | null, input: Hex) {
  const batched = unwrapBatch(input);
  const calls = batched.length > 0 ? batched : [{ to, data: input }];
  const markets = new Set<string>();

  for (const call of calls) {
    if (call.to?.toLowerCase() !== gnosisRouterAddress.toLowerCase()) continue;
    try {
      const { functionName, args } = decodeFunctionData({
        abi: gnosisRouterAbi,
        data: call.data,
      });
      if (functionName === "splitPosition") markets.add(args[1].toLowerCase());
      else if (functionName === "splitFromBase")
        markets.add(args[0].toLowerCase());
    } catch {
      // unrelated router call
    }
  }

  return markets;
}

// a mined transaction's markets never change, so one decode serves every visitor
const splitMarketsOf = unstable_cache(
  async (hash: Hex) => {
    const { to, input } = await publicClient.getTransaction({ hash });
    return [...splitMarkets(to, input)];
  },
  ["capital-deployed-split-markets"],
  { revalidate: false },
);

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

export async function GET(req: NextRequest) {
  const tradeExecutor = req.nextUrl.searchParams.get("tradeExecutor");

  if (!tradeExecutor || !isAddress(tradeExecutor)) {
    return NextResponse.json(
      { error: "A valid tradeExecutor address is required" },
      { status: 400 },
    );
  }

  try {
    const events = await fetchParentMarketEvents(tradeExecutor);
    const market = parentMarket.toLowerCase();

    const splits = events.filter(
      (event) =>
        event.type === SPLIT_EVENT &&
        event.collateral.toLowerCase() === collateral.address.toLowerCase(),
    );
    const hashes = [
      ...new Set(splits.map((event) => event.transactionHash.toLowerCase())),
    ];
    const ours = new Set(
      (
        await Promise.all(
          hashes.map(async (hash) => ({
            hash,
            markets: await splitMarketsOf(hash as Hex),
          })),
        )
      )
        .filter(({ markets }) => markets.includes(market))
        .map(({ hash }) => hash),
    );

    // amounts come from the events rather than the calldata: splitFromBase is
    // paid in native xDAI, which is not the sDAI amount that ends up locked
    const capitalDeployed = splits.reduce(
      (total, event) =>
        ours.has(event.transactionHash.toLowerCase())
          ? total + BigInt(event.amount)
          : total,
      0n,
    );

    const res = NextResponse.json({
      capitalDeployed: capitalDeployed.toString(),
    } satisfies CapitalDeployedResponse);
    res.headers.set("Access-Control-Allow-Origin", "*");
    return res;
  } catch (error) {
    console.error("capital-deployed", error);
    return NextResponse.json(
      { error: "Failed to fetch capital deployed" },
      { status: 500 },
    );
  }
}
