import { Tag } from "@kleros/ui-components-library";
import clsx from "clsx";

import { type MarketsData } from ".";

interface ILegend {
  marketsData?: MarketsData;
  visibleMarkets: Set<string>;
  onToggleMarket: (marketName: string) => void;
  onHoverMarket?: (marketName: string | null) => void;
}

const Legend: React.FC<ILegend> = ({
  marketsData,
  visibleMarkets,
  onToggleMarket,
  onHoverMarket,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {typeof marketsData !== "undefined" ? (
        <div onMouseLeave={() => onHoverMarket?.(null)}>
          <div className="flex flex-wrap gap-2">
            {Object.entries(marketsData).map(([name, { market, data }]) => {
              const isVisible = visibleMarkets.has(name);
              return (
                <span
                  key={name}
                  onMouseEnter={() => onHoverMarket?.(name)}
                  onMouseLeave={() => onHoverMarket?.(null)}
                >
                  <Tag
                    text={`${name} ${data.at(-1)?.value?.toFixed(2) ?? "0.00"}%`}
                    active={isVisible}
                    onClick={() => onToggleMarket(name)}
                    className={clsx(
                      "h-6 cursor-pointer max-md:h-fit [&_p]:text-xs",
                      isVisible
                        ? "bg-klerosUIComponentsMediumBlue"
                        : "[&_p]:text-klerosUIComponentsSecondaryText bg-transparent",
                    )}
                    style={{
                      borderColor: isVisible ? market.color : "transparent",
                    }}
                  />
                </span>
              );
            })}
          </div>
          <Tag
            key="all"
            text={visibleMarkets.size > 0 ? "Clear All" : "Check All"}
            onClick={() => {
              const originalSize = visibleMarkets.size;
              Object.entries(marketsData).forEach(([name]) => {
                if (
                  originalSize === 0 ||
                  (originalSize > 0 && visibleMarkets.has(name))
                )
                  onToggleMarket(name);
              });
            }}
            className="mt-3 block h-6 cursor-pointer [&_p]:text-xs"
          />
        </div>
      ) : null}
    </div>
  );
};

export default Legend;
