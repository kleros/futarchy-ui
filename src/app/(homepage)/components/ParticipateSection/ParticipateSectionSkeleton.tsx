import { Card } from "@kleros/ui-components-library";
import clsx from "clsx";

import { Skeleton } from "@/components/Skeleton";

import TradeWalletSkeleton from "./TradeWallet/TradeWalletSkeleton";

const ParticipateSectionSkeleton: React.FC = () => {
  return (
    <div className="mt-12 flex w-full flex-col gap-4">
      <Skeleton className="h-8 w-36" />
      <TradeWalletSkeleton />
      <Card
        round
        className={clsx(
          "border-gradient-purple-blue h-auto w-full border-none px-4 py-6 md:px-8",
        )}
      >
        <Skeleton className="mb-3 h-5 w-72 max-w-full" />
        <Skeleton className="mb-2 h-4 w-full" variant="secondary" />
        <Skeleton className="h-4 w-3/4" variant="secondary" />
      </Card>
      <Skeleton className="rounded-base h-10 w-36" />
    </div>
  );
};

export default ParticipateSectionSkeleton;
