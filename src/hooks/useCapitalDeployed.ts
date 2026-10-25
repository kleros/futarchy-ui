import { useQuery } from "@tanstack/react-query";
import { Address } from "viem";

import { CapitalDeployedResponse } from "@/app/api/capital-deployed/route";

/** sDAI the trade wallet has committed to predictions, in wei */
export const useCapitalDeployed = (tradeExecutor?: Address) =>
  useQuery({
    queryKey: ["capital-deployed", tradeExecutor],
    enabled: Boolean(tradeExecutor),
    queryFn: async () => {
      const res = await fetch(
        `/api/capital-deployed?tradeExecutor=${tradeExecutor}`,
      );

      if (!res.ok) {
        throw new Error("Unable to fetch capital deployed.");
      }

      const { capitalDeployed }: CapitalDeployedResponse = await res.json();
      return BigInt(capitalDeployed);
    },
    staleTime: 60_000,
  });
