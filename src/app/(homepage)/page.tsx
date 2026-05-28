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

        <div className="my-12 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {experiments.map((experiment) => (
            <ExperimentCard key={experiment.slug} {...experiment} />
          ))}
        </div>
        <BottomHeader />
      </div>
    </div>
  );
}
