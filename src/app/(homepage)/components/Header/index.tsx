import clsx from "clsx";
import Image from "next/image";

import SeerLogo from "@/components/SeerLogo";

import SeerHeaderBackground from "@/assets/png/seer-header-bg.png";
import ChartBar from "@/assets/svg/chart-bar.svg";

import { metadata } from "@/consts/markets";

import Countdown from "./Countdown";

const Header: React.FC = () => {
  return (
    <div className="flex flex-col items-start gap-4">
      <h1 className="text-klerosUIComponentsPrimaryText text-2xl font-semibold">
        {metadata.name}
      </h1>
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <ChartBar className="size-3.5" />
          <span className="text-klerosUIComponentsSecondaryText text-sm">
            Trading Period:
          </span>
          <span className="text-klerosUIComponentsPrimaryText text-sm font-semibold">
            Until Monday 18th 23:59 UTC
          </span>
        </div>
        <Countdown />
      </div>

      <div
        className={clsx(
          "relative mt-8 box-border w-full overflow-hidden rounded-xl",
          "border-gradient-purple-blue",
          "flex flex-col gap-2",
        )}
      >
        <Image
          src={SeerHeaderBackground}
          alt="Seer header background"
          className="absolute -z-2 size-full object-cover max-md:opacity-35"
        />
        <div className="flex size-full flex-wrap items-center gap-6 px-6 pt-3.75">
          <SeerLogo />
          <p className="text-klerosUIComponentsPrimaryText text-base">
            {metadata.question}
          </p>
        </div>
        <p className="text-klerosUIComponentsSecondaryText px-6 pb-3.75 text-xs whitespace-pre-line">
          {metadata.questionDescription}
        </p>
      </div>
    </div>
  );
};
export default Header;
