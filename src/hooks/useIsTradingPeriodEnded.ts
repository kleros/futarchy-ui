import { useEffect, useState } from "react";

import { endTime } from "@/consts/markets";

export const isTradingPeriodEnded = () => Date.now() / 1000 >= endTime;

export const useIsTradingPeriodEnded = () => {
  const [ended, setEnded] = useState(isTradingPeriodEnded);

  useEffect(() => {
    if (ended) return;

    const remainingMs = endTime * 1000 - Date.now();
    if (remainingMs <= 0) {
      setEnded(true);
      return;
    }

    const timer = setTimeout(() => setEnded(true), remainingMs);
    return () => clearTimeout(timer);
  }, [ended]);

  return ended;
};
