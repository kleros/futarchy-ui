import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import { MarketVolumeResponse } from "@/app/api/market-volume/route";

import { useSDaiPrice } from "@/hooks/useSDaiPrice";

import StatsBarIcon from "@/assets/svg/stats-bar.svg";

import { formatBigNumbers } from "@/utils";

const MarketVolume: React.FC = () => {
  const { price: sDaiPrice } = useSDaiPrice();
  const { data, isLoading, isError } = useQuery<MarketVolumeResponse>({
    queryKey: ["market-volume"],
    queryFn: async () => {
      const res = await fetch("/api/market-volume");

      if (!res.ok) {
        throw new Error("Unable to fetch market volume data.");
      }
      return res.json();
    },
    staleTime: 300_000,
  });

  const volumeLabel = useMemo(() => {
    if (isLoading) return "...";
    if (isError || !data) return "N/A";
    return `~$${formatBigNumbers(data.totalVolumeSDai * sDaiPrice)}`;
  }, [data, isError, isLoading, sDaiPrice]);

  return (
    <div className="flex items-center gap-2">
      <StatsBarIcon className="size-3.5" />
      <span className="text-klerosUIComponentsSecondaryText text-sm">
        Volume:
      </span>
      <span className="text-klerosUIComponentsPrimaryText text-sm font-semibold">
        {volumeLabel}
      </span>
    </div>
  );
};

export default MarketVolume;
