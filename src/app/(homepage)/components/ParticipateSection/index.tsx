import { Card } from "@kleros/ui-components-library";

import Mint from "./Mint";

const ParticipateSection: React.FC = () => {
  return (
    <div className="mt-12 flex w-full flex-col gap-4">
      <h2 className="text-klerosUIComponentsPrimaryText text-2xl font-semibold">
        Participate
      </h2>
      <Card
        round
        className="border-gradient-purple-blue h-auto w-full border-none px-4 pt-4 pb-10.5 md:px-7.25 md:pt-6"
      >
        <Mint />
      </Card>
    </div>
  );
};
export default ParticipateSection;
