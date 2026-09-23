import { Skeleton } from "@/components/Skeleton";

import { cn } from "@/utils";

import { markets } from "@/consts/markets";

// w-13/pr-13 is 52px and h-7 is 28px: what lightweight-charts reserves for the
// price scale (rightPriceScale.minimumWidth) and the time scale.

const GRID_LINES = [20, 40, 60, 80];
const PRICE_TICKS = 5;
const TIME_TICKS = 6;

// Shapes only — the real series replaces these.
const PLACEHOLDER_SERIES = [
  "0,70 25,66 50,72 75,58 100,62 125,50 150,55 175,45 200,48 225,38 250,42 275,33 300,36",
  "0,45 25,50 50,44 75,52 100,47 125,55 150,50 175,58 200,54 225,60 250,57 275,63 300,60",
  "0,58 25,57 50,60 75,56 100,59 125,54 150,57 175,52 200,55 225,51 250,54 275,49 300,52",
];

const ChartSkeleton: React.FC = () => (
  <div className="mt-6 flex size-full flex-col">
    <h2 className="text-klerosUIComponentsPrimaryText text-base font-semibold">
      Market Estimate Scores
    </h2>
    <div
      role="status"
      aria-label="Loading chart"
      className="flex flex-col gap-2 md:h-[400px] md:flex-row"
    >
      <div className="h-[280px] min-w-0 md:h-full md:min-h-0 md:flex-1">
        <div className="flex size-full flex-col">
          <div className="flex min-h-0 flex-1">
            <svg
              aria-hidden
              viewBox="0 0 300 100"
              preserveAspectRatio="none"
              className={cn(
                "h-full min-w-0 flex-1 animate-pulse",
                "dark:text-klerosUIComponentsStroke text-gray-200",
              )}
            >
              {GRID_LINES.map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="300"
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="2 6"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              {PLACEHOLDER_SERIES.map((points) => (
                <polyline
                  key={points}
                  points={points}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </svg>
            <div className="flex w-13 shrink-0 flex-col justify-between py-1 pl-2">
              {Array.from({ length: PRICE_TICKS }, (_, i) => (
                <Skeleton key={i} className="h-2 w-6" />
              ))}
            </div>
          </div>
          <div className="flex h-7 shrink-0 items-center justify-between pr-13">
            {Array.from({ length: TIME_TICKS }, (_, i) => (
              <Skeleton key={i} className="h-2 w-8" />
            ))}
          </div>
        </div>
      </div>
      <div
        className={cn(
          "bg-klerosUIComponentsWhiteBackground rounded-base flex min-h-0 flex-col",
          "overflow-hidden p-2 max-md:h-32 md:h-full md:w-44 md:shrink-0",
        )}
      >
        <div className="flex h-full min-h-0 flex-col gap-1 overflow-hidden md:gap-2">
          <Skeleton className="h-7 w-full shrink-0" />
          <div
            className={cn(
              "grid min-h-0 flex-1 content-start gap-1 overflow-hidden",
              "grid-cols-2 sm:grid-cols-3 md:grid-cols-1",
            )}
          >
            {markets.map((market) => (
              // px-1 py-0.5 around text-[10px]/leading-tight
              <Skeleton key={market.marketId} className="h-[17px] w-full" />
            ))}
          </div>
          <Skeleton className="h-3 w-12 shrink-0" />
        </div>
      </div>
    </div>
  </div>
);

export default ChartSkeleton;
