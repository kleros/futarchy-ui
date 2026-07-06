import { useEffect, useState } from "react";

import { useMarketsStore } from "@/store/markets";

export const useMarketsHydrated = () => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    useMarketsStore.persist.rehydrate();

    const unsub = useMarketsStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    setHydrated(useMarketsStore.persist.hasHydrated());

    return unsub;
  }, []);

  return hydrated;
};
