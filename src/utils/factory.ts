import type { Address } from "viem";
import { parseEther } from "viem";

import type {
  ChildForm,
  ChildSharedForm,
  DeployStep,
  ParentForm,
} from "@/store/factory";

import type { SeerChildMarketSnapshotFields } from "@/utils/seerMarketReads";

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
  multiCategoricalParent: boolean;
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
  shared: ChildSharedForm,
  index: number,
): ChildScalarConfig => ({
  parentOutcomeIndex: BigInt(index),
  marketName: c.marketName,
  outcomeLabelLow: shared.outcomeLabelLow,
  outcomeLabelHigh: shared.outcomeLabelHigh,
  tokenNameLow: shared.tokenNameLow,
  tokenNameHigh: shared.tokenNameHigh,
  lowerBound: safeBigInt(shared.lowerBound),
  upperBound: safeBigInt(shared.upperBound),
  minBond: safeParseEther(shared.minBond),
  openingTime: shared.openingTime,
  category: shared.category,
  lang: shared.lang,
});

export const buildChildBatch = (
  children: ChildForm[],
  shared: ChildSharedForm,
  startIndex: number,
  endIndex: number,
): ChildScalarConfig[] =>
  children
    .slice(startIndex, endIndex)
    .map((child, i) => buildChildConfig(child, shared, startIndex + i));

/**
 * Validates the form values against constraints enforced by Seer + the factory:
 * - 2+ outcomes, tokenNames length matches outcomes + 1 invalid slot
 * - non-empty market/outcome/token labels
 * - wrapped token tickers ≤ 31 bytes (Seer enforces this on the wrapped ERC20 names)
 * - shared scalar `lowerBound < upperBound` and `upperBound < type(uint256).max - 2`
 * Returns a single human-readable error or undefined when the form is valid.
 */
export const validateFactoryForm = (
  parent: ParentForm,
  children: ChildForm[],
  shared: ChildSharedForm,
): string | undefined => {
  if (!parent.marketName.trim()) return "Parent market name is required";
  if (!parent.childQuestionTemplate.trim())
    return "Child question template is required";
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

  if (!shared.outcomeLabelLow.trim() || !shared.outcomeLabelHigh.trim())
    return "Shared settings: both outcome labels are required";
  if (!shared.tokenNameLow.trim() || !shared.tokenNameHigh.trim())
    return "Shared settings: both token names are required";
  if (new TextEncoder().encode(shared.tokenNameLow).length > 31)
    return "Shared settings: low token name exceeds 31 bytes";
  if (new TextEncoder().encode(shared.tokenNameHigh).length > 31)
    return "Shared settings: high token name exceeds 31 bytes";

  let low: bigint;
  let high: bigint;
  try {
    low = safeBigInt(shared.lowerBound);
    high = safeBigInt(shared.upperBound);
  } catch (e) {
    return `Shared settings: ${(e as Error).message}`;
  }
  if (low >= high)
    return "Shared settings: lower bound must be less than upper bound";
  if (high >= (1n << 256n) - 3n)
    return "Shared settings: upper bound is too large";

  for (let i = 0; i < children.length; i++) {
    if (!children[i].marketName.trim())
      return `Child ${i + 1}: market name is required`;
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
  /** From `Market.parentWrappedOutcome` (collateral for this branch); lowercase */
  underlyingToken?: string;
  downToken?: string;
  upToken?: string;
  invalidToken?: string;
  /** `Market.parentOutcome()` as decimal string */
  parentOutcome?: string;
  conditionId?: string;
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
    parentMarketKind: ParentForm["parentMarketKind"];
    name: string;
    outcomes: string[];
    tokenNames: string[];
    category: string;
    lang: string;
    minBond: string;
    openingTime: number;
    childQuestionTemplate: string;
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
  childShared: ChildSharedForm;
  steps: DeployStep[];
  deployer?: Address;
  childMarketChain?: readonly (SeerChildMarketSnapshotFields | null)[];
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
    parentMarketKind: args.parent.parentMarketKind,
    name: args.parent.marketName,
    outcomes: [...args.parent.outcomes],
    tokenNames: [...args.parent.tokenNames],
    category: args.parent.category,
    lang: args.parent.lang,
    minBond: args.parent.minBond,
    openingTime: args.parent.openingTime,
    childQuestionTemplate: args.parent.childQuestionTemplate,
  },
  markets: args.children.map((child, index) => {
    const chain = args.childMarketChain?.[index];
    const base: SessionSnapshotMarket = {
      name: child.marketName,
      marketId: args.childMarkets[index],
      parentMarketOutcome: index,
      minValue: Number(args.childShared.lowerBound),
      maxValue: Number(args.childShared.upperBound),
      outcomeLabels: {
        low: args.childShared.outcomeLabelLow,
        high: args.childShared.outcomeLabelHigh,
      },
      tokenNames: {
        low: args.childShared.tokenNameLow,
        high: args.childShared.tokenNameHigh,
      },
      minBond: args.childShared.minBond,
      openingTime: args.childShared.openingTime,
      category: args.childShared.category,
      lang: args.childShared.lang,
    };
    if (!chain) return base;
    return {
      ...base,
      underlyingToken: chain.underlyingToken,
      downToken: chain.downToken,
      upToken: chain.upToken,
      invalidToken: chain.invalidToken,
      parentOutcome: chain.parentOutcome,
      conditionId: chain.conditionId,
    };
  }),
});
