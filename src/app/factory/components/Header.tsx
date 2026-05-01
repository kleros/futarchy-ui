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
      deploy a multi-categorical parent and one scalar child per parent outcome.
      Any non-empty subset of parent outcomes can resolve true. Up to 6 children
      deploy in a single transaction; larger sessions are deployed in phases,
      signing batches of children after the parent.
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
