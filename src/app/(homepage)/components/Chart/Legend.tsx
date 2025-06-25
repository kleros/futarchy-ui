import clsx from "clsx";

import ChartBarIcon from "@/assets/svg/chart-bar.svg";
import StatsBarIcon from "@/assets/svg/stats-bar.svg";

import { LINE_COLORS } from ".";

const Legend: React.FC<{ marketNames?: string[] }> = ({ marketNames }) => {
  return (
    <div
      className={clsx(
        "flex flex-col-reverse gap-4",
        "items-start justify-center md:flex-row md:items-center md:justify-between",
      )}
    >
      <ul className="flex flex-wrap gap-4">
        {marketNames?.map((name, index) => (
          <li key={`item-${index}`} className="flex items-center gap-2">
            <div
              className="size-2 rounded-full"
              style={{
                backgroundColor: LINE_COLORS[index % LINE_COLORS.length],
              }}
            />
            <span className="text-klerosUIComponentsPrimaryText text-sm">
              {name}
            </span>
          </li>
        ))}
      </ul>
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
          <span className="text-klerosUIComponentsPrimaryText text-sm">88</span>
          <span className="text-klerosUIComponentsSecondaryText text-sm">
            Trades
          </span>
        </div>
      </div>
    </div>
  );
};

export default Legend;
