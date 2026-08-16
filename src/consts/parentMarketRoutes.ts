import { experiments, type IExperiment } from "@/consts/experiments";

/** Every parent market address that resolves to an experiment, lowercase. */
export const parentMarketAddresses = experiments.map(
  (experiment) => experiment.parentMarket,
);

/**
 * Resolves a parent market address to its experiment. Case-insensitive, so a
 * checksummed address pasted from a block explorer works.
 */
export const findExperimentByParentMarket = (
  parentMarket: string,
): IExperiment | undefined => {
  const needle = parentMarket.trim().toLowerCase();
  return experiments.find((experiment) => experiment.parentMarket === needle);
};
