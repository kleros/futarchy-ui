"use client";

import React from "react";

import { Card } from "@kleros/ui-components-library";

import { projects } from "@/projects";

import { useChartData } from "@/hooks/useChartData";

import Mint from "@/components/Mint";
import ProjectFunding from "@/components/ProjectFunding";

import Chart from "./components/Chart";
import Header from "./components/Header";

export default function Home() {
  const { data: chartData } = useChartData([
    {
      marketId: "0xa77dd0d6988f0f79b056d3196fa67f2488370909",
      maxValue: 4,
      marketName: "Property A",
    },
    {
      marketId: "0x19AEAa9495d865FdbB7699C595F6ECc4575a4dcd",
      maxValue: 5,
      marketName: "Property B",
    },
  ]);

  return (
    <div className="w-full px-4 py-12 md:px-8 lg:px-32">
      <div className="mx-auto max-w-294">
        <Header />
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
