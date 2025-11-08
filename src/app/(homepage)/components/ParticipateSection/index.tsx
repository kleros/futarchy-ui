import { Card } from "@kleros/ui-components-library";
import { useAccount } from "wagmi";

import { useCheckTradeExecutorCreated } from "@/hooks/tradeWallet/useCheckTradeExecutorCreated";

import Mint from "./Mint";

const ParticipateSection: React.FC = () => {
  const { address } = useAccount();
  const { data: checkTradeExecutorData } =
    useCheckTradeExecutorCreated(address);

  const tradeExecutor = checkTradeExecutorData?.predictedAddress;

  return (
    <div className="flex w-full flex-col gap-4">
      <h2 className="text-klerosUIComponentsPrimaryText text-2xl font-semibold">
        Participate
      </h2>

      {tradeExecutor ? <Mint {...{ tradeExecutor }} /> : null}
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
    </div>
  );
};
export default ParticipateSection;
