import clsx from "clsx";

import ChartBarIcon from "@/assets/svg/chart-bar.svg";
import StatsBarIcon from "@/assets/svg/stats-bar.svg";

import { type MarketsData } from ".";

const Legend: React.FC<{ marketsData?: MarketsData }> = ({ marketsData }) => {
  return (
    <div
      className={clsx(
        "flex flex-col-reverse gap-4",
        "items-start justify-center md:flex-row md:items-center md:justify-between",
      )}
    >
      {typeof marketsData !== "undefined" ? (
        <ul className="flex flex-wrap gap-4">
          {Object.entries(marketsData).map(([name, { market }], index) => (
            <li key={`item-${index}`} className="flex items-center gap-2">
              <div
                className="size-2 rounded-full"
                style={{
                  backgroundColor: market.color,
                }}
              />
              <span className="text-klerosUIComponentsPrimaryText text-sm">
                {name}
              </span>
            </li>
          ))}
        </ul>
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
