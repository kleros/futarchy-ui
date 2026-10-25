import { useEffect, useState } from "react";

const TRADING_HALTED = false;

export const isTradingPeriodEnded = () => TRADING_HALTED;

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
