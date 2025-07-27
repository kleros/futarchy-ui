import { cn } from "@/utils";

interface ISkeleton extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "secondary";
}
function Skeleton({ className, variant = "primary", ...props }: ISkeleton) {
  return (
    <div
      className={cn(
        "rounded-base animate-pulse",
        {
          "dark:bg-klerosUIComponentsStroke bg-gray-200": variant === "primary",
          "dark:bg-klerosUIComponentsStroke/75 bg-gray-300":
            variant === "secondary",
        },
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
