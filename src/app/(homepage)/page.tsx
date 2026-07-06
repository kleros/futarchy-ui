"use client";

import React, { useEffect } from "react";

import { Button } from "@kleros/ui-components-library";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { useLocalStorage, useToggle } from "react-use";

import { useMarketsStore } from "@/store/markets";

import { useChartData } from "@/hooks/useChartData";
import { useIsTradingPeriodEnded } from "@/hooks/useIsTradingPeriodEnded";
import { useMarketsHydrated } from "@/hooks/useMarketsHydrated";
import { usePredictionMarkets } from "@/hooks/usePredictionMarkets";

import FirstVisitGuide from "@/components/Guides/FirstVisit";
import Loader from "@/components/Loader";
import Web3Gated from "@/components/Web3Gated";

import { isUndefined } from "@/utils";

import { markets } from "@/consts/markets";

import Header from "./components/Header";
import MarketsSectionSkeleton from "./components/MarketsSectionSkeleton";
import ParticipateSectionSkeleton from "./components/ParticipateSection/ParticipateSectionSkeleton";
import ExportPredictions from "./components/ParticipateSection/CsvUpload/ExportPredictions";

const ParticipateSection = dynamic(
  () => import("./components/ParticipateSection"),
);
const MarketsSection = dynamic(() => import("./components/MarketsSection"), {
  ssr: false,
  loading: () => <MarketsSectionSkeleton />,
});
const PredictAll = dynamic(() => import("./components/PredictAll"));
const AdvancedSection = dynamic(() => import("./components/AdvancedSection"));

const Chart = dynamic(() => import("./components/Chart"), {
  ssr: false,
  loading: () => (
    <div className="flex h-100 w-full items-center justify-center">
      <Loader />
    </div>
  ),
});

export default function Home() {
  const { data: chartData } = useChartData(markets);
  const predictionMarkets = usePredictionMarkets();
  const isTradingPeriodEnded = useIsTradingPeriodEnded();
  const marketsHydrated = useMarketsHydrated();
  const resetPredictionMarkets = useMarketsStore(
    (state) => state.resetPredictionMarkets,
  );

  const [isOpen, toggleGuide] = useToggle(false);
  const [isOnboardingDone, setOnboardingDone] = useLocalStorage<boolean>(
    "onboarding-done",
    false,
  );

  useEffect(() => {
    if (!isOnboardingDone || isUndefined(isOnboardingDone)) {
      toggleGuide(true);
    }
  }, [isOnboardingDone, toggleGuide]);

  return (
    <div className="w-full px-4 py-12 md:px-8 lg:px-32">
      <div className="mx-auto max-w-294">
        <Header />
        <div className="min-h-100">
          {!isUndefined(chartData) ? (
            <Chart data={chartData} />
          ) : (
            <div className="flex h-100 w-full items-center justify-center">
              <Loader />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Web3Gated preload fallback={<ParticipateSectionSkeleton />}>
            <ParticipateSection />
          </Web3Gated>
          <MarketsSection />
          {marketsHydrated && predictionMarkets.length > 0 ? (
            <div
              className={clsx(
                "flex w-full flex-wrap justify-between gap-4",
                "flex-col-reverse items-start sm:flex-row sm:items-center",
              )}
            >
              <Button
                variant="secondary"
                small
                text="Reset Predictions"
                onPress={resetPredictionMarkets}
                isDisabled={isTradingPeriodEnded}
              />
              <ExportPredictions />
            </div>
          ) : null}
          <PredictAll />

          <AdvancedSection />
        </div>

        <FirstVisitGuide
          isVisible={isOpen}
          closeGuide={() => {
            setOnboardingDone(true);
            toggleGuide(false);
          }}
        />
      </div>
    </div>
  );
}
