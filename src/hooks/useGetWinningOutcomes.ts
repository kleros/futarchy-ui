import { useReadGnosisRouterGetWinningOutcomes } from "@/generated";

export const useGetWinningOutcomes = (conditionId: `0x${string}`) => {
  return useReadGnosisRouterGetWinningOutcomes({
    args: [conditionId],
  });
};
