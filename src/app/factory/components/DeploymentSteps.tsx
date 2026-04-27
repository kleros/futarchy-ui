import React, { useMemo } from "react";

import { CustomTimeline } from "@kleros/ui-components-library";
import clsx from "clsx";

import { useFactoryStore } from "@/store/factory";

import Spinner from "@/components/Spinner";

import CheckOutline from "@/assets/svg/check-outline.svg";
import CircleOutline from "@/assets/svg/circle-outline.svg";
import CloseOutline from "@/assets/svg/close-circle.svg";

type TimelineItem = React.ComponentProps<
  typeof CustomTimeline
>["items"][number];

const subtitleFor = (
  txHash: `0x${string}` | undefined,
  description: string | undefined,
  error: string | undefined,
) => {
  if (error) return error;
  if (txHash) {
    const short = `${txHash.slice(0, 8)}…${txHash.slice(-6)}`;
    return `Tx ${short}`;
  }
  return description ?? "";
};

const DeploymentSteps: React.FC = () => {
  const steps = useFactoryStore((s) => s.steps);

  const items = useMemo<TimelineItem[]>(() => {
    if (steps.length === 0) {
      return [
        {
          title: "Awaiting deployment",
          subtitle: "Configure the form, then press Deploy.",
          party: "",
          Icon: CircleOutline,
          state: "disabled",
        },
      ] as unknown as TimelineItem[];
    }

    return steps.map<TimelineItem>((step) => {
      const isRunning = step.status === "running";
      const isError = step.status === "error";
      const isSuccess = step.status === "success";

      return {
        title: step.title,
        subtitle: subtitleFor(step.txHash, step.description, step.error),
        party: isRunning ? <Spinner className="mb-1" /> : "",
        Icon: isError ? CloseOutline : isSuccess ? CheckOutline : CircleOutline,
        state: isRunning
          ? "loading"
          : step.status === "pending"
            ? undefined
            : "disabled",
        ...(isError ? { variant: "#ca2314" } : {}),
      } as TimelineItem;
    });
  }, [steps]);

  return (
    <CustomTimeline
      items={items as [TimelineItem, ...TimelineItem[]]}
      className={clsx(
        "[&_li>div:nth-child(1)]:min-h-12",
        "[&_li>div:nth-child(2)]:ml-2 [&_li>div:nth-child(2)]:pt-0.5",
        "[&_li>div:nth-child(1)>div]:border-l-klerosUIComponentsPrimaryBlue [&_li>div:nth-child(1)>div]:my-2",
      )}
    />
  );
};

export default DeploymentSteps;
