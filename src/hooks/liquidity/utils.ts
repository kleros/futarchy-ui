import { TickMath } from "@uniswap/v3-sdk";
import { BigNumber } from "ethers";
import { GraphQLClient } from "graphql-request";
import { Address, formatUnits } from "viem";

export function tickToPrice(
  tick: number,
  decimals = 18,
  keepPrecision = false,
) {
  const sqrtPriceX96 = BigInt(TickMath.getSqrtRatioAtTick(tick).toString());
  const bn = BigNumber.from(sqrtPriceX96);

  const TWO_POW_96 = BigNumber.from(2).pow(96);

  const price0 = bn
    .mul(bn) // square it
    .mul(BigNumber.from(10).pow(decimals))
    .div(TWO_POW_96)
    .div(TWO_POW_96)
    .toBigInt();
  const price1 = TWO_POW_96.mul(TWO_POW_96)
    .mul(BigNumber.from(10).pow(decimals))
    .div(bn)
    .div(bn)
    .toBigInt();
  if (keepPrecision) {
    return [formatUnits(price0, 18), formatUnits(price1, 18)];
  }
  return [
    Number(formatUnits(price0, 18)).toFixed(4),
    Number(formatUnits(price1, 18)).toFixed(4),
  ];
}

export function sqrtPriceX96ToPrice(
  sqrtPriceX96: bigint,
  decimals = 18,
  keepPrecision = false,
) {
  const bn = BigNumber.from(sqrtPriceX96);

  const TWO_POW_96 = BigNumber.from(2).pow(96);

  const price0 = bn
    .mul(bn) // square it
    .mul(BigNumber.from(10).pow(decimals))
    .div(TWO_POW_96)
    .div(TWO_POW_96)
    .toBigInt();
  const price1 = TWO_POW_96.mul(TWO_POW_96)
    .mul(BigNumber.from(10).pow(decimals))
    .div(bn)
    .div(bn)
    .toBigInt();
  if (keepPrecision) {
    return [formatUnits(price0, 18), formatUnits(price1, 18)];
  }
  return [
    Number(formatUnits(price0, 18)).toFixed(4),
    Number(formatUnits(price1, 18)).toFixed(4),
  ];
}

export function decimalToFraction(x: number): [string, string] {
  const str = x.toString();
  if (!str.includes(".")) return [String(x), "1"];
  const decimals = str.split(".")[1].length;
  const numerator = Math.round(x * 10 ** decimals);
  const denominator = 10 ** decimals;
  return [String(numerator), String(denominator)];
}

export const getGraphUrl = () => {
  const coreUrl =
    process.env.NEXT_PUBLIC_ALGEBRA_SUBGRAPH ??
    "Environment variables NEXT_PUBLIC_ALGEBRA_SUBGRAPH not set.";

  return coreUrl;
};

export const getSwaprClient = () => {
  return new GraphQLClient(getGraphUrl());
};

// ===
export interface Question {
  id: `0x${string}`;
  arbitrator: Address;
  opening_ts: number;
  timeout: number;
  finalize_ts: number;
  is_pending_arbitration: boolean;
  best_answer: `0x${string}`;
  bond: bigint;
  min_bond: bigint;
  base_question: `0x${string}`;
}

export type VerificationStatus =
  | "verified"
  | "verifying"
  | "challenged"
  | "not_verified";
export type VerificationResult = {
  status: VerificationStatus;
  itemID?: string;
  deadline?: number;
};
export type MarketOffChainFields = {
  factory?: Address;
  outcomesSupply: bigint;
  liquidityUSD: number;
  incentive: number;
  hasLiquidity: boolean;
  categories: string[];
  poolBalance: ({
    token0: {
      symbol: string;
      balance: number;
    };
    token1: {
      symbol: string;
      balance: number;
    };
  } | null)[];
  odds: (number | null)[];
  creator?: string | null;
  blockTimestamp?: number;
  verification?: VerificationResult;
  images?: { market: string; outcomes: string[] } | undefined;
  index?: number;
  url: string;
};

export enum MarketStatus {
  NOT_OPEN = "not_open",
  OPEN = "open",
  ANSWER_NOT_FINAL = "answer_not_final",
  IN_DISPUTE = "in_dispute",
  PENDING_EXECUTION = "pending_execution",
  CLOSED = "closed",
}

export type Market = MarketOffChainFields & {
  id: Address;
  type: "Generic" | "Futarchy";
  marketName: string;
  outcomes: readonly string[];
  collateralToken: Address;
  collateralToken1: Address;
  collateralToken2: Address;
  wrappedTokens: Address[];
  parentMarket: {
    id: Address;
    conditionId: `0x${string}`;
    payoutReported: boolean;
    payoutNumerators: readonly bigint[];
  };
  parentOutcome: bigint;
  //MarketView's outcomesSupply is buggy
  //outcomesSupply: bigint;
  parentCollectionId: `0x${string}`;
  conditionId: `0x${string}`;
  questionId: `0x${string}`;
  templateId: bigint;
  questions: readonly Question[];
  openingTs: number;
  finalizeTs: number;
  encodedQuestions: readonly string[];
  lowerBound: bigint;
  upperBound: bigint;
  payoutReported: boolean;
  payoutNumerators: readonly bigint[];
};

export type Token0Token1 = { token1: Address; token0: Address };

export function getToken0Token1(
  token0: Address,
  token1: Address,
): Token0Token1 {
  return token0.toLocaleLowerCase() > token1.toLocaleLowerCase()
    ? {
        token0: token1.toLocaleLowerCase() as Address,
        token1: token0.toLocaleLowerCase() as Address,
      }
    : {
        token0: token0.toLocaleLowerCase() as Address,
        token1: token1.toLocaleLowerCase() as Address,
      };
}

// outcome0 pairs with outcome2
// outcome1 pairs with outcome3
// outcome2 pairs with outcome0
// outcome3 pairs with outcome1
export const FUTARCHY_LP_PAIRS_MAPPING = [2, 3, 0, 1];

export function getLiquidityPair(
  market: Market,
  outcomeIndex: number,
): Token0Token1 {
  if (market.type === "Generic") {
    return getToken0Token1(
      market.wrappedTokens[outcomeIndex],
      market.collateralToken,
    );
  }

  return getToken0Token1(
    market.wrappedTokens[outcomeIndex],
    market.wrappedTokens[FUTARCHY_LP_PAIRS_MAPPING[outcomeIndex]],
  );
}

export function isTwoStringsEqual(
  str1: string | undefined | null,
  str2: string | undefined | null,
) {
  return (
    !!str1?.trim() &&
    str2?.trim()?.toLocaleLowerCase() === str1?.trim()?.toLocaleLowerCase()
  );
}
