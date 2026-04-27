import type { Address } from "viem";
import { parseEther } from "viem";

import type { ChildForm, DeployStep, ParentForm } from "@/store/factory";

export interface ParentCategoricalConfig {
  marketName: string;
  outcomes: readonly string[];
  tokenNames: readonly string[];
  category: string;
  lang: string;
  minBond: bigint;
  openingTime: number;
}

export interface ChildScalarConfig {
  parentOutcomeIndex: bigint;
  marketName: string;
  outcomeLabelLow: string;
  outcomeLabelHigh: string;
  tokenNameLow: string;
  tokenNameHigh: string;
  lowerBound: bigint;
  upperBound: bigint;
  minBond: bigint;
  openingTime: number;
  category: string;
  lang: string;
}

export interface DeployFutarchySessionParams {
  parent: ParentCategoricalConfig;
  children: readonly ChildScalarConfig[];
}

const safeParseEther = (value: string) =>
  parseEther((value || "0").trim() as `${number}`);

const safeBigInt = (value: string) => {
  const trimmed = (value || "0").trim();
  if (!/^-?\d+$/.test(trimmed)) {
    throw new Error(`Bound "${value}" is not a whole number.`);
  }
  return BigInt(trimmed);
};

export const buildParentConfig = (p: ParentForm): ParentCategoricalConfig => ({
  marketName: p.marketName,
  outcomes: p.outcomes,
  tokenNames: p.tokenNames,
  category: p.category,
  lang: p.lang,
  minBond: safeParseEther(p.minBond),
  openingTime: p.openingTime,
});

export const buildChildConfig = (
  c: ChildForm,
  index: number,
): ChildScalarConfig => ({
  parentOutcomeIndex: BigInt(index),
  marketName: c.marketName,
  outcomeLabelLow: c.outcomeLabelLow,
  outcomeLabelHigh: c.outcomeLabelHigh,
  tokenNameLow: c.tokenNameLow,
  tokenNameHigh: c.tokenNameHigh,
  lowerBound: safeBigInt(c.lowerBound),
  upperBound: safeBigInt(c.upperBound),
  minBond: safeParseEther(c.minBond),
  openingTime: c.openingTime,
  category: c.category,
  lang: c.lang,
});

export const buildChildBatch = (
  children: ChildForm[],
  startIndex: number,
  endIndex: number,
): ChildScalarConfig[] =>
  children
    .slice(startIndex, endIndex)
    .map((child, i) => buildChildConfig(child, startIndex + i));

/**
 * Validates the form values against constraints enforced by Seer + the factory:
 * - 2+ outcomes, tokenNames length matches outcomes + 1 invalid slot
 * - non-empty market/outcome/token labels
 * - wrapped token tickers ≤ 31 bytes (Seer enforces this on the wrapped ERC20 names)
 * - scalar `lowerBound < upperBound` and `upperBound < type(uint256).max - 2`
 * Returns a single human-readable error or undefined when the form is valid.
 */
export const validateFactoryForm = (
  parent: ParentForm,
  children: ChildForm[],
): string | undefined => {
  if (!parent.marketName.trim()) return "Parent market name is required";
  if (parent.outcomes.length < 2) return "Add at least two parent outcomes";
  if (parent.tokenNames.length !== parent.outcomes.length + 1)
    return "Token names must match outcomes (plus one invalid slot)";

  for (let i = 0; i < parent.outcomes.length; i++) {
    if (!parent.outcomes[i].trim()) return `Outcome ${i + 1} label is required`;
    if (!parent.tokenNames[i].trim()) return `Token name ${i + 1} is required`;
    if (new TextEncoder().encode(parent.tokenNames[i]).length > 31)
      return `Token name "${parent.tokenNames[i]}" exceeds 31 bytes`;
  }

  if (children.length !== parent.outcomes.length)
    return "Children count must equal parent outcome count";

  const upperBoundCeiling = (1n << 256n) - 3n;
  for (let i = 0; i < children.length; i++) {
    const c = children[i];
    if (!c.marketName.trim()) return `Child ${i + 1}: market name is required`;
    if (!c.outcomeLabelLow.trim() || !c.outcomeLabelHigh.trim())
      return `Child ${i + 1}: both outcome labels are required`;
    if (!c.tokenNameLow.trim() || !c.tokenNameHigh.trim())
      return `Child ${i + 1}: both token names are required`;
    if (new TextEncoder().encode(c.tokenNameLow).length > 31)
      return `Child ${i + 1}: low token name exceeds 31 bytes`;
    if (new TextEncoder().encode(c.tokenNameHigh).length > 31)
      return `Child ${i + 1}: high token name exceeds 31 bytes`;

    let low: bigint;
    let high: bigint;
    try {
      low = safeBigInt(c.lowerBound);
      high = safeBigInt(c.upperBound);
    } catch (e) {
      return `Child ${i + 1}: ${(e as Error).message}`;
    }
    if (low >= high)
      return `Child ${i + 1}: lower bound must be less than upper bound`;
    if (high >= upperBoundCeiling)
      return `Child ${i + 1}: upper bound is too large`;
  }
  return undefined;
};

export interface SessionSnapshotMarket {
  name: string;
  marketId: Address;
  parentMarketOutcome: number;
  minValue: number;
  maxValue: number;
  outcomeLabels: { low: string; high: string };
  tokenNames: { low: string; high: string };
  minBond: string;
  openingTime: number;
  category: string;
  lang: string;
}

export interface SessionSnapshot {
  session: {
    id: string;
    factory: Address;
    chainId: number;
    deployedAt: number;
    deployer?: Address;
    transactions: { step: string; hash: `0x${string}` }[];
  };
  parent: {
    marketId: Address;
    name: string;
    outcomes: string[];
    tokenNames: string[];
    category: string;
    lang: string;
    minBond: string;
    openingTime: number;
  };
  markets: SessionSnapshotMarket[];
}

export const buildSessionSnapshot = (args: {
  factory: Address;
  chainId: number;
  sessionId: string;
  parentMarket: Address;
  childMarkets: Address[];
  parent: ParentForm;
  children: ChildForm[];
  steps: DeployStep[];
  deployer?: Address;
}): SessionSnapshot => ({
  session: {
    id: args.sessionId,
    factory: args.factory,
    chainId: args.chainId,
    deployedAt: Math.floor(Date.now() / 1000),
    deployer: args.deployer,
    transactions: args.steps
      .filter(
        (s): s is DeployStep & { txHash: `0x${string}` } =>
          s.status === "success" && !!s.txHash,
      )
      .map((s) => ({ step: s.title, hash: s.txHash })),
  },
  parent: {
    marketId: args.parentMarket,
    name: args.parent.marketName,
    outcomes: [...args.parent.outcomes],
    tokenNames: [...args.parent.tokenNames],
    category: args.parent.category,
    lang: args.parent.lang,
    minBond: args.parent.minBond,
    openingTime: args.parent.openingTime,
  },
  markets: args.children.map((child, index) => ({
    name: child.marketName,
    marketId: args.childMarkets[index],
    parentMarketOutcome: index,
    minValue: Number(child.lowerBound),
    maxValue: Number(child.upperBound),
    outcomeLabels: {
      low: child.outcomeLabelLow,
      high: child.outcomeLabelHigh,
    },
    tokenNames: { low: child.tokenNameLow, high: child.tokenNameHigh },
    minBond: child.minBond,
    openingTime: child.openingTime,
    category: child.category,
    lang: child.lang,
  })),
});
