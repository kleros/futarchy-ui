import React from "react";

import { TextField } from "@kleros/ui-components-library";

import { useFactoryStore } from "@/store/factory";

import Field from "./Field";

interface ChildFieldsProps {
  index: number;
}

const ChildFields: React.FC<ChildFieldsProps> = ({ index }) => {
  const marketName = useFactoryStore((s) => s.children[index]?.marketName);
  const outcome = useFactoryStore((s) => s.parent.outcomes[index]);
  const set = useFactoryStore((s) => s.setChildField);
  const isDeploying = useFactoryStore((s) => s.isDeploying);

  if (marketName === undefined) return null;

  return (
    <Field
      label={`Child ${index + 1} · ${outcome || `Outcome ${index}`}`}
      tooltip="Filled from the template and this child’s parent outcome + ticker. You can edit it directly; it will refresh if you change the template, outcome label, or ticker."
    >
      <TextField
        aria-label={`child-${index}-name`}
        value={marketName}
        onChange={(v) => set(index, "marketName", v)}
        isDisabled={isDeploying}
        placeholder="IMDb score if A is watched (0-10)"
      />
    </Field>
  );
};

export default ChildFields;
