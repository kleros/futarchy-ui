import React, { useEffect, useMemo, useState } from "react";

import { Button, Copiable } from "@kleros/ui-components-library";
import clsx from "clsx";
import { useAccount } from "wagmi";

import { futarchyFactoryAddress } from "@/generated";
import { useFactoryStore } from "@/store/factory";

import ExternalLink from "@/components/ExternalLink";

import { shortenAddress } from "@/utils";
import { buildSessionSnapshot, type SessionSnapshot } from "@/utils/factory";
import { fetchSeerChildMarketSnapshotFields } from "@/utils/seerMarketReads";

import { DEFAULT_CHAIN } from "@/consts";

const SessionResult: React.FC = () => {
  const sessionId = useFactoryStore((s) => s.sessionId);
  const parentMarket = useFactoryStore((s) => s.parentMarket);
  const childMarkets = useFactoryStore((s) => s.childMarkets);
  const parent = useFactoryStore((s) => s.parent);
  const children = useFactoryStore((s) => s.children);
  const steps = useFactoryStore((s) => s.steps);
  const { address: deployer } = useAccount();

  const [snapshot, setSnapshot] = useState<SessionSnapshot | null>(null);
  const [isLoadingChainReads, setIsLoadingChainReads] = useState(false);

  useEffect(() => {
    if (!sessionId || !parentMarket) {
      setSnapshot(null);
      return;
    }

    const basePayload = {
      factory: futarchyFactoryAddress,
      chainId: DEFAULT_CHAIN.id,
      sessionId,
      parentMarket,
      childMarkets,
      parent,
      children,
      steps,
      deployer: deployer ?? undefined,
    };

    let cancelled = false;

    async function refresh() {
      setIsLoadingChainReads(true);

      try {
        if (children.length !== childMarkets.length) {
          if (!cancelled) {
            setSnapshot(buildSessionSnapshot(basePayload));
          }
          return;
        }

        const partialSnapshot = buildSessionSnapshot(basePayload);
        if (!cancelled) {
          setSnapshot(partialSnapshot);
        }

        if (childMarkets.length === 0) {
          return;
        }

        const chainReads =
          await fetchSeerChildMarketSnapshotFields(childMarkets);

        if (!cancelled) {
          setSnapshot(
            buildSessionSnapshot({
              ...basePayload,
              ...(chainReads.some((r) => r !== null)
                ? { childMarketChain: chainReads }
                : {}),
            }),
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingChainReads(false);
        }
      }
    }

    void refresh();

    return () => {
      cancelled = true;
    };
  }, [
    sessionId,
    parentMarket,
    childMarkets,
    parent,
    children,
    steps,
    deployer,
  ]);

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

  const parentKindLabel =
    snapshot.parent.parentMarketKind === "multicategorical"
      ? "multi-categorical"
      : "categorical";

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
          Parent type:{" "}
          <span className="text-klerosUIComponentsPrimaryText font-semibold">
            {parentKindLabel}
          </span>
          . Snapshot merges form data with{" "}
          <code className="font-mono">Market.sol</code> reads (
          <code className="font-mono">
            wrappedOutcome(i).wrapped1155 + conditionId()
          </code>
          ){isLoadingChainReads ? " … loading on-chain metadata." : ""}
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
          className={clsx(
            "text-xs font-semibold",
            json
              ? "text-klerosUIComponentsPrimaryBlue"
              : "text-klerosUIComponentsSecondaryText",
          )}
        >
          <span>Copy snapshot</span>
        </Copiable>
        <Button
          small
          variant="secondary"
          text="Download JSON"
          onPress={handleDownload}
          isDisabled={isLoadingChainReads || !json}
        />
      </div>

      <pre
        className={clsx(
          "border-klerosUIComponentsStroke rounded-base border p-3",
          "bg-klerosUIComponentsWhiteBackground text-klerosUIComponentsPrimaryText",
          "max-h-96 overflow-auto font-mono text-[11px] leading-snug",
        )}
      >
        {json || (isLoadingChainReads ? "Loading…" : "")}
      </pre>
    </div>
  );
};

export default SessionResult;
