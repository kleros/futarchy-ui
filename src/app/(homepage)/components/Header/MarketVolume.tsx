import { useMemo } from "react";

import { Button, Modal, Tooltip } from "@kleros/ui-components-library";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useToggle } from "react-use";

import {
  MarketNotionalVolume,
  MarketVolumeResponse,
} from "@/app/api/market-volume/route";

import { useSDaiPrice } from "@/hooks/useSDaiPrice";

import LightButton from "@/components/LightButton";

import StatsBarIcon from "@/assets/svg/stats-bar.svg";

import { formatBigNumbers } from "@/utils";

import { markets } from "@/consts/markets";

interface INotionalVolumeModal {
  isOpen: boolean;
  toggleIsOpen: () => void;
  marketVolumes: MarketNotionalVolume[];
  totalNotionalSDai: number;
  sDaiPrice: number;
}

const NotionalVolumeModal: React.FC<INotionalVolumeModal> = ({
  isOpen,
  toggleIsOpen,
  marketVolumes,
  totalNotionalSDai,
  sDaiPrice,
}) => (
  <Modal
    className="relative h-fit w-full overflow-x-hidden p-8 px-2 md:w-162.5 md:px-8"
    onOpenChange={toggleIsOpen}
    {...{ isOpen }}
  >
    <div className="flex size-full flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-klerosUIComponentsPrimaryText text-2xl font-semibold">
          Notional volume by market
        </h2>
        <p className="text-klerosUIComponentsSecondaryText text-sm">
          Total: {formatBigNumbers(totalNotionalSDai)} sDAI ($
          {formatBigNumbers(totalNotionalSDai * sDaiPrice)})
        </p>
      </div>

      <ul className="flex max-h-96 flex-col gap-3 overflow-y-auto pr-1">
        {marketVolumes.map((market) => (
          <li
            key={market.name}
            className="border-klerosUIComponentsStroke rounded-base border p-3"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-klerosUIComponentsPrimaryText text-sm font-semibold">
                {market.name}
              </span>
              <span className="text-klerosUIComponentsPrimaryText shrink-0 text-right text-sm font-semibold">
                {formatBigNumbers(market.notionalSDai)} sDAI
                <span className="text-klerosUIComponentsSecondaryText block text-xs font-normal">
                  ${formatBigNumbers(market.notionalSDai * sDaiPrice)}
                </span>
              </span>
            </div>
            <ul className="mt-2 space-y-1">
              {market.outcomes.map(({ outcome, volume, notionalSDai }) => (
                <li
                  key={outcome}
                  className="text-klerosUIComponentsSecondaryText flex justify-between gap-3 text-xs"
                >
                  <span>
                    {formatBigNumbers(volume)} {outcome} traded
                  </span>
                  <span>${formatBigNumbers(notionalSDai * sDaiPrice)}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <div className="flex w-full justify-center">
        <Button text="Close" small variant="secondary" onPress={toggleIsOpen} />
      </div>
    </div>
  </Modal>
);

const MarketVolume: React.FC = () => {
  const [isOpen, toggleIsOpen] = useToggle(false);
  const { price: sDaiPrice, isLoading: isLoadingSDaiPrice } = useSDaiPrice();
  const { data, isLoading, isError } = useQuery<MarketVolumeResponse>({
    queryKey: ["market-volume"],
    queryFn: async () => {
      const res = await fetch("/api/market-volume");

      if (!res.ok) {
        throw new Error("Unable to fetch market volume data.");
      }
      return res.json();
    },
    staleTime: 300_000,
  });

  const volumeLabel = useMemo(() => {
    if (isLoading || isLoadingSDaiPrice) return "...";
    if (isError || !data || !sDaiPrice) return "N/A";
    return `~$${formatBigNumbers(data.totalVolumeSDai * sDaiPrice)}`;
  }, [data, isError, isLoading, sDaiPrice, isLoadingSDaiPrice]);

  const canOpen = !!data && sDaiPrice > 0;

  const button = (
    <LightButton
      text={volumeLabel}
      small
      isDisabled={!canOpen}
      onPress={() => toggleIsOpen(true)}
      className={clsx(
        "h-auto !p-0",
        canOpen &&
          "[&_.button-text]:underline [&_.button-text]:decoration-dotted",
        // eslint-disable-next-line max-len
        "[&_.button-text]:text-klerosUIComponentsPrimaryText [&_.button-text]:text-sm [&_.button-text]:font-semibold",
        "hover:[&_.button-text]:text-klerosUIComponentsPrimaryBlue hover:!bg-transparent",
      )}
    />
  );

  return (
    <div className="flex items-center gap-2">
      <StatsBarIcon className="size-3.5" />
      <span className="text-klerosUIComponentsSecondaryText text-sm">
        Volume:
      </span>
      {canOpen ? (
        <>
          <Tooltip
            small
            // eslint-disable-next-line max-len
            text={`Notional volume: ~$${formatBigNumbers(data.totalNotionalSDai * sDaiPrice)}\nClick for detailed breakdown`}
            className="max-w-94 [&>small]:text-sm [&>small]:whitespace-pre-line"
          >
            {button}
          </Tooltip>
          <NotionalVolumeModal
            isOpen={isOpen}
            toggleIsOpen={toggleIsOpen}
            marketVolumes={data.data}
            totalNotionalSDai={data.totalNotionalSDai}
            sDaiPrice={sDaiPrice}
          />
        </>
      ) : (
        button
      )}
    </div>
  );
};

export default MarketVolume;
