import { Tag } from "@kleros/ui-components-library";
import clsx from "clsx";

import ChartBarIcon from "@/assets/svg/chart-bar.svg";
import StatsBarIcon from "@/assets/svg/stats-bar.svg";

import { type MarketsData } from ".";

interface ILegend {
  marketsData?: MarketsData;
  visibleMarkets: Set<string>;
  onToggleMarket: (marketName: string) => void;
}

const Legend: React.FC<ILegend> = ({
  marketsData,
  visibleMarkets,
  onToggleMarket,
}) => {
  return (
    <div
      className={clsx(
        "flex flex-col-reverse gap-4",
        "border-klerosUIComponentsStroke items-start justify-center md:flex-row md:items-center md:justify-between",
      )}
    >
      {typeof marketsData !== "undefined" ? (
        <div className="flex flex-wrap gap-2">
          {Object.entries(marketsData).map(
            ([name, { market, data }], index) => {
              const isVisible = visibleMarkets.has(name);
              return (
                <Tag
                  key={`item-${index}`}
                  text={`${name} ${data.at(-1)?.value.toFixed(2)}%`}
                  active={isVisible}
                  onClick={() => onToggleMarket(name)}
                  className={clsx(
                    "h-6 cursor-pointer !border [&_p]:text-xs",
                    isVisible
                      ? "bg-klerosUIComponentsMediumBlue"
                      : "bg-transparent",
                  )}
                  style={{
                    borderColor: market.color,
                  }}
                />
              );
            },
          )}
        </div>
      ) : null}
      {false ? (
        <div className="flex gap-8">
          <div className="flex items-center gap-2">
            <StatsBarIcon className="size-4" />
            <span className="text-klerosUIComponentsPrimaryText text-sm">
              250.k
            </span>
            <span className="text-klerosUIComponentsSecondaryText text-sm">
              Volume
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ChartBarIcon className="size-4" />
            <span className="text-klerosUIComponentsPrimaryText text-sm">
              88
            </span>
            <span className="text-klerosUIComponentsSecondaryText text-sm">
              Trades
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Legend;
