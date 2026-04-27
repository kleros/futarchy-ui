import type { Address } from "viem";
import { create } from "zustand";

export interface ParentForm {
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
}

export interface ChildForm {
  marketName: string;
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

const DEFAULT_OPENING_TIME = 2_000_000_000;

const makeChild = (label = "Outcome"): ChildForm => ({
  marketName: `Score if ${label} wins (0-10)`,
  outcomeLabelLow: "DOWN",
  outcomeLabelHigh: "UP",
  tokenNameLow: `${label.toUpperCase()}_DN`,
  tokenNameHigh: `${label.toUpperCase()}_UP`,
  lowerBound: "0",
  upperBound: "10",
  minBond: "1",
  openingTime: DEFAULT_OPENING_TIME,
  category: "movies",
  lang: "en",
});

const initialParent = (): ParentForm => ({
  marketName: "Which movie wins the weekend?",
  outcomes: ["Movie A", "Movie B"],
  tokenNames: ["MVA", "MVB", ""],
  category: "movies",
  lang: "en",
  minBond: "1",
  openingTime: DEFAULT_OPENING_TIME,
});

const initialChildren = (): ChildForm[] => [makeChild("A"), makeChild("B")];

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
  children: initialChildren(),
  ...blankRuntime,

  setParentField: (key, value) =>
    set((state) => ({ parent: { ...state.parent, [key]: value } })),

  addOutcome: () =>
    set((state) => {
      const nextLetter = String.fromCharCode(65 + state.parent.outcomes.length);
      const nextLabel = `Movie ${nextLetter}`;
      return {
        parent: {
          ...state.parent,
          outcomes: [...state.parent.outcomes, nextLabel],
          tokenNames: [
            ...state.parent.tokenNames.slice(0, -1),
            `MV${nextLetter}`,
            "",
          ],
        },
        children: [...state.children, makeChild(nextLetter)],
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
    set((state) => ({
      parent: {
        ...state.parent,
        outcomes: state.parent.outcomes.map((o, i) =>
          i === index ? value : o,
        ),
      },
    })),

  updateTokenName: (index, value) =>
    set((state) => ({
      parent: {
        ...state.parent,
        tokenNames: state.parent.tokenNames.map((t, i) =>
          i === index ? value : t,
        ),
      },
    })),

  setChildField: (index, key, value) =>
    set((state) => ({
      children: state.children.map((c, i) =>
        i === index ? { ...c, [key]: value } : c,
      ),
    })),

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
