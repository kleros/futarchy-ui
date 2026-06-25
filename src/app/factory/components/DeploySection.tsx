import React, { useMemo } from "react";

import { AlertMessage, Button, Card } from "@kleros/ui-components-library";

import {
  PHASED_CHILD_BATCH_SIZE,
  PHASED_THRESHOLD,
  useFactoryStore,
} from "@/store/factory";

import { useFactoryDeploy } from "@/hooks/factory/useFactoryDeploy";

import { validateFactoryForm } from "@/utils/factory";

import DeploymentSteps from "./DeploymentSteps";
import SessionResult from "./SessionResult";

const DeploySection: React.FC = () => {
  const parent = useFactoryStore((s) => s.parent);
  const children = useFactoryStore((s) => s.children);
  const isDeploying = useFactoryStore((s) => s.isDeploying);
  const mode = useFactoryStore((s) => s.mode);
  const sessionId = useFactoryStore((s) => s.sessionId);
  const childMarkets = useFactoryStore((s) => s.childMarkets);
  const globalError = useFactoryStore((s) => s.globalError);
  const steps = useFactoryStore((s) => s.steps);
  const setGlobalError = useFactoryStore((s) => s.setGlobalError);
  const resetDeployment = useFactoryStore((s) => s.resetDeployment);
  const resetForm = useFactoryStore((s) => s.resetForm);

  const { deploy } = useFactoryDeploy();

  const validationError = useMemo(
    () => validateFactoryForm(parent, children),
    [parent, children],
  );

  const isPhased = children.length > PHASED_THRESHOLD;
  const phasedSignatures = isPhased
    ? 1 + Math.ceil(children.length / PHASED_CHILD_BATCH_SIZE)
    : 1;
  const isComplete =
    !!sessionId &&
    !isDeploying &&
    childMarkets.length === children.length &&
    steps.every((s) => s.status === "success");

  const buttonText = isDeploying
    ? mode === "phased"
      ? "Signing transactions…"
      : "Deploying…"
    : isPhased
      ? `Open & deploy (${phasedSignatures} signatures)`
      : "Deploy session";

  return (
    <Card
      round
      className="flex h-auto w-full flex-col gap-5 p-5 md:p-8"
      aria-label="deploy-section"
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-klerosUIComponentsPrimaryText text-lg font-semibold">
          Deploy
        </h2>
        <p className="text-klerosUIComponentsSecondaryText text-xs">
          {isPhased
            ? `More than ${PHASED_THRESHOLD} children: parent first, then up to ${PHASED_CHILD_BATCH_SIZE} children per signature.`
            : "All markets deployed in a single transaction."}
        </p>
      </div>

      {validationError && !isDeploying ? (
        <AlertMessage
          title="Fix before deploying"
          variant="warning"
          msg={validationError}
        />
      ) : null}

      {globalError ? (
        <AlertMessage
          title="Deployment error"
          variant="error"
          msg={globalError}
        />
      ) : null}

      {steps.length > 0 ? <DeploymentSteps /> : null}

      {isComplete ? <SessionResult /> : null}

      <div className="flex flex-wrap gap-3">
        <Button
          text={buttonText}
          onPress={() => {
            setGlobalError(undefined);
            void deploy();
          }}
          isLoading={isDeploying}
          isDisabled={isDeploying || !!validationError}
        />
        {!isDeploying && (steps.length > 0 || globalError) ? (
          <Button
            text="Reset deployment"
            variant="secondary"
            onPress={resetDeployment}
          />
        ) : null}
        {!isDeploying ? (
          <Button text="Reset form" variant="secondary" onPress={resetForm} />
        ) : null}
      </div>
    </Card>
  );
};

export default DeploySection;
