"use client";

import { useEffect, useState } from "react";

import { type RedeemableResponse } from "@/app/api/redeemable/route";

export const useRedeemableExperiments = () => {
  const [redeemableSlugs, setRedeemableSlugs] = useState<Set<string>>();

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/redeemable", { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error(`redeemable responded with ${res.status}`);
        return (await res.json()) as RedeemableResponse;
      })
      .then(({ experiments }) =>
        setRedeemableSlugs(
          new Set(
            experiments
              .filter(({ isRedeemable }) => isRedeemable)
              .map(({ slug }) => slug),
          ),
        ),
      )
      .catch((error) => {
        if (controller.signal.aborted) return;
        console.error("useRedeemableExperiments", error);
      });

    return () => controller.abort();
  }, []);

  return redeemableSlugs;
};
