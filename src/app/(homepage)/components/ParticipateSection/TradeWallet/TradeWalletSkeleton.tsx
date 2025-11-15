import { Card } from "@kleros/ui-components-library";
import clsx from "clsx";

import { Skeleton } from "@/components/Skeleton";

const TradeWalletSkeleton: React.FC = () => {
  return (
    <Card
      round
      className={clsx(
        "border-gradient-purple-blue h-auto w-full border-none px-4 py-6 md:px-8",
      )}
    >
      <Skeleton className="mb-3 h-7 w-24" />
      <Skeleton className="mb-6 h-6 w-52 md:w-96" variant="secondary" />
      <Skeleton className="rounded-base h-[45px] w-32" />
    </Card>
  );
};

export default TradeWalletSkeleton;
