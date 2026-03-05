import React from "react";

import { Accordion } from "@kleros/ui-components-library";
import clsx from "clsx";
import Image from "next/image";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { useRealtMarketData } from "@/hooks/useRealtMarketData";

import ExternalLink from "@/components/ExternalLink";

import CalendarIcon from "@/assets/svg/calendar.svg";
import ChartIcon from "@/assets/svg/chart-bar.svg";
import DollarIcon from "@/assets/svg/dollar.svg";
import GeoPin from "@/assets/svg/geo-pin.svg";
import GnosisLogo from "@/assets/svg/gnosis.svg";

import DetailItem from "./DetailItem";
import { DISPLAYED_KEYS } from "./displayKeys";
import { formatCurrency, formatDate, formatNumber } from "./formatters";
import MiscData from "./MiscData";
import MoreDetails from "./MoreDetails";

type DetailsProps = {
  contract: string;
};

const Details: React.FC<DetailsProps> = ({ contract }) => {
  const { data: realtData, isLoading, isError } = useRealtMarketData(contract);

  if (isLoading) {
    return (
      <div className="text-klerosUIComponentsSecondaryText flex items-center justify-center py-12 text-sm">
        Loading details...
      </div>
    );
  }

  if (isError || !realtData) {
    return (
      <div className="text-klerosUIComponentsSecondaryText flex items-center justify-center py-12 text-sm">
        Error loading details or no data available.
      </div>
    );
  }

  const miscDetails = Object.entries(realtData).reduce(
    (acc, [key, value]) => {
      if (!DISPLAYED_KEYS.has(key)) {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, unknown>,
  );

  return (
    <div className="flex flex-col gap-0">
      {/* Header: Address + Coordinates */}
      <div
        className={clsx(
          "border-klerosUIComponentsStroke flex flex-wrap items-center gap-3 border-b",
          "px-3 py-5 md:px-6",
        )}
      >
        <GeoPin className="text-klerosUIComponentsPrimaryBlue size-6 shrink-0" />
        <strong className="text-klerosUIComponentsPrimaryText text-md font-semibold md:text-lg">
          {realtData.fullName}
        </strong>
        <span className="text-klerosUIComponentsSecondaryText ml-auto text-xs">
          ({realtData.coordinate.lat}, {realtData.coordinate.lng})
        </span>
      </div>

      {/* Main content: Stats + Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Stats Section */}
        <div
          className={clsx(
            "border-klerosUIComponentsStroke flex flex-col gap-5 border-b lg:border-r lg:border-b-0",
            "p-6 max-md:px-2",
          )}
        >
          {/* Total Investment */}
          <div className="border-klerosUIComponentsStroke flex items-center gap-3 border-b pb-4">
            <div className="bg-klerosUIComponentsPrimaryBlue/10 flex size-11 items-center justify-center rounded-xl">
              <DollarIcon className="text-klerosUIComponentsPrimaryBlue size-5" />
            </div>
            <div>
              <div className="text-klerosUIComponentsPrimaryText text-2xl font-bold">
                {formatCurrency(realtData.totalInvestment)}
              </div>
              <div className="text-klerosUIComponentsSecondaryText text-xs">
                Total Investment
              </div>
            </div>
          </div>

          {/* Property Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-3">
            <DetailItem
              icon="🏠"
              label="Size"
              value={`${formatNumber(realtData.squareFeet)} sq ft`}
            />
            <DetailItem
              icon="🏢"
              label="Type"
              value={realtData.propertyTypeName}
            />
            <DetailItem
              icon="🛏️"
              label="Beds / Baths"
              value={realtData.bedroomBath}
            />
            <DetailItem
              icon="🔑"
              label="Units"
              value={`${realtData.rentedUnits} / ${realtData.totalUnits}`}
            />
          </div>

          {/* Financial Row */}
          <div className="border-klerosUIComponentsStroke flex gap-4 border-t pt-4">
            <div className="flex-1">
              <div className="text-klerosUIComponentsSecondaryText mb-1 text-xs font-medium tracking-wide uppercase">
                Gross Rent Year
              </div>
              <div className="text-klerosUIComponentsPrimaryText text-sm font-semibold">
                {formatCurrency(realtData.grossRentYear)}
              </div>
            </div>
            <div className="flex-1">
              <div className="text-klerosUIComponentsSecondaryText mb-1 text-xs font-medium tracking-wide uppercase">
                Net Rent Year
              </div>
              <div className="text-klerosUIComponentsPrimaryText text-sm font-semibold">
                {formatCurrency(realtData.netRentYear)}
              </div>
            </div>
          </div>

          {/* Yield Badge */}
          <div className="bg-klerosUIComponentsMediumBlue flex items-center gap-2 rounded-lg px-4 py-2">
            <ChartIcon className="text-klerosUIComponentsSuccess size-4" />
            <span className="text-klerosUIComponentsSuccess text-sm font-semibold">
              {realtData.annualPercentageYield.toFixed(2)}%
            </span>
            <span className="text-klerosUIComponentsSecondaryText text-xs">
              Annual Percentage Yield
            </span>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="relative min-h-[300px] lg:min-h-[400px]">
          {/* Launch Date Badge */}
          <div
            className={clsx(
              "absolute top-4 left-4 z-10",
              "flex items-center gap-2 rounded-lg bg-black/70 px-3 py-2",
              "text-xs font-medium text-white",
            )}
          >
            <CalendarIcon className="size-3" />
            <span>{formatDate(realtData.initialLaunchDate.date)}</span>
            <span className="opacity-70">Launch Date</span>
          </div>
          <Swiper
            navigation
            spaceBetween={0}
            modules={[Navigation, Pagination]}
            pagination={{ clickable: true }}
            className="size-full"
          >
            {realtData.imageLink.map((imageSrc) => (
              <SwiperSlide key={imageSrc}>
                <Image
                  className="max-h-100 object-contain"
                  alt="House image"
                  width={740}
                  height={400}
                  src={imageSrc}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Links Row */}
      <div
        className={clsx(
          "border-klerosUIComponentsStroke bg-klerosUIComponentsWhiteBackground border-t",
          "flex flex-wrap items-center gap-4 px-3 py-4 md:px-6",
        )}
      >
        <ExternalLink url={realtData.marketplaceLink} text="View on RealT" />
        <span className="text-klerosUIComponentsSecondaryText max-md:hidden">
          |
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <GnosisLogo className="size-4 shrink-0" />
          <span className="text-klerosUIComponentsPrimaryText text-sm font-medium">
            Gnosis Contract
          </span>
          <span className="text-klerosUIComponentsSecondaryText text-xs break-all">
            {realtData.gnosisContract}
          </span>
        </div>
      </div>

      {/* More Details Accordion */}
      <Accordion
        aria-label="more-details-accordion"
        className={clsx(
          "w-full max-w-full",
          "[&_#expand-button]:bg-klerosUIComponentsLightBackground [&_#expand-button_p]:font-semibold",
        )}
        items={[
          {
            title: "📋 More Details",
            body: <MoreDetails data={realtData} />,
          },
        ]}
      />

      {/* Misc Data Accordion */}
      {Object.keys(miscDetails).length > 0 && (
        <Accordion
          aria-label="misc-data-accordion"
          className={clsx(
            "w-full max-w-full",
            "[&_#expand-button]:bg-klerosUIComponentsLightBackground [&_#expand-button_p]:text-sm",
          )}
          items={[
            {
              title: `🗄️ Misc Data (${Object.keys(miscDetails).length} fields)`,
              body: <MiscData data={miscDetails} />,
            },
          ]}
        />
      )}
    </div>
  );
};

export default Details;
