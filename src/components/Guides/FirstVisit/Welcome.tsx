import React from "react";

import ExternalLink from "@/components/ExternalLink";

import { advancedUserGuide, beginnerUserGuide } from "@/consts/markets";

export const Title: React.FC = () => {
  return <>Welcome!</>;
};

export const SubTitle: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-klerosUIComponentsSecondaryText text-sm">
        Choose between Light and Dark Mode.
        <br /> Check our Beginner User Guide before making your first prediction
        🔥
      </p>
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-8">
        <ExternalLink url={beginnerUserGuide} text="Beginner User Guide" />
        <ExternalLink url={advancedUserGuide} text="Advanced User Guide" />
      </div>
    </div>
  );
};
