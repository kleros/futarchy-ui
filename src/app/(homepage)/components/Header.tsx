import clsx from "clsx";
import Image from "next/image";

import SeerHeaderBackground from "@/assets/png/seer-header-bg.png";
import ChartBar from "@/assets/svg/chart-bar.svg";
import Cronometer from "@/assets/svg/cronometer.svg";
import SeerLogo from "@/assets/svg/seer-logo.svg";

const Header: React.FC = () => {
  return (
    <div className="flex flex-col items-start gap-4">
      <h1 className="text-klerosUIComponentsPrimaryText text-2xl font-semibold">
        Session 1 - Movie Scores
      </h1>
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <ChartBar className="size-3.5" />
          <span className="text-klerosUIComponentsSecondaryText text-sm">
            Trading Period:
          </span>
          <span className="text-klerosUIComponentsPrimaryText text-sm font-semibold">
            3 Months
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Cronometer className="size-3.5" />
          <span className="text-klerosUIComponentsSecondaryText text-sm">
            Countdown:
          </span>
          <span className="text-klerosUIComponentsPrimaryText text-sm font-semibold">
            29d 11h:11m
          </span>
        </div>
      </div>

      <div
        className={clsx(
          "relative mt-8 box-border w-full overflow-hidden rounded-xl",
          "border-gradient-purple-blue",
        )}
      >
        <Image
          src={SeerHeaderBackground}
          alt="Seer header background"
          className="absolute -z-2 size-full object-cover max-md:opacity-35"
        />
        <div className="flex size-full flex-wrap items-center gap-6 px-6 py-3.75">
          <SeerLogo />
          <p className="text-klerosUIComponentsPrimaryText text-base">
            If watched, what score will Clément give the movie?
          </p>
        </div>
      </div>
    </div>
  );
};
export default Header;
