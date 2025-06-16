"use client";

import React from "react";

import { Card } from "@kleros/ui-components-library";

import { projects } from "@/consts";
import Mint from "@/components/Mint";
import ProjectFunding from "@/components/ProjectFunding";
import Chart from "@/components/Chart";
import { useChartData } from "@/hooks/useChartData";

export default function Home() {
  const { data: chartData } = useChartData(
    "0xa77dd0d6988f0f79b056d3196fa67f2488370909",
    4,
  );
  return (
    <div className="w-full py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-klerosUIComponentsPrimaryText text-2xl font-bold">
          Session 1 - Property Prices
        </h1>
        <div className="h-96">
          {typeof chartData !== "undefined" ? <Chart data={chartData} /> : null}
        </div>
        <h2 className="text-klerosUIComponentsPrimaryText mt-12 text-xl font-bold">
          Participate
        </h2>
        <div className="flex flex-col gap-4">
          <Card
            round
            className="border-klerosUIComponentsSecondaryPurple h-auto w-full px-8 pt-6 pb-12"
          >
            <p className="text-klerosUIComponentsPrimaryText">
              <strong>1st</strong> Convert sDAI or xDAI into Project Tokens
            </p>
            <Mint />
          </Card>
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
            {projects.map((project) => (
              <ProjectFunding key={project.name} {...project} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
