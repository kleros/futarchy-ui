import React from "react";

import { Tag } from "@kleros/ui-components-library";

import { futarchyFactoryAddress } from "@/generated";

import ExternalLink from "@/components/ExternalLink";

import { shortenAddress } from "@/utils";

const Header: React.FC = () => (
  <div className="flex flex-col gap-3">
    <div className="flex flex-wrap items-center gap-3">
      <h1 className="text-klerosUIComponentsPrimaryText text-2xl font-semibold">
        Deploy Futarchy Session
      </h1>
      <Tag text="Gnosis" />
    </div>
    <p className="text-klerosUIComponentsSecondaryText max-w-3xl text-sm">
      Wraps Seer&apos;s <code className="font-mono">MarketFactory</code> to
      deploy either a categorical parent (single winning outcome plus invalid)
      or a multi-categorical parent (non-empty subset of outcomes). Each parent
      outcome gets one scalar child market. Up to six children deploy
      atomically; larger sessions open the parent first, then batches of
      children.
    </p>
    <div className="text-klerosUIComponentsSecondaryText flex items-center gap-2 text-xs">
      <span>Factory:</span>
      <ExternalLink
        url={`https://gnosis.blockscout.com/address/${futarchyFactoryAddress}`}
        text={shortenAddress(futarchyFactoryAddress)}
      />
    </div>
  </div>
);

export default Header;
