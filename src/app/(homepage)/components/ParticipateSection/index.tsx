import { useMemo } from "react";

import { Card } from "@kleros/ui-components-library";

import { useGetWinningOutcomes } from "@/hooks/useGetWinningOutcomes";

import { isUndefined } from "@/utils";

import { parentConditionId } from "@/consts/markets";

import Mint from "./Mint";
import RedeemParentMarket from "./RedeemParentMarket";

const ParticipateSection: React.FC = () => {
  const { data: parentWinningOutcomes } =
    useGetWinningOutcomes(parentConditionId);

  const isParentResolved = useMemo(
    () =>
      isUndefined(parentWinningOutcomes)
        ? false
        : parentWinningOutcomes.some((val) => val === true),
    [parentWinningOutcomes],
  );

  return (
    <div className="mt-12 flex w-full flex-col gap-4">
      <h2 className="text-klerosUIComponentsPrimaryText text-2xl font-semibold">
        Participate
      </h2>

      <Mint />
      <Card
        round
        className="border-gradient-purple-blue h-auto w-full border-none px-4 py-6 md:px-8"
      >
        <p className="text-klerosUIComponentsSecondaryText text-sm">
          <strong className="text-klerosUIComponentsPrimaryText text-base">
            2nd
          </strong>{" "}
          Set estimates for the projects below. You can choose how many projects
          you want to predict.
        </p>
      </Card>
      {isParentResolved ? <RedeemParentMarket /> : null}
    </div>
  );
};
export default ParticipateSection;
