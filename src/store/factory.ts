import type { Address } from "viem";
import { create } from "zustand";

import {
  applyChildQuestionTemplate,
  recomputeChildrenMarketNames,
} from "@/utils/childQuestionTemplate";

export type ParentMarketKind = "multicategorical" | "categorical";

export interface ParentForm {
  /** Single-winner categorical parent vs multi-select parent at Reality layer. */
  parentMarketKind: ParentMarketKind;
  marketName: string;
  outcomes: string[];
  /** length must be `outcomes.length + 1`; last slot is reserved for SER-INVALID and is left empty. */
  tokenNames: string[];
  category: string;
  lang: string;
  /** Reality `minBond` expressed as a decimal string in xDAI/ETH units. Parsed to wei before sending. */
  minBond: string;
  /** Reality `openingTime` as a unix timestamp (seconds). */
  openingTime: number;
  /**
   * Pattern for each scalar child’s Reality question. Use `${outcome}` or
   * `${marketName}` for the parent outcome label, `${token}` for its wrapped ticker.
   */
  childQuestionTemplate: string;
}

/**
 * Settings entered once and applied to every scalar child market. Only the
 * question text and the wrapped tickers differ per child; everything below is
 * identical across the session, so it lives here instead of on each child.
 */
export interface ChildSharedForm {
  outcomeLabelLow: string;
  outcomeLabelHigh: string;
  tokenNameLow: string;
  tokenNameHigh: string;
  /** Decimal string; parsed to bigint when sending. */
  lowerBound: string;
  upperBound: string;
  /** Reality `minBond` as a decimal string in xDAI/ETH units. Parsed to wei before sending. */
  minBond: string;
  openingTime: number;
  category: string;
  lang: string;
}

/** Per-child values. Everything else comes from {@link ChildSharedForm}. */
export interface ChildForm {
  marketName: string;
}

export type DeployStepStatus =
  | "pending"
  | "running"
  | "success"
  | "error"
  | "skipped";

export interface DeployStep {
  id: string;
  title: string;
  description?: string;
  status: DeployStepStatus;
  txHash?: `0x${string}`;
  error?: string;
}

export type DeployMode = "atomic" | "phased";

interface FactoryStore {
  parent: ParentForm;
  childShared: ChildSharedForm;
  children: ChildForm[];

  // ------------ runtime deployment state ------------
  mode?: DeployMode;
  isDeploying: boolean;
  steps: DeployStep[];
  sessionId?: string;
  parentMarket?: Address;
  childMarkets: Address[];
  globalError?: string;

  // ------------ form actions ------------
  setParentField: <K extends keyof ParentForm>(
    key: K,
    value: ParentForm[K],
  ) => void;
  addOutcome: () => void;
  removeOutcome: (index: number) => void;
  updateOutcome: (index: number, value: string) => void;
  updateTokenName: (index: number, value: string) => void;
  setChildField: <K extends keyof ChildForm>(
    index: number,
    key: K,
    value: ChildForm[K],
  ) => void;
  setChildSharedField: <K extends keyof ChildSharedForm>(
    key: K,
    value: ChildSharedForm[K],
  ) => void;

  // ------------ runtime actions ------------
  setMode: (mode: DeployMode | undefined) => void;
  setSteps: (steps: DeployStep[]) => void;
  updateStep: (id: string, partial: Partial<DeployStep>) => void;
  setIsDeploying: (value: boolean) => void;
  setSessionInfo: (info: {
    sessionId?: string;
    parentMarket?: Address;
  }) => void;
  appendChildMarkets: (addrs: Address[]) => void;
  setGlobalError: (error: string | undefined) => void;
  resetDeployment: () => void;
  resetForm: () => void;
}

const DAY_SECONDS = 86_400;

/**
 * Default Reality opening time: seven days out, snapped to the next UTC
 * midnight. Snapping keeps the value stable between the server prerender and
 * client hydration of the `datetime-local` input.
 */
const defaultOpeningTime = () =>
  (Math.floor(Date.now() / 1000 / DAY_SECONDS) + 7) * DAY_SECONDS;

const makeChild = (parent: ParentForm, outcomeIndex: number): ChildForm => ({
  marketName: applyChildQuestionTemplate(
    parent.childQuestionTemplate,
    parent.outcomes[outcomeIndex] ?? "",
    parent.tokenNames[outcomeIndex] ?? "",
  ),
});

const initialParent = (): ParentForm => ({
  parentMarketKind: "multicategorical",
  marketName: "Which movies should we watch this weekend?",
  outcomes: ["Movie A", "Movie B"],
  tokenNames: ["MVA", "MVB", ""],
  category: "movies",
  lang: "en",
  minBond: "1",
  openingTime: defaultOpeningTime(),
  childQuestionTemplate: "Score if ${outcome} is watched (0-10)",
});

const initialChildShared = (): ChildSharedForm => {
  const p = initialParent();
  return {
    outcomeLabelLow: "DOWN",
    outcomeLabelHigh: "UP",
    tokenNameLow: "DOWN",
    tokenNameHigh: "UP",
    lowerBound: "0",
    upperBound: "10",
    minBond: "1",
    openingTime: p.openingTime,
    category: p.category,
    lang: p.lang,
  };
};

const initialChildren = (): ChildForm[] => {
  const p = initialParent();
  return p.outcomes.map((_, i) => makeChild(p, i));
};

const blankRuntime = {
  mode: undefined as DeployMode | undefined,
  isDeploying: false,
  steps: [] as DeployStep[],
  sessionId: undefined as string | undefined,
  parentMarket: undefined as Address | undefined,
  childMarkets: [] as Address[],
  globalError: undefined as string | undefined,
};

export const useFactoryStore = create<FactoryStore>((set) => ({
  parent: initialParent(),
  childShared: initialChildShared(),
  children: initialChildren(),
  ...blankRuntime,

  setParentField: (key, value) =>
    set((state) => {
      const parent = { ...state.parent, [key]: value };
      const syncMeta =
        key === "category" || key === "lang" || key === "openingTime";
      const childShared = syncMeta
        ? { ...state.childShared, [key]: value }
        : state.childShared;
      const children =
        key === "childQuestionTemplate"
          ? recomputeChildrenMarketNames({
              template: parent.childQuestionTemplate,
              outcomes: parent.outcomes,
              tokenNames: parent.tokenNames,
              children: state.children,
            })
          : state.children;
      return { parent, childShared, children };
    }),

  addOutcome: () =>
    set((state) => {
      const idx = state.parent.outcomes.length;
      const nextLetter = String.fromCharCode(65 + idx);
      const nextLabel = `Movie ${nextLetter}`;
      const parent = {
        ...state.parent,
        outcomes: [...state.parent.outcomes, nextLabel],
        tokenNames: [
          ...state.parent.tokenNames.slice(0, -1),
          `MV${nextLetter}`,
          "",
        ],
      };
      return {
        parent,
        children: [...state.children, makeChild(parent, idx)],
      };
    }),

  removeOutcome: (index) =>
    set((state) => {
      if (state.parent.outcomes.length <= 2) return state;
      const outcomes = state.parent.outcomes.filter((_, i) => i !== index);
      const tokenNames = [
        ...state.parent.tokenNames.slice(0, -1).filter((_, i) => i !== index),
        "",
      ];
      const children = state.children.filter((_, i) => i !== index);
      return {
        parent: { ...state.parent, outcomes, tokenNames },
        children,
      };
    }),

  updateOutcome: (index, value) =>
    set((state) => {
      const parent = {
        ...state.parent,
        outcomes: state.parent.outcomes.map((o, i) =>
          i === index ? value : o,
        ),
      };
      const children = state.children.map((c, i) =>
        i === index
          ? {
              ...c,
              marketName: applyChildQuestionTemplate(
                parent.childQuestionTemplate,
                value,
                parent.tokenNames[index] ?? "",
              ),
            }
          : c,
      );
      return { parent, children };
    }),

  updateTokenName: (index, value) =>
    set((state) => {
      const parent = {
        ...state.parent,
        tokenNames: state.parent.tokenNames.map((t, i) =>
          i === index ? value : t,
        ),
      };
      const children = state.children.map((c, i) =>
        i === index
          ? {
              ...c,
              marketName: applyChildQuestionTemplate(
                parent.childQuestionTemplate,
                parent.outcomes[index] ?? "",
                value,
              ),
            }
          : c,
      );
      return { parent, children };
    }),

  setChildField: (index, key, value) =>
    set((state) => ({
      children: state.children.map((c, i) =>
        i === index ? { ...c, [key]: value } : c,
      ),
    })),

  setChildSharedField: (key, value) =>
    set((state) => ({ childShared: { ...state.childShared, [key]: value } })),

  setMode: (mode) => set({ mode }),

  setSteps: (steps) => set({ steps }),

  updateStep: (id, partial) =>
    set((state) => ({
      steps: state.steps.map((s) => (s.id === id ? { ...s, ...partial } : s)),
    })),

  setIsDeploying: (value) => set({ isDeploying: value }),

  setSessionInfo: (info) =>
    set((state) => ({
      sessionId: info.sessionId ?? state.sessionId,
      parentMarket: info.parentMarket ?? state.parentMarket,
    })),

  appendChildMarkets: (addrs) =>
    set((state) => ({ childMarkets: [...state.childMarkets, ...addrs] })),

  setGlobalError: (error) => set({ globalError: error }),

  resetDeployment: () => set({ ...blankRuntime }),

  resetForm: () =>
    set({
      parent: initialParent(),
      childShared: initialChildShared(),
      children: initialChildren(),
      ...blankRuntime,
    }),
}));

/** Sessions with more children than this are split: parent first, then children in batches. */
export const PHASED_THRESHOLD = 6;

/**
 * Maximum number of children deployed per `deploySessionChildBatch` call in phased mode.
 * Sized so each transaction fits roughly the same gas envelope as a 7-market atomic deploy
 * (1 parent + 6 children).
 */
export const PHASED_CHILD_BATCH_SIZE = 7;
