"use client";

import React from "react";

import { Card } from "@kleros/ui-components-library";

import { useChartData } from "@/hooks/useChartData";

import Loader from "@/components/Loader";
import ProjectFunding from "@/components/ProjectFunding";

import { markets } from "@/consts/markets";

import Chart from "./components/Chart";
import Header from "./components/Header";
import ParticipateSection from "./components/ParticipateSection";

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
            <Loader />
          )}
        </div>

        <div className="flex flex-col gap-4">
          <ParticipateSection />
          <Card
            round
            className="border-klerosUIComponentsSecondaryPurple h-auto w-full px-8 py-6"
          >
            <p className="text-klerosUIComponentsPrimaryText">
              <strong>2nd</strong> Set estimates for the projects below. You can
              choose how many projects you want to predict.
            </p>
          </Card>
          <div className="mt-8 flex flex-col gap-4">
            {markets.map((market) => (
              <ProjectFunding key={market.name} {...market} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
