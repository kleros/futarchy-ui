import React from "react";

import { Accordion, Card, Tag, TextField } from "@kleros/ui-components-library";
import clsx from "clsx";

import {
  PHASED_CHILD_BATCH_SIZE,
  PHASED_THRESHOLD,
  useFactoryStore,
} from "@/store/factory";

import ChildFields from "./ChildFields";
import Field from "./Field";

const ChildrenForm: React.FC = () => {
  const outcomes = useFactoryStore((s) => s.parent.outcomes);
  const childQuestionTemplate = useFactoryStore(
    (s) => s.parent.childQuestionTemplate,
  );
  const setParentField = useFactoryStore((s) => s.setParentField);
  const isDeploying = useFactoryStore((s) => s.isDeploying);
  const childrenCount = useFactoryStore((s) => s.children.length);
  const isPhased = childrenCount > PHASED_THRESHOLD;
  const phasedSignatures = isPhased
    ? 1 + Math.ceil(childrenCount / PHASED_CHILD_BATCH_SIZE)
    : 1;

  return (
    <Card
      round
      className="flex h-auto w-full flex-col gap-4 p-5 md:p-8"
      aria-label="children-form"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-klerosUIComponentsPrimaryText text-lg font-semibold">
            Scalar child markets
            <span className="text-klerosUIComponentsSecondaryText ml-2 text-sm font-normal">
              (one per parent outcome)
            </span>
          </h2>
          <p className="text-klerosUIComponentsSecondaryText text-xs">
            Each child is a scalar market bound to a single parent outcome
            index. Set one question template below; each child’s Reality text is
            built from its parent outcome label and ticker.
          </p>
        </div>
        <Tag
          text={
            isPhased
              ? `Phased deploy · ${phasedSignatures} signatures`
              : "Atomic deploy · 1 signature"
          }
          className={clsx(isPhased && "bg-klerosUIComponentsMediumBlue")}
        />
      </div>

      <Field
        label="Child question template"
        tooltip="Placeholders: ${outcome} or ${marketName} = that row’s parent outcome label; ${token} = its wrapped ticker (Outcomes section). Editing the template refreshes every child question. Editing one outcome or ticker updates only that child’s resolved question."
      >
        <TextField
          aria-label="child-question-template"
          value={childQuestionTemplate}
          onChange={(v) => setParentField("childQuestionTemplate", v)}
          isDisabled={isDeploying}
          placeholder="Score if ${outcome} is watched (0-10)"
        />
      </Field>

      <Accordion
        aria-label="children-accordion"
        className={clsx(
          "w-full max-w-full",
          "[&_#expand-button]:bg-klerosUIComponentsLightBackground",
          "[&_#expand-button_p]:font-semibold",
        )}
        items={outcomes.map((outcome, idx) => ({
          title: `Child ${idx + 1} · ${outcome || `Outcome ${idx}`}`,
          body: <ChildFields index={idx} />,
        }))}
      />
    </Card>
  );
};

export default ChildrenForm;
