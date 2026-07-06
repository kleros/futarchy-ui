import { Skeleton } from "@/components/Skeleton";

const ProfitLossSkeleton: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="size-3.5 rounded-full" />
      <Skeleton className="h-4 w-7" variant="secondary" />
      <Skeleton className="h-4 w-28" />
    </div>
  );
};

export default ProfitLossSkeleton;
