"use client";

import { useState } from "react";

import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Countdown, { type CountdownRenderProps } from "react-countdown";

import RealtDarkIcon from "@/assets/experiments/realt-dark.svg";
import RealtLightIcon from "@/assets/experiments/realt-light.svg";
import ArrowIcon from "@/assets/svg/arrow-right.svg";
import TradingIcon from "@/assets/svg/chart-bar.svg";
import CountdownIcon from "@/assets/svg/cronometer.svg";
import TagIcon from "@/assets/svg/tag-category.svg";

import { type ExperimentStatus, type IExperiment } from "@/consts/experiments";

const IMAGE_HEIGHT_DEFAULT = 180;
const IMAGE_HEIGHT_HOVERED = 80;

const statusStyles: Record<
  ExperimentStatus,
  { label: string; className: string }
> = {
  live: {
    label: "Live",
    className: "bg-[#00c853] text-white",
  },
  ended: {
    label: "Ended",
    className:
      "bg-white/80 text-gray-700 backdrop-blur-sm dark:bg-black/60 dark:text-gray-300",
  },
  "coming soon": {
    label: "Coming Soon",
    className: "bg-klerosUIComponentsPrimaryBlue text-white",
  },
};

const iconMap: Record<
  string,
  | {
      type: "image";
      light: string;
      dark: string;
      width: number;
      height: number;
    }
  | {
      type: "svg";
      light: React.FC<React.SVGProps<SVGElement>>;
      dark: React.FC<React.SVGProps<SVGElement>>;
    }
> = {
  movie: {
    type: "image",
    light: "/experiment-icons/movie-light.png",
    dark: "/experiment-icons/movie-dark.png",
    width: 46,
    height: 40,
  },
  realt: { type: "svg", light: RealtLightIcon, dark: RealtDarkIcon },
};

const countdownRenderer = ({
  days,
  hours,
  minutes,
  completed,
}: CountdownRenderProps) => {
  if (completed) {
    return (
      <span
        className="text-klerosUIComponentsPrimaryText text-sm font-semibold"
        suppressHydrationWarning
      >
        Ended
      </span>
    );
  }
  return (
    <span
      className="text-klerosUIComponentsPrimaryText text-sm font-semibold"
      suppressHydrationWarning
    >
      {days > 0 && `${days}d `}
      {hours > 0 && `${hours}h:`}
      {minutes > 0 && `${minutes}m `}
    </span>
  );
};

export interface ExperimentCardProps extends IExperiment {
  priority?: boolean;
}

const ExperimentCard: React.FC<ExperimentCardProps> = ({
  name,
  question,
  url,
  icon,
  banner,
  countLabel,
  tradingPeriod,
  endTime,
  status,
  priority = false,
}) => {
  const [hovered, setHovered] = useState(false);
  const icons = iconMap[icon];

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={clsx(
          "border-gradient-purple-blue bg-klerosUIComponentsWhiteBackground relative overflow-hidden",
          "min-h-109.5 w-full min-w-0 rounded-xl",
          hovered && "drop-shadow-[0_8px_12px_rgba(72,114,255,0.16)]",
        )}
      >
        <motion.div
          className="absolute inset-x-0.25 top-0.25 overflow-hidden rounded-t-[11px]"
          animate={{
            height: hovered ? IMAGE_HEIGHT_HOVERED : IMAGE_HEIGHT_DEFAULT,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="relative size-full">
            <Image
              src={banner}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
              priority={priority}
              className="object-cover"
            />
          </div>
          <motion.div
            className="bg-klerosUIComponentsWhiteBackground absolute inset-0"
            animate={{ opacity: hovered ? 0.7 : 0 }}
            transition={{ duration: 0.25 }}
          />
          <span
            className={clsx(
              "absolute top-3 right-3 rounded-full px-2.5 py-0.5 text-xs font-medium",
              statusStyles[status].className,
            )}
          >
            {statusStyles[status].label}
          </span>
        </motion.div>

        <motion.div
          className="absolute inset-x-0 bottom-0 flex flex-col"
          animate={{
            top: hovered ? IMAGE_HEIGHT_HOVERED : IMAGE_HEIGHT_DEFAULT,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-6 pt-4.5">
            <div
              className={clsx(
                "border-b-klerosUIComponentsSecondaryBlue border-b",
                "flex shrink-0 flex-col items-start gap-2 pb-4",
              )}
            >
              <h3 className="text-klerosUIComponentsPrimaryBlue text-base font-semibold">
                {name}
              </h3>
              <p className="text-klerosUIComponentsPrimaryText line-clamp-2 min-h-[2lh] text-sm leading-relaxed">
                {question}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <TagIcon />
              <span className="text-klerosUIComponentsPrimaryBlue text-sm font-semibold">
                {countLabel}
              </span>
            </div>
            <AnimatePresence>
              {hovered ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                  className="mt-2 flex flex-col gap-2"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <TradingIcon className="size-4 shrink-0 [&_path]:fill-[#4872FF]" />
                    <span className="text-klerosUIComponentsSecondaryText shrink-0 text-sm">
                      Trading Period:
                    </span>
                    <span className="text-klerosUIComponentsPrimaryText text-sm font-semibold">
                      {tradingPeriod}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CountdownIcon className="size-4 [&_path]:fill-[#4872FF]" />
                    <span className="text-klerosUIComponentsSecondaryText text-sm">
                      Countdown:
                    </span>
                    <Countdown
                      date={new Date(endTime * 1000)}
                      renderer={countdownRenderer}
                    />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <div className="relative z-10 flex shrink-0 items-center justify-between p-6">
            {icons?.type === "image" ? (
              <>
                <Image
                  src={icons.light}
                  alt=""
                  width={icons.width}
                  height={icons.height}
                  className="dark:hidden"
                  aria-hidden
                />
                <Image
                  src={icons.dark}
                  alt=""
                  width={icons.width}
                  height={icons.height}
                  className="hidden dark:block"
                  aria-hidden
                />
              </>
            ) : icons?.type === "svg" ? (
              (() => {
                const LightIcon = icons.light;
                const DarkIcon = icons.dark;
                return (
                  <>
                    <LightIcon className="dark:hidden" aria-hidden />
                    <DarkIcon className="hidden dark:block" aria-hidden />
                  </>
                );
              })()
            ) : null}
            <div className="flex items-center gap-2">
              <span className="text-klerosUIComponentsPrimaryBlue text-sm">
                View
              </span>
              <ArrowIcon />
            </div>
          </div>
        </motion.div>
      </div>
    </Link>
  );
};

export default ExperimentCard;
