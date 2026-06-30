import dynamic from "next/dynamic";

import { experiments } from "@/consts/experiments";

import BottomHeader from "./components/BottomHeader";
import Header from "./components/Header";
import HomepageOverlay from "./components/HomepageOverlay";

const ExperimentCard = dynamic(() => import("@/components/ExperimentCard"), {
  loading: () => (
    <div className="bg-klerosUIComponentsStroke min-h-109.5 w-full animate-pulse rounded-xl" />
  ),
});

export default function Home() {
  return (
    <div className="relative w-full px-4 pt-6 pb-12 md:px-8 lg:px-32">
      <HomepageOverlay />
      <div className="mx-auto max-w-294">
        <Header />

        <div className="my-12 flex w-full flex-wrap justify-center gap-4">
          {experiments.map((experiment, index) => (
            <div
              key={experiment.slug}
              className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)]"
            >
              <ExperimentCard {...experiment} priority={index === 0} />
            </div>
          ))}
        </div>
        <BottomHeader />
      </div>
    </div>
  );
}
