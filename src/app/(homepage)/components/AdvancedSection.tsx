import { Card } from "@kleros/ui-components-library";
import clsx from "clsx";
import Link from "next/link";

import ExternalArrow from "@/assets/svg/external-arrow.svg";
import SeerLogo from "@/assets/svg/seer-logo.svg";

const AdvancedSection: React.FC = () => {
  return (
    <Card
      round
      className={clsx(
        "border-gradient-purple-blue mb-42 h-auto w-full border-none px-4 py-6 md:px-8",
        "flex flex-col-reverse items-start justify-center gap-x-8 gap-y-4",
        "md:flex-row md:items-center md:justify-between",
      )}
    >
      <div className="flex flex-col items-start gap-2">
        <h3 className="text-klerosUIComponentsPrimaryText text-base font-semibold">
          Advanced
        </h3>
        <p className="text-klerosUIComponentsSecondaryText text-sm">
          Check the opportunities if you want to LP or Trade specific outcome
          tokens in Seer.&nbsp;
          {/* TODO: update link */}
          <Link
            href={"/"}
            target="_blank"
            rel="noreferrer noopener"
            className="text-klerosUIComponentsPrimaryBlue items-center text-sm"
          >
            Check it out <ExternalArrow className="mml-2 inline size-4" />
          </Link>
        </p>
      </div>
      <SeerLogo className="shrink-0" />
    </Card>
  );
};
export default AdvancedSection;
