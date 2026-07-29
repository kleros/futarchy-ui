import React from "react";

import {
  Card,
  NumberField,
  Tag,
  TextField,
} from "@kleros/ui-components-library";
import clsx from "clsx";

import {
  PHASED_CHILD_BATCH_SIZE,
  PHASED_THRESHOLD,
  useFactoryStore,
} from "@/store/factory";

import ChildFields from "./ChildFields";
import DateTimeInput from "./DateTimeInput";
import Field from "./Field";

const ChildrenForm: React.FC = () => {
  const outcomes = useFactoryStore((s) => s.parent.outcomes);
  const childQuestionTemplate = useFactoryStore(
    (s) => s.parent.childQuestionTemplate,
  );
  const setParentField = useFactoryStore((s) => s.setParentField);
  const shared = useFactoryStore((s) => s.childShared);
  const setShared = useFactoryStore((s) => s.setChildSharedField);
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
            index. Set one question template and one set of shared settings
            below; only the question text differs per child.
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

      <div className="border-klerosUIComponentsStroke rounded-base flex flex-col gap-4 border p-4">
        <div className="flex flex-col gap-1">
          <span className="text-klerosUIComponentsPrimaryText text-sm font-semibold">
            Shared child settings
          </span>
          <p className="text-klerosUIComponentsSecondaryText text-xs">
            Applied to every child market. Category, language and opening time
            follow the parent market unless you override them here.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field
            label="Low outcome label"
            tooltip="Branch label for the lower scalar leg (e.g. DOWN). Shared by all children."
          >
            <TextField
              aria-label="child-shared-low-label"
              value={shared.outcomeLabelLow}
              onChange={(v) => setShared("outcomeLabelLow", v)}
              isDisabled={isDeploying}
              placeholder="DOWN"
            />
          </Field>
          <Field
            label="High outcome label"
            tooltip="Branch label for the upper scalar leg (e.g. UP). Shared by all children."
          >
            <TextField
              aria-label="child-shared-high-label"
              value={shared.outcomeLabelHigh}
              onChange={(v) => setShared("outcomeLabelHigh", v)}
              isDisabled={isDeploying}
              placeholder="UP"
            />
          </Field>
          <Field
            label="Low token ticker"
            tooltip="Wrapped ERC20 ticker for the lower leg of every child. Max 31 bytes."
          >
            <TextField
              aria-label="child-shared-low-token"
              value={shared.tokenNameLow}
              onChange={(v) => setShared("tokenNameLow", v)}
              isDisabled={isDeploying}
              placeholder="DOWN"
            />
          </Field>
          <Field
            label="High token ticker"
            tooltip="Wrapped ERC20 ticker for the upper leg of every child. Max 31 bytes."
          >
            <TextField
              aria-label="child-shared-high-token"
              value={shared.tokenNameHigh}
              onChange={(v) => setShared("tokenNameHigh", v)}
              isDisabled={isDeploying}
              placeholder="UP"
            />
          </Field>
          <Field
            label="Lower bound"
            tooltip="Numeric lower bound for the scalar range, shared by all children. Whole number, must be < upper bound."
          >
            <TextField
              aria-label="child-shared-lower-bound"
              value={shared.lowerBound}
              onChange={(v) => setShared("lowerBound", v)}
              isDisabled={isDeploying}
              placeholder="0"
            />
          </Field>
          <Field
            label="Upper bound"
            tooltip="Numeric upper bound for the scalar range, shared by all children. Whole number, must satisfy upperBound < 2^256 - 2."
          >
            <TextField
              aria-label="child-shared-upper-bound"
              value={shared.upperBound}
              onChange={(v) => setShared("upperBound", v)}
              isDisabled={isDeploying}
              placeholder="10"
            />
          </Field>
          <Field
            label="Min bond (xDAI)"
            tooltip="Reality.eth minimum bond for every child question."
          >
            <NumberField
              aria-label="child-shared-min-bond"
              value={Number(shared.minBond) || 0}
              onChange={(v) =>
                setShared("minBond", Number.isNaN(v) ? "0" : String(v))
              }
              isDisabled={isDeploying}
              minValue={0}
            />
          </Field>
          <Field
            label="Opening time"
            tooltip="When Reality.eth opens every child question for answers. Defaults to the parent’s opening time."
          >
            <DateTimeInput
              value={shared.openingTime}
              onChange={(v) => setShared("openingTime", v)}
              isDisabled={isDeploying}
            />
          </Field>
          <Field
            label="Category"
            tooltip="Reality.eth metadata category for every child question."
          >
            <TextField
              aria-label="child-shared-category"
              value={shared.category}
              onChange={(v) => setShared("category", v)}
              isDisabled={isDeploying}
              placeholder="movies"
            />
          </Field>
          <Field
            label="Language"
            tooltip="Reality.eth language code (ISO 639-1) for every child question."
          >
            <TextField
              aria-label="child-shared-lang"
              value={shared.lang}
              onChange={(v) => setShared("lang", v)}
              isDisabled={isDeploying}
              placeholder="en"
            />
          </Field>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-klerosUIComponentsPrimaryText text-sm font-semibold">
          Scalar questions
          <span className="text-klerosUIComponentsSecondaryText ml-2 text-xs font-normal">
            ({outcomes.length})
          </span>
        </span>
        {outcomes.map((_, idx) => (
          <ChildFields key={idx} index={idx} />
        ))}
      </div>
    </Card>
  );
};

export default ChildrenForm;
