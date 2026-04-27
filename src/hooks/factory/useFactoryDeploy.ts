import { useCallback } from "react";

import { useAccount } from "wagmi";

import {
  type DeployStep,
  PHASED_CHILD_BATCH_SIZE,
  PHASED_THRESHOLD,
  useFactoryStore,
} from "@/store/factory";

import {
  buildChildConfig,
  buildParentConfig,
  validateFactoryForm,
} from "@/utils/factory";
import { formatError } from "@/utils/formatError";

import { useDeployFutarchySession } from "./useDeployFutarchySession";
import { useDeploySessionChildBatch } from "./useDeploySessionChildBatch";
import { useOpenPhasedFutarchySession } from "./useOpenPhasedFutarchySession";

const PARENT_STEP_ID = "parent";
const ATOMIC_STEP_ID = "atomic";

const batchStepId = (i: number) => `batch-${i}`;

interface BatchPlan {
  start: number;
  end: number;
}

const planBatches = (childCount: number, batchSize: number): BatchPlan[] => {
  const plans: BatchPlan[] = [];
  for (let start = 0; start < childCount; start += batchSize) {
    plans.push({ start, end: Math.min(start + batchSize, childCount) });
  }
  return plans;
};

const batchTitle = (plan: BatchPlan, total: number) => {
  const human = `${plan.start + 1}–${plan.end}`;
  return `Deploy children ${human} of ${total}`;
};

/**
 * Orchestrates a futarchy session deployment.
 *
 * Atomic path (≤ {@link PHASED_THRESHOLD} children): one signature, one transaction.
 * Phased path (> {@link PHASED_THRESHOLD} children): one signature opens the parent,
 * then children are deployed in chunks of up to {@link PHASED_CHILD_BATCH_SIZE} per
 * `deploySessionChildBatch` call.
 *
 * Drives the {@link useFactoryStore} state machine for live UI feedback.
 */
export const useFactoryDeploy = () => {
  const atomicMutation = useDeployFutarchySession();
  const phasedOpenMutation = useOpenPhasedFutarchySession();
  const childBatchMutation = useDeploySessionChildBatch();
  const { address } = useAccount();

  const deploy = useCallback(async () => {
    const store = useFactoryStore.getState();
    const { parent, children } = store;

    const error = validateFactoryForm(parent, children);
    if (error) {
      store.setGlobalError(error);
      return;
    }
    if (!address) {
      store.setGlobalError("Connect a wallet to deploy.");
      return;
    }

    const parentConfig = buildParentConfig(parent);
    const childConfigs = children.map((c, i) => buildChildConfig(c, i));
    const isPhased = children.length > PHASED_THRESHOLD;
    const mode = isPhased ? "phased" : "atomic";
    const batchPlans = isPhased
      ? planBatches(childConfigs.length, PHASED_CHILD_BATCH_SIZE)
      : [];

    const initialSteps: DeployStep[] = isPhased
      ? [
          {
            id: PARENT_STEP_ID,
            title: "Open phased session",
            description:
              "Deploys the parent categorical market. One signature.",
            status: "pending",
          },
          ...batchPlans.map(
            (plan, i): DeployStep => ({
              id: batchStepId(i),
              title: batchTitle(plan, childConfigs.length),
              description:
                plan.end - plan.start === 1
                  ? `Scalar market for "${parent.outcomes[plan.start] ?? `outcome ${plan.start}`}"`
                  : `${plan.end - plan.start} scalar markets in one transaction.`,
              status: "pending",
            }),
          ),
        ]
      : [
          {
            id: ATOMIC_STEP_ID,
            title: "Deploy futarchy session",
            description: `Parent + ${childConfigs.length} child markets in one transaction.`,
            status: "pending",
          },
        ];

    store.resetDeployment();
    store.setMode(mode);
    store.setSteps(initialSteps);
    store.setIsDeploying(true);

    try {
      if (!isPhased) {
        store.updateStep(ATOMIC_STEP_ID, { status: "running" });
        const result = await atomicMutation.mutateAsync({
          parent: parentConfig,
          children: childConfigs,
        });
        store.setSessionInfo({
          sessionId: result.sessionId.toString(),
          parentMarket: result.parentMarket,
        });
        store.appendChildMarkets(result.childMarkets);
        store.updateStep(ATOMIC_STEP_ID, {
          status: "success",
          txHash: result.hash,
        });
      } else {
        store.updateStep(PARENT_STEP_ID, { status: "running" });
        const opened = await phasedOpenMutation.mutateAsync({
          parent: parentConfig,
          children: childConfigs,
        });
        store.setSessionInfo({
          sessionId: opened.sessionId.toString(),
          parentMarket: opened.parentMarket,
        });
        store.updateStep(PARENT_STEP_ID, {
          status: "success",
          txHash: opened.hash,
        });

        for (let i = 0; i < batchPlans.length; i++) {
          const plan = batchPlans[i];
          const stepId = batchStepId(i);
          store.updateStep(stepId, { status: "running" });
          const batch = await childBatchMutation.mutateAsync({
            sessionId: opened.sessionId,
            batch: childConfigs.slice(plan.start, plan.end),
          });
          store.appendChildMarkets(batch.childMarkets);
          store.updateStep(stepId, {
            status: "success",
            txHash: batch.hash,
          });
        }
      }
    } catch (e) {
      const message =
        formatError(e instanceof Error ? e : new Error(String(e))) ??
        "Deployment failed.";

      const currentSteps = useFactoryStore.getState().steps;
      const failingStep = currentSteps.find((s) => s.status === "running");
      if (failingStep) {
        store.updateStep(failingStep.id, {
          status: "error",
          error: message,
        });
      }
      store.setGlobalError(message);
    } finally {
      useFactoryStore.getState().setIsDeploying(false);
    }
  }, [address, atomicMutation, phasedOpenMutation, childBatchMutation]);

  return { deploy };
};
