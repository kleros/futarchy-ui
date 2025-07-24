import { cn } from "@/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-base bg-klerosUIComponentsMediumBlue animate-pulse",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
