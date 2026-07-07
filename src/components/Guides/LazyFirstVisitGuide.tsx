"use client";

import dynamic from "next/dynamic";

const LazyFirstVisitGuide = dynamic(() => import("./FirstVisit"), {
  ssr: false,
});

export default LazyFirstVisitGuide;
