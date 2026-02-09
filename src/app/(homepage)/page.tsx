"use client";

import React, { useEffect } from "react";

import { useLocalStorage, useToggle } from "react-use";

import { useReadGnosisRouterGetWinningOutcomes } from "@/generated";

import MarketContextProvider from "@/context/MarketContext";
import { TradeWalletProvider } from "@/context/TradeWalletContext";
import { useChartData } from "@/hooks/useChartData";

import FirstVisitGuide from "@/components/Guides/FirstVisit";
import Loader from "@/components/Loader";

import { isUndefined } from "@/utils";

import { markets, parentConditionId } from "@/consts/markets";

import AdvancedSection from "./components/AdvancedSection";
import Chart from "./components/Chart";
import Header from "./components/Header";
import ParticipateSection from "./components/ParticipateSection";
import PredictAll from "./components/PredictAll";
import ProjectFunding from "./components/ProjectFunding";

export default function Home() {
  const { data: chartData } = useChartData(markets);

  const { data: winningOutcomes } = useReadGnosisRouterGetWinningOutcomes({
    args: [parentConditionId],
  });

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
        <div className="min-h-96">
          {!isUndefined(chartData) ? (
            <Chart data={chartData} />
          ) : (
            <div className="flex h-96 w-full items-center justify-center">
              <Loader />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <TradeWalletProvider>
            <ParticipateSection />
            <div className="flex flex-col gap-4">
              {markets.map((market, i) => (
                <MarketContextProvider
                  key={market.marketId}
                  selected={winningOutcomes?.at(i)}
                  {...market}
                >
                  <ProjectFunding key={market.marketId} />
                </MarketContextProvider>
              ))}
            </div>
            <PredictAll />
          </TradeWalletProvider>

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
