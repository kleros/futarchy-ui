import { formatUnits, parseEther } from "viem";

import { useReadSDaiPreviewRedeem } from "@/generated";

export const useSDaiPrice = () => {
  const { data: value, isLoading } = useReadSDaiPreviewRedeem({
    args: [parseEther("1")],
    query: {
      staleTime: 5000,
    },
  });

  const price = parseFloat(formatUnits(value ?? 0n, 18));

  return { price, isLoading };
};
