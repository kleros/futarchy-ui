import React from "react";

import { Accordion, Card, Tag } from "@kleros/ui-components-library";
import clsx from "clsx";

import {
  PHASED_CHILD_BATCH_SIZE,
  PHASED_THRESHOLD,
  useFactoryStore,
} from "@/store/factory";

import ChildFields from "./ChildFields";

const ChildrenForm: React.FC = () => {
  const outcomes = useFactoryStore((s) => s.parent.outcomes);
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
            index. Bounds and labels follow Seer&apos;s scalar template.
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
