import { useEffect, useState } from "react";

export const isTradingPeriodEnded = () => false;

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
