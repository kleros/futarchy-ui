import React from "react";

import {
  Button,
  Card,
  NumberField,
  TextField,
} from "@kleros/ui-components-library";
import clsx from "clsx";

import { useFactoryStore } from "@/store/factory";

import MinusIcon from "@/assets/svg/minus-outline.svg";
import PlusIcon from "@/assets/svg/plus-outline.svg";

import DateTimeInput from "./DateTimeInput";
import Field from "./Field";

const ParentForm: React.FC = () => {
  const parent = useFactoryStore((s) => s.parent);
  const setField = useFactoryStore((s) => s.setParentField);
  const addOutcome = useFactoryStore((s) => s.addOutcome);
  const removeOutcome = useFactoryStore((s) => s.removeOutcome);
  const updateOutcome = useFactoryStore((s) => s.updateOutcome);
  const updateTokenName = useFactoryStore((s) => s.updateTokenName);
  const isDeploying = useFactoryStore((s) => s.isDeploying);

  return (
    <Card
      round
      className="flex h-auto w-full flex-col gap-5 p-5 md:p-8"
      aria-label="parent-form"
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-klerosUIComponentsPrimaryText text-lg font-semibold">
          Parent categorical market
        </h2>
        <p className="text-klerosUIComponentsSecondaryText text-xs">
          Defines the high-level categorical question. Each outcome becomes one
          branch and the basis for a scalar child.
        </p>
      </div>

      <Field
        label="Market name"
        tooltip="The Reality question for the parent. Combined with outcomes + category + lang."
      >
        <TextField
          aria-label="market-name"
          value={parent.marketName}
          onChange={(v) => setField("marketName", v)}
          isDisabled={isDeploying}
          placeholder="Which movie wins the weekend?"
        />
      </Field>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-klerosUIComponentsPrimaryText text-sm font-semibold">
            Outcomes & wrapped tokens
            <span className="text-klerosUIComponentsSecondaryText ml-2 text-xs font-normal">
              ({parent.outcomes.length})
            </span>
          </span>
          <Button
            small
            variant="secondary"
            text="Add outcome"
            icon={<PlusIcon className="mr-1.5 size-4" />}
            onPress={addOutcome}
            isDisabled={isDeploying}
          />
        </div>

        <div className="flex flex-col gap-2">
          {parent.outcomes.map((outcome, idx) => (
            <div
              key={idx}
              className={clsx(
                "border-klerosUIComponentsStroke rounded-base border p-3",
                "flex flex-wrap items-end gap-3",
              )}
            >
              <Field
                label={`Outcome ${idx + 1}`}
                tooltip="Human-readable label that appears in the parent question."
                className="min-w-0 flex-1"
              >
                <TextField
                  aria-label={`outcome-${idx}`}
                  value={outcome}
                  onChange={(v) => updateOutcome(idx, v)}
                  isDisabled={isDeploying}
                  placeholder={`Movie ${String.fromCharCode(65 + idx)}`}
                />
              </Field>
              <Field
                label="Token ticker"
                tooltip="Wrapped ERC20 ticker for this outcome. Max 31 bytes."
                className="min-w-0 flex-1"
              >
                <TextField
                  aria-label={`token-name-${idx}`}
                  value={parent.tokenNames[idx] ?? ""}
                  onChange={(v) => updateTokenName(idx, v)}
                  isDisabled={isDeploying}
                  placeholder="MVA"
                />
              </Field>
              <Button
                small
                variant="secondary"
                aria-label={`remove-outcome-${idx}`}
                text=""
                icon={<MinusIcon className="size-4" />}
                onPress={() => removeOutcome(idx)}
                isDisabled={isDeploying || parent.outcomes.length <= 2}
                className="h-11.25"
              />
            </div>
          ))}
        </div>
        <p className="text-klerosUIComponentsSecondaryText text-xs">
          The last token slot is reserved for the invalid outcome (
          <code className="font-mono">SER-INVALID</code>) and is filled
          automatically by Seer.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="Category"
          tooltip="Reality.eth metadata category (e.g. 'movies', 'sports')."
        >
          <TextField
            aria-label="category"
            value={parent.category}
            onChange={(v) => setField("category", v)}
            isDisabled={isDeploying}
            placeholder="movies"
          />
        </Field>
        <Field
          label="Language"
          tooltip="Reality.eth question language code, ISO 639-1 (e.g. 'en')."
        >
          <TextField
            aria-label="lang"
            value={parent.lang}
            onChange={(v) => setField("lang", v)}
            isDisabled={isDeploying}
            placeholder="en"
          />
        </Field>
        <Field
          label="Min bond (xDAI)"
          tooltip="Minimum Reality.eth bond to submit or challenge an answer."
        >
          <NumberField
            aria-label="min-bond"
            value={Number(parent.minBond) || 0}
            onChange={(v) =>
              setField("minBond", Number.isNaN(v) ? "0" : String(v))
            }
            isDisabled={isDeploying}
            minValue={0}
          />
        </Field>
        <Field
          label="Opening time"
          tooltip="When Reality.eth begins accepting answers. Must be a future timestamp."
        >
          <DateTimeInput
            value={parent.openingTime}
            onChange={(v) => setField("openingTime", v)}
            isDisabled={isDeploying}
          />
        </Field>
      </div>
    </Card>
  );
};

export default ParentForm;
