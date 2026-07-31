import { useEffect, useState } from "react";

import { endTime } from "@/consts/markets";

export const isTradingPeriodEnded = () => Date.now() / 1000 >= endTime;

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
