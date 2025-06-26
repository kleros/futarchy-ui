"use client";

import React from "react";

import CowContextProvider from "@/context/CowContext";
import { useChartData } from "@/hooks/useChartData";

import Loader from "@/components/Loader";

import { markets } from "@/consts/markets";

import AdvancedSection from "./components/AdvancedSection";
import Chart from "./components/Chart";
import Header from "./components/Header";
import ParticipateSection from "./components/ParticipateSection";
import ProjectFunding from "./components/ProjectFunding";

export default function Home() {
  const { data: chartData } = useChartData(markets);

  return (
    <div className="w-full px-4 py-12 md:px-8 lg:px-32">
      <div className="mx-auto max-w-294">
        <Header />
        <div className="h-96">
          {typeof chartData !== "undefined" ? (
            <Chart data={chartData} />
          ) : (
            <div className="flex size-full items-center justify-center">
              <Loader />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <CowContextProvider>
            <ParticipateSection />
            <div className="mt-8 flex flex-col gap-4">
              {markets.map((market) => (
                <ProjectFunding key={market.name} {...market} />
              ))}
            </div>
            <AdvancedSection />
          </CowContextProvider>
        </div>
      </div>
    </div>
  );
}
