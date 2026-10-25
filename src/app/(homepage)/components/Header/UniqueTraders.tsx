import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import { UniqueTradersResponse } from "@/app/api/unique-traders/route";

import ChartBar from "@/assets/svg/chart-bar.svg";

const UniqueTraders: React.FC = () => {
  const {
    data: uniqueTradersData,
    isLoading,
    isError,
  } = useQuery<UniqueTradersResponse>({
    queryKey: ["unique-traders"],
    queryFn: async () => {
      const res = await fetch("/api/unique-traders");

      if (!res.ok) {
        throw new Error("Unable to fetch unique traders data.");
      }
      return res.json();
    },
    staleTime: 300_000,
  });

  const tradersLabel = useMemo(() => {
    if (isLoading) return "...";
    if (isError || !uniqueTradersData) return "N/A";
    return `~${uniqueTradersData.uniqueTraders}`;
  }, [isError, isLoading, uniqueTradersData]);

  return (
    <div className="flex items-center gap-2">
      <ChartBar className="size-3.5" />
      <span className="text-klerosUIComponentsSecondaryText text-sm">
        Traders:
      </span>
      <span className="text-klerosUIComponentsPrimaryText text-sm font-semibold">
        {tradersLabel}
      </span>
    </div>
  );
};

export default UniqueTraders;
