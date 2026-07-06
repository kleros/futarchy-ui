"use client";

import { useReadGnosisRouterGetWinningOutcomes } from "@/generated";

import MarketContextProvider from "@/context/MarketContext";

import { markets, parentConditionId } from "@/consts/markets";

import ProjectFunding from "./ProjectFunding";

const MarketsSection: React.FC = () => {
  const { data: winningOutcomes } = useReadGnosisRouterGetWinningOutcomes({
    args: [parentConditionId],
  });

  return (
    <div className="flex flex-col gap-4">
      {markets.map((market, i) => (
        <MarketContextProvider
          key={market.marketId}
          selected={winningOutcomes?.at(i)}
          {...market}
        >
          <ProjectFunding key={market.marketId} />
        </MarketContextProvider>
      ))}
    </div>
  );
};

export default MarketsSection;
