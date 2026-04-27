import React from "react";

import { NumberField, TextField } from "@kleros/ui-components-library";

import { useFactoryStore } from "@/store/factory";

import DateTimeInput from "./DateTimeInput";
import Field from "./Field";

interface ChildFieldsProps {
  index: number;
}

const ChildFields: React.FC<ChildFieldsProps> = ({ index }) => {
  const child = useFactoryStore((s) => s.children[index]);
  const set = useFactoryStore((s) => s.setChildField);
  const isDeploying = useFactoryStore((s) => s.isDeploying);

  if (!child) return null;

  return (
    <div className="flex w-full flex-col gap-4 px-1 py-3">
      <Field
        label="Scalar question"
        tooltip="Reality.eth question text for this child. Asked only if the parent resolves to this outcome."
      >
        <TextField
          aria-label={`child-${index}-name`}
          value={child.marketName}
          onChange={(v) => set(index, "marketName", v)}
          isDisabled={isDeploying}
          placeholder="IMDb score if A wins (0-10)"
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="Low outcome label"
          tooltip="Branch label for the lower scalar leg (e.g. DOWN)."
        >
          <TextField
            aria-label={`child-${index}-low-label`}
            value={child.outcomeLabelLow}
            onChange={(v) => set(index, "outcomeLabelLow", v)}
            isDisabled={isDeploying}
            placeholder="DOWN"
          />
        </Field>
        <Field
          label="High outcome label"
          tooltip="Branch label for the upper scalar leg (e.g. UP)."
        >
          <TextField
            aria-label={`child-${index}-high-label`}
            value={child.outcomeLabelHigh}
            onChange={(v) => set(index, "outcomeLabelHigh", v)}
            isDisabled={isDeploying}
            placeholder="UP"
          />
        </Field>
        <Field
          label="Low token ticker"
          tooltip="Wrapped ERC20 ticker for the low leg. Max 31 bytes."
        >
          <TextField
            aria-label={`child-${index}-low-token`}
            value={child.tokenNameLow}
            onChange={(v) => set(index, "tokenNameLow", v)}
            isDisabled={isDeploying}
            placeholder="A_SC_DN"
          />
        </Field>
        <Field
          label="High token ticker"
          tooltip="Wrapped ERC20 ticker for the high leg. Max 31 bytes."
        >
          <TextField
            aria-label={`child-${index}-high-token`}
            value={child.tokenNameHigh}
            onChange={(v) => set(index, "tokenNameHigh", v)}
            isDisabled={isDeploying}
            placeholder="A_SC_UP"
          />
        </Field>
        <Field
          label="Lower bound"
          tooltip="Numeric lower bound for the scalar range. Whole number, must be < upper bound."
        >
          <TextField
            aria-label={`child-${index}-lower-bound`}
            value={child.lowerBound}
            onChange={(v) => set(index, "lowerBound", v)}
            isDisabled={isDeploying}
            placeholder="0"
          />
        </Field>
        <Field
          label="Upper bound"
          tooltip="Numeric upper bound for the scalar range. Whole number, must satisfy upperBound < 2^256 - 2."
        >
          <TextField
            aria-label={`child-${index}-upper-bound`}
            value={child.upperBound}
            onChange={(v) => set(index, "upperBound", v)}
            isDisabled={isDeploying}
            placeholder="10"
          />
        </Field>
        <Field
          label="Min bond (xDAI)"
          tooltip="Reality.eth minimum bond for this child question."
        >
          <NumberField
            aria-label={`child-${index}-min-bond`}
            value={Number(child.minBond) || 0}
            onChange={(v) =>
              set(index, "minBond", Number.isNaN(v) ? "0" : String(v))
            }
            isDisabled={isDeploying}
            minValue={0}
          />
        </Field>
        <Field
          label="Opening time"
          tooltip="When Reality.eth opens this child question for answers."
        >
          <DateTimeInput
            value={child.openingTime}
            onChange={(v) => set(index, "openingTime", v)}
            isDisabled={isDeploying}
          />
        </Field>
        <Field label="Category" tooltip="Reality.eth metadata category.">
          <TextField
            aria-label={`child-${index}-category`}
            value={child.category}
            onChange={(v) => set(index, "category", v)}
            isDisabled={isDeploying}
            placeholder="movies"
          />
        </Field>
        <Field
          label="Language"
          tooltip="Reality.eth language code (ISO 639-1)."
        >
          <TextField
            aria-label={`child-${index}-lang`}
            value={child.lang}
            onChange={(v) => set(index, "lang", v)}
            isDisabled={isDeploying}
            placeholder="en"
          />
        </Field>
      </div>
    </div>
  );
};

export default ChildFields;
