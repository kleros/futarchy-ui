"use client";
import Cronometer from "@/assets/svg/cronometer.svg";

const Countdown: React.FC = () => (
  <div className="flex items-center gap-2">
    <Cronometer className="size-3.5" />
    <span className="text-klerosUIComponentsSecondaryText text-sm">
      Countdown:
    </span>
    <span className="text-klerosUIComponentsPrimaryText text-sm font-semibold">
      Ending soon
    </span>
  </div>
);

export default Countdown;
