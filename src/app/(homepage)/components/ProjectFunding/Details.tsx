import React from "react";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import CalendarIcon from "@/assets/svg/calendar.svg";
import ChartIcon from "@/assets/svg/chart-bar.svg";
import DollarIcon from "@/assets/svg/dollar.svg";
import ExternalArrowIcon from "@/assets/svg/external-arrow.svg";
import GeoPin from "@/assets/svg/geo-pin.svg";
import GnosisLogo from "@/assets/svg/gnosis.svg";
import HomeIcon from "@/assets/svg/home.svg";

import { IDetails } from "@/consts/markets";

const Details: React.FC<IDetails> = ({
  fullName,
  totalInvestment,
  squareFeet,
  propertyType,
  grossRentYear,
  netRentYear,
  initialLaunchDate,
  annualPercentageYield,
  coordinate,
  marketplaceLink,
  images,
  contract,
}) => (
  <div className="flex flex-col gap-4">
    <div className="flex items-center gap-4">
      <GeoPin className="shrink-0" />
      <strong className="text-klerosUIComponentsPrimaryText text-2xl">
        {fullName}
      </strong>
      <small>{coordinate}</small>
    </div>
    <div className="bg-klerosUIComponentsWhiteBackground p-4">
      <div className="flex items-center gap-4">
        <Value
          icon={DollarIcon}
          title={totalInvestment}
          subtitle="Total investment"
          big
        />
      </div>
      <hr className="mt-2 mb-4" />
      <div>
        <div className="text-klerosUIComponentsPrimaryText mb-2 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <HomeIcon />
            <strong> {`${squareFeet} sq ft`} </strong>
          </div>
          <span className="text-klerosUIComponentsSecondaryText">|</span>
          <strong>{propertyType}</strong>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Value
            icon={DollarIcon}
            title={grossRentYear}
            subtitle="Gross Rent Year"
          />
          |
          <Value
            icon={DollarIcon}
            title={netRentYear}
            subtitle="Net Rent Year"
          />
          |
          <Value
            icon={CalendarIcon}
            title={initialLaunchDate}
            subtitle="Initial Launch Date"
          />
          |
          <Value
            icon={ChartIcon}
            title={annualPercentageYield}
            subtitle="Annual Percentage Yield"
          />
        </div>
      </div>
    </div>
    <Swiper
      navigation
      spaceBetween={24}
      modules={[Navigation, Pagination]}
      className="h-96 w-full xl:h-[740px]"
    >
      {images.map((imageSrc) => (
        <SwiperSlide key={imageSrc}>
          <Image
            className="size-full rounded-2xl object-contain"
            alt="House image"
            width={740}
            height={740}
            src={imageSrc}
          />
        </SwiperSlide>
      ))}
    </Swiper>
    <div className="bg-klerosUIComponentsWhiteBackground flex gap-4 px-4 py-6">
      <Link
        href={marketplaceLink}
        className="text-klerosUIComponentsPrimaryBlue flex items-center gap-2"
      >
        Marketplace Link <ExternalArrowIcon className="size-4" />
      </Link>
      |
      <Value icon={GnosisLogo} title="Gnosis Contract" subtitle={contract} />
    </div>
  </div>
);

interface IValue {
  className?: string;
  icon: React.FC<React.SVGProps<SVGElement>>;
  title: string;
  subtitle?: string;
  big?: boolean;
}

const Value: React.FC<IValue> = ({
  className,
  icon: Icon,
  title,
  subtitle,
  big,
}) => (
  <div
    className={clsx("flex items-center", big ? "gap-4" : "gap-2", className)}
  >
    <Icon className={clsx("shrink-0", big ? "size-6" : "size-4")} />
    <strong
      className={clsx(
        "text-klerosUIComponentsPrimaryText",
        big ? "text-2xl" : "",
      )}
    >
      {title}
    </strong>
    {subtitle ? (
      <small className={big ? "text-md" : "text-xs"}>{subtitle}</small>
    ) : null}
  </div>
);

export default Details;
