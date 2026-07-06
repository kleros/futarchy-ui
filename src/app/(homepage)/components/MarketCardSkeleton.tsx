import clsx from "clsx";

import { Skeleton } from "@/components/Skeleton";

const MarketCardSkeleton: React.FC = () => {
  return (
    <div
      className={clsx(
        "bg-klerosUIComponentsLightBackground rounded-base flex w-full flex-col gap-6 p-4 md:p-6",
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Skeleton className="size-2 shrink-0 rounded-full" />
          <Skeleton className="h-5 w-36 max-w-[60vw]" />
        </div>
        <Skeleton className="size-4 shrink-0" variant="secondary" />
      </div>
      <div className="relative w-full">
        <Skeleton className="h-2 w-full rounded-[30px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3">
          <Skeleton className="h-[22px] w-[42px]" />
          <Skeleton
            className="mx-auto h-9 w-0.75 rounded-b-full"
            variant="secondary"
          />
        </div>
      </div>
    </div>
  );
};

export default MarketCardSkeleton;
