import React from "react";

import clsx from "clsx";

interface DateTimeInputProps {
  value: number;
  onChange: (unixSeconds: number) => void;
  isDisabled?: boolean;
}

const toLocalInputValue = (unixSeconds: number) => {
  if (!unixSeconds || Number.isNaN(unixSeconds)) return "";
  const date = new Date(unixSeconds * 1000);
  if (Number.isNaN(date.getTime())) return "";
  const tz = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - tz).toISOString().slice(0, 16);
};

const DateTimeInput: React.FC<DateTimeInputProps> = ({
  value,
  onChange,
  isDisabled,
}) => (
  <input
    type="datetime-local"
    value={toLocalInputValue(value)}
    disabled={isDisabled}
    onChange={(e) => {
      const next = e.target.valueAsNumber;
      if (Number.isNaN(next)) return;
      onChange(Math.floor(next / 1000));
    }}
    className={clsx(
      "border-klerosUIComponentsStroke rounded-base h-11.25 w-full border px-3",
      "bg-klerosUIComponentsWhiteBackground text-klerosUIComponentsPrimaryText text-sm",
      "focus:border-klerosUIComponentsPrimaryBlue focus:outline-none",
      "disabled:opacity-60",
    )}
  />
);

export default DateTimeInput;
