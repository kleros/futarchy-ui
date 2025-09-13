import { useMemo } from "react";

import { useGetWinningOutcomes } from "@/hooks/useGetWinningOutcomes";

import { isUndefined } from "@/utils";

import { parentConditionId } from "@/consts/markets";

export const useIsParentResolved = () => {
  const { data: parentWinningOutcomes } =
    useGetWinningOutcomes(parentConditionId);
  return useMemo(
    () =>
      isUndefined(parentWinningOutcomes)
        ? false
        : parentWinningOutcomes.some((val) => val === true),
    [parentWinningOutcomes],
  );
};
