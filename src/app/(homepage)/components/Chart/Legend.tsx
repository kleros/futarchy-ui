import { useMemo, useState } from "react";

import { Searchbar } from "@kleros/ui-components-library";
import clsx from "clsx";

import { ScrollFade } from "@/components/ScrollFade";

import { cn, shortenName } from "@/utils";
import { getReadableTextColor } from "@/utils/getReadableTextColor";

import { type MarketsData } from ".";

interface ILegend {
  marketsData?: MarketsData;
  visibleMarkets: Set<string>;
  hoveredMarket?: string | null;
  onToggleMarket: (marketName: string) => void;
  onHoverMarket?: (marketName: string | null) => void;
}

const Legend: React.FC<ILegend> = ({
  marketsData,
  visibleMarkets,
  hoveredMarket = null,
  onToggleMarket,
  onHoverMarket,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const sortedMarkets = useMemo(() => {
    if (!marketsData) return [];

    return Object.entries(marketsData).sort(([, a], [, b]) => {
      const aValue = a.data.at(-1)?.value ?? 0;
      const bValue = b.data.at(-1)?.value ?? 0;
      if (aValue !== bValue) return bValue - aValue;
      return a.market.name.localeCompare(b.market.name);
    });
  }, [marketsData]);

  const filteredMarkets = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return sortedMarkets;

    return sortedMarkets.filter(([name]) => name.toLowerCase().includes(query));
  }, [searchQuery, sortedMarkets]);

  if (!marketsData) return null;

  const textColor = (color: string) => getReadableTextColor(color);

  return (
    <div className="flex h-full min-h-0 flex-col gap-1 overflow-hidden md:gap-2">
      <Searchbar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search markets"
        aria-label="Search markets"
        className={cn(
          "w-full shrink-0",
          "[&>div:first-child]:!h-7",
          "[&>div:first-child]:flex [&>div:first-child]:items-center",
          "[&>div:first-child_svg]:!top-1/2 [&>div:first-child_svg]:!left-2.5",
          "[&>div:first-child_svg]:!size-3 [&>div:first-child_svg]:!-translate-y-1/2",
        )}
        inputProps={{
          className: cn(
            "!h-7 !min-h-0 !py-0 !pl-8 !pr-2",
            "!text-[10px] !leading-none",
            "placeholder:!text-[10px] placeholder:!leading-none",
          ),
        }}
      />
      <div
        className="min-h-0 flex-1 overflow-hidden"
        onMouseLeave={() => onHoverMarket?.(null)}
      >
        <ScrollFade className="h-full min-h-0">
          <div className="grid min-w-0 grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-1">
            {filteredMarkets.length === 0 ? (
              <p className="text-klerosUIComponentsSecondaryText px-0.5 text-[10px]">
                No markets found
              </p>
            ) : null}
            {filteredMarkets.map(([name, { market, data }]) => {
              const isVisible = visibleMarkets.has(name);
              const isHovered = hoveredMarket === name;
              const value = data.at(-1)?.value?.toFixed(2) ?? "0.00";
              const color = textColor(market.color);

              return (
                <button
                  key={name}
                  type="button"
                  title={`${name} ${value}%`}
                  onClick={() => onToggleMarket(name)}
                  onMouseEnter={() => onHoverMarket?.(name)}
                  className={cn(
                    "rounded-base h-fit w-full min-w-0 cursor-pointer overflow-hidden px-1 py-0.5 text-left",
                    "transition-[opacity,transform,box-shadow]",
                    isVisible ? "opacity-100" : "opacity-40",
                    isHovered && "ring-1 ring-white/80",
                  )}
                  style={{ backgroundColor: market.color }}
                >
                  <p
                    className="truncate text-[10px] leading-tight"
                    style={{ color }}
                  >
                    {shortenName(name)}
                    <span className="mx-0.5" style={{ color }}>
                      |
                    </span>
                    {value}%
                  </p>
                </button>
              );
            })}
          </div>
        </ScrollFade>
      </div>
      <button
        type="button"
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
        className={clsx(
          "text-klerosUIComponentsSecondaryText hover:text-klerosUIComponentsPrimaryText",
          "shrink-0 cursor-pointer text-left text-[10px] transition-colors",
        )}
      >
        {visibleMarkets.size > 0 ? "Clear all" : "Show all"}
      </button>
    </div>
  );
};

export default Legend;
