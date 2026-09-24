"use client";

import dynamic from "next/dynamic";

import { useRedeemableExperiments } from "@/hooks/useRedeemableExperiments";

import { experiments } from "@/consts/experiments";

const ExperimentCard = dynamic(() => import("@/components/ExperimentCard"), {
  loading: () => (
    <div className="bg-klerosUIComponentsStroke min-h-109.5 w-full animate-pulse rounded-xl" />
  ),
});

const ExperimentsGrid: React.FC = () => {
  const redeemableSlugs = useRedeemableExperiments();

  return (
    <div className="my-12 flex w-full flex-wrap justify-center gap-4">
      {experiments.map((experiment, index) => (
        <div
          key={experiment.slug}
          className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)]"
        >
          <ExperimentCard
            {...experiment}
            isRedeemable={redeemableSlugs?.has(experiment.slug)}
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  );
};

export default ExperimentsGrid;
