"use client";

import React from "react";

import { experiments } from "@/consts/experiments";

import BottomHeader from "./components/BottomHeader";
import ExperimentCard from "./components/ExperimentCard";
import Header from "./components/Header";
import HomepageOverlay from "./components/HomepageOverlay";

export default function Home() {
  return (
    <div className="relative w-full px-4 pt-6 pb-12 md:px-8 lg:px-32">
      <HomepageOverlay />
      <div className="mx-auto max-w-294">
        <Header />

        <div className="my-12 flex w-full flex-wrap justify-center gap-4">
          {experiments.map((experiment) => (
            <div
              key={experiment.slug}
              className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)]"
            >
              <ExperimentCard {...experiment} />
            </div>
          ))}
        </div>
        <BottomHeader />
      </div>
    </div>
  );
}
