import { Card } from "@kleros/ui-components-library";

import CsvUpload from "./CsvUpload";
import { TradeWallet } from "./TradeWallet";
import BookIcon from "@/assets/svg/book-open.svg";
import LightButton from "@/components/LightButton";
import clsx from "clsx";
import { useToggle } from "react-use";
import FirstVisitGuide from "@/components/Guides/FirstVisit";

const ParticipateSection: React.FC = () => {
  const [isOpen, toggleGuide] = useToggle(false);
  return (
    <div className="mt-12 flex w-full flex-col gap-4">
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <h2 className="text-klerosUIComponentsPrimaryText text-2xl font-semibold">
          Participate
        </h2>
        <LightButton
          text="Quick Guide"
          Icon={BookIcon}
          className={clsx(
            "p-0",
            "[&_.button-text]:text-klerosUIComponentsSecondaryPurple! [&_.button-text]:text-sm [&_.button-text]:font-thin!",
            "[&>svg_path]:fill-klerosUIComponentsSecondaryPurple hover:[&>svg_path]:fill-klerosUIComponentsSecondaryPurple [&>svg]:mr-1",
          )}
          small
          onPress={toggleGuide}
        />
      </div>

      <TradeWallet />
      <Card
        round
        className="border-gradient-purple-blue h-auto w-full border-none px-4 py-6 md:px-8"
      >
        <p className="text-klerosUIComponentsSecondaryText text-sm">
          <strong className="text-klerosUIComponentsPrimaryText text-base">
            Set estimates for the projects below.
          </strong>{" "}
          You can choose how many projects you want to predict.
        </p>
      </Card>
      <CsvUpload />

      <FirstVisitGuide
        isVisible={isOpen}
        closeGuide={() => {
          toggleGuide(false);
        }}
      />
    </div>
  );
};
export default ParticipateSection;
