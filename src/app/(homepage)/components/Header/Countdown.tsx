"use client";
import _Countdown, { type CountdownRenderProps } from "react-countdown";

import Cronometer from "@/assets/svg/cronometer.svg";

import { endTime } from "@/consts/markets";

const Countdown: React.FC = () => {
  const renderer = ({
    days,
    hours,
    minutes,
    completed,
  }: CountdownRenderProps) => {
    if (completed) {
      return (
        <span className="text-klerosUIComponentsPrimaryText text-sm font-semibold">
          Ended
        </span>
      );
    } else {
      return (
        <span className="text-klerosUIComponentsPrimaryText text-sm font-semibold">
          {days > 0 && `${days}d `}
          {hours > 0 && `${hours}h:`}
          {minutes > 0 && `${minutes}m `}
        </span>
      );
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Cronometer className="size-3.5" />
      <span className="text-klerosUIComponentsSecondaryText text-sm">
        Countdown:
      </span>
      <_Countdown date={new Date(endTime * 1000)} {...{ renderer }} />
    </div>
  );
};

export default Countdown;
