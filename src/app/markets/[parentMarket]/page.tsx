import { notFound, redirect } from "next/navigation";

import {
  findExperimentByParentMarket,
  parentMarketAddresses,
} from "@/consts/parentMarketRoutes";

interface MarketRedirectProps {
  params: { parentMarket: string };
}

export const generateStaticParams = () =>
  parentMarketAddresses.map((parentMarket) => ({ parentMarket }));

/**
 * Sends `/markets/<parent market address>` to the app serving that round, so a
 * link carrying only the on-chain address (a block explorer, Seer) resolves.
 */
export default function MarketRedirect({ params }: MarketRedirectProps) {
  const experiment = findExperimentByParentMarket(params.parentMarket);
  if (!experiment) notFound();
  redirect(experiment.url);
}
