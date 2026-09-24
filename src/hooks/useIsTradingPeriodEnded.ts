import { useEffect, useState } from "react";

import { endTime } from "@/consts/markets";

const TRADING_HALTED = false;

export const isTradingPeriodEnded = () =>
  TRADING_HALTED || Date.now() / 1000 >= endTime;

export const useIsTradingPeriodEnded = () => {
  const [ended, setEnded] = useState(isTradingPeriodEnded);

  useEffect(() => {
    if (ended) return;

    const timer = setInterval(() => {
      if (isTradingPeriodEnded()) setEnded(true);
    }, 5_000);
    return () => clearInterval(timer);
  }, [ended]);

  return ended;
};
