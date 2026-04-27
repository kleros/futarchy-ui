import React, { useMemo } from "react";

import { Button, Copiable } from "@kleros/ui-components-library";
import clsx from "clsx";

import { futarchyFactoryAddress } from "@/generated";
import { useFactoryStore } from "@/store/factory";

import ExternalLink from "@/components/ExternalLink";

import { shortenAddress } from "@/utils";
import { buildSessionSnapshot } from "@/utils/factory";

import { DEFAULT_CHAIN } from "@/consts";

const SessionResult: React.FC = () => {
  const sessionId = useFactoryStore((s) => s.sessionId);
  const parentMarket = useFactoryStore((s) => s.parentMarket);
  const childMarkets = useFactoryStore((s) => s.childMarkets);
  const parent = useFactoryStore((s) => s.parent);
  const children = useFactoryStore((s) => s.children);
  const steps = useFactoryStore((s) => s.steps);

  const snapshot = useMemo(() => {
    if (!sessionId || !parentMarket) return null;
    return buildSessionSnapshot({
      factory: futarchyFactoryAddress,
      chainId: DEFAULT_CHAIN.id,
      sessionId,
      parentMarket,
      childMarkets,
      parent,
      children,
      steps,
    });
  }, [sessionId, parentMarket, childMarkets, parent, children, steps]);

  const json = useMemo(
    () => (snapshot ? JSON.stringify(snapshot, null, 2) : ""),
    [snapshot],
  );

  if (!snapshot) return null;

  const filename = `futarchy-session-${snapshot.session.id}.json`;

  const handleDownload = () => {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={clsx(
        "border-klerosUIComponentsStroke rounded-base flex flex-col gap-4 border p-4",
        "bg-klerosUIComponentsMediumBlue",
      )}
    >
      <div className="flex flex-col gap-1">
        <h3 className="text-klerosUIComponentsPrimaryText text-sm font-semibold">
          Session deployed · #{snapshot.session.id}
        </h3>
        <p className="text-klerosUIComponentsSecondaryText text-xs">
          Snapshot is ready to drop into{" "}
          <code className="font-mono">src/consts/markets.ts</code>. Wrapped
          token addresses and condition ids resolve from the Seer subgraph once
          it indexes these markets.
        </p>
      </div>

      <div className="text-klerosUIComponentsSecondaryText flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
        <span className="flex items-center gap-1">
          Parent:&nbsp;
          <ExternalLink
            url={`https://gnosis.blockscout.com/address/${snapshot.parent.marketId}`}
            text={shortenAddress(snapshot.parent.marketId)}
          />
        </span>
        {snapshot.markets.length > 0 ? (
          <span className="flex flex-wrap items-center gap-1">
            <span>Children:</span>
            {snapshot.markets.map((m) => (
              <ExternalLink
                key={m.marketId}
                url={`https://gnosis.blockscout.com/address/${m.marketId}`}
                text={shortenAddress(m.marketId)}
              />
            ))}
          </span>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Copiable
          copiableContent={json}
          info="Copy JSON"
          tooltipProps={{ small: true }}
          className="text-klerosUIComponentsPrimaryBlue text-xs font-semibold"
        >
          <span>Copy snapshot</span>
        </Copiable>
        <Button
          small
          variant="secondary"
          text="Download JSON"
          onPress={handleDownload}
        />
      </div>

      <pre
        className={clsx(
          "border-klerosUIComponentsStroke rounded-base border p-3",
          "bg-klerosUIComponentsWhiteBackground text-klerosUIComponentsPrimaryText",
          "max-h-96 overflow-auto font-mono text-[11px] leading-snug",
        )}
      >
        {json}
      </pre>
    </div>
  );
};

export default SessionResult;
