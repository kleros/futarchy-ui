/**
 * Substitutes placeholders in the scalar child Reality question template.
 * - `${outcome}` / `${marketName}` → parent outcome label for that child index
 * - `${token}` → parent wrapped token ticker for that outcome (invalid slot excluded)
 */
export function applyChildQuestionTemplate(
  template: string,
  outcomeLabel: string,
  parentOutcomeTokenTicker: string,
): string {
  return template
    .replaceAll("${outcome}", outcomeLabel)
    .replaceAll("${marketName}", outcomeLabel)
    .replaceAll("${MarketName}", outcomeLabel)
    .replaceAll("${token}", parentOutcomeTokenTicker);
}

export function recomputeChildrenMarketNames<
  T extends { marketName: string },
>(args: {
  template: string;
  outcomes: readonly string[];
  tokenNames: readonly string[];
  children: readonly T[];
}): T[] {
  const { template, outcomes, tokenNames, children } = args;
  return children.map((c, i) => ({
    ...c,
    marketName: applyChildQuestionTemplate(
      template,
      outcomes[i] ?? "",
      tokenNames[i] ?? "",
    ),
  }));
}
