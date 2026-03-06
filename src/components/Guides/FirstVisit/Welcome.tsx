import React from "react";

import ExternalLink from "@/components/ExternalLink";

import { COWSWAP_ETH_TO_XDAI_SWAP_LINK } from "@/consts";
import { advancedUserGuide, beginnerUserGuide } from "@/consts/markets";

export const Title: React.FC = () => {
  return <>Welcome!</>;
};

export const SubTitle: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-klerosUIComponentsSecondaryText text-sm">
        Check our Beginner User Guide before making your first prediction 🔥{" "}
        <br />
        To trade you will need either xDAI, sDAI, or Foresight Credits on Gnosis
        Chain.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-8">
        <ExternalLink url={beginnerUserGuide} text="Beginner User Guide" />
        <ExternalLink url={advancedUserGuide} text="Advanced User Guide" />
        <ExternalLink url={COWSWAP_ETH_TO_XDAI_SWAP_LINK} text="Acquire xDAI" />
      </div>
    </div>
  );
};
