import clsx from "clsx";

import { Skeleton } from "@/components/Skeleton";

const SkeletonCard: React.FC = () => {
  return (
    <div
      className={clsx(
        "rounded-base border-klerosUIComponentsStroke min-h-66 min-w-73.25 border",
        "flex h-fit flex-col items-center gap-4 px-4 py-6",
        "hover:shadow-md",
      )}
    >
      <div className="mb-4 flex w-full flex-col items-center gap-2">
        <Skeleton className="h-5.5 w-14" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="flex w-full flex-col items-center gap-2">
        <div
          className={clsx(
            "rounded-base bg-klerosUIComponentsMediumBlue w-full px-4 pt-3.75 pb-4.5",
            "flex items-center justify-center",
          )}
        >
          <Skeleton className="h-4 w-full" />
        </div>
        <Skeleton className="h-3 w-48" />
      </div>
      <Skeleton className="h-11.25 w-29.25" />
    </div>
  );
};

export default SkeletonCard;
