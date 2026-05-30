/**
 * Short USD strings for charts: `2M$`, `100k$`, `$400`.
 */
export function formatCompactUsd(value: number): string {
  const sign = value < 0 ? "-" : "";
  const absValue = Math.abs(value);

  if (absValue < 1000) {
    const amountText =
      absValue % 1 === 0 ? String(absValue) : absValue.toFixed(2);
    return `${sign}$${amountText}`;
  }

  let scaledPart: number;
  let unitSuffix: string;

  if (absValue >= 1_000_000_000) {
    scaledPart = absValue / 1_000_000_000;
    unitSuffix = "B$";
  } else if (absValue >= 1_000_000) {
    scaledPart = absValue / 1_000_000;
    unitSuffix = "M$";
  } else {
    scaledPart = absValue / 1000;
    unitSuffix = "k$";
    if (scaledPart >= 999.5) {
      scaledPart = absValue / 1_000_000;
      unitSuffix = "M$";
    }
  }

  const roundedText =
    scaledPart >= 100 || Math.abs(scaledPart - Math.round(scaledPart)) < 0.0001
      ? String(Math.round(scaledPart))
      : scaledPart >= 10
        ? scaledPart.toFixed(1).replace(/\.0$/, "")
        : scaledPart.toFixed(1).replace(/\.0$/, "");

  return `${sign}${roundedText}${unitSuffix}`;
}
