import { markets } from "@/consts/markets";

import MarketCardSkeleton from "./MarketCardSkeleton";

const MarketsSectionSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      {markets.map((market) => (
        <MarketCardSkeleton key={market.marketId} />
      ))}
    </div>
  );
};

export default MarketsSectionSkeleton;
