import clsx from "clsx";
import Image from "next/image";

import { useWinningAnswers } from "@/hooks/useWinningAnswers";

import ExternalLink from "@/components/ExternalLink";
import SeerLogo from "@/components/SeerLogo";

import SeerHeaderBackground from "@/assets/png/seer-header-bg.png";
import ChartBar from "@/assets/svg/chart-bar.svg";

import { cn } from "@/utils";
import { getReadableTextColor } from "@/utils/getReadableTextColor";

import { endDate, marketMetadata } from "@/consts/markets";

import Countdown from "./Countdown";

const Header: React.FC = () => {
  const { winningMarkets, isLoading } = useWinningAnswers();

  return (
    <div className="flex flex-col items-start gap-4">
      <h1 className="text-klerosUIComponentsPrimaryText text-2xl font-semibold">
        {marketMetadata.name}
      </h1>
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <ChartBar className="size-3.5" />
          <span className="text-klerosUIComponentsSecondaryText text-sm">
            Trading Period:
          </span>
          <span className="text-klerosUIComponentsPrimaryText text-sm font-semibold">
            Until {endDate}
          </span>
        </div>
        <Countdown />
      </div>
      <ExternalLink
        text="Distilled Clément's Judgement - Session 1"
        url="https://movies.foresight.kleros.io/"
      />
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
            {marketMetadata.question}
          </p>
        </div>
        <p className="text-klerosUIComponentsSecondaryText px-6 pb-3.75 text-xs whitespace-pre-line">
          You can look at{" "}
          <ExternalLink
            text="previous assessments"
            url="https://www.criticker.com/profile/clesaege/"
            showIcon={false}
            className="text-xs"
          />
          , to get an idea of what he would like/dislike.
        </p>
      </div>
      {!isLoading && winningMarkets.length > 0 ? (
        <div className="border-b-klerosUIComponentsStroke w-full space-y-2 border-b pb-8">
          <h2 className="text-klerosUIComponentsPrimaryText text-base font-semibold">
            Market resolved:
          </h2>
          <div className="flex flex-row flex-wrap items-center gap-2">
            {winningMarkets.map(({ market, finalAnswer }) => (
              <div
                className={cn(
                  "rounded-base h-fit px-1 py-0.5",
                  "flex flex-row gap-2",
                )}
                key={market.marketId}
                style={{
                  backgroundColor: market.color,
                }}
              >
                <p
                  className="text-xs"
                  style={{ color: getReadableTextColor(market.color) }}
                >
                  {market.name}
                  <span
                    className="mx-1 text-xs"
                    style={{ color: getReadableTextColor(market.color) }}
                  >
                    |
                  </span>
                  {finalAnswer}%
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};
export default Header;
