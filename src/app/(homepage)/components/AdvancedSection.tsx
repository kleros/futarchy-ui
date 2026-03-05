import { useCallback } from "react";

import { Card } from "@kleros/ui-components-library";
import clsx from "clsx";
import Link from "next/link";

import { useAllRealtMarketData } from "@/hooks/useRealtMarketData";

import LightButton from "@/components/LightButton";
import SeerLogo from "@/components/SeerLogo";

import DownloadIcon from "@/assets/svg/download.svg";
import ExternalArrow from "@/assets/svg/external-arrow.svg";

import { downloadCsvFile, generateRealtDataCsv } from "@/utils/csv";

import { markets } from "@/consts/markets";

const contractAddresses = markets.map((m) => m.details.contract);

const AdvancedSection: React.FC = () => {
  const { data: allRealtData, isLoading } = useAllRealtMarketData();

  const handleDownloadCsv = useCallback(() => {
    if (!allRealtData) return;
    const csv = generateRealtDataCsv(allRealtData, contractAddresses);
    downloadCsvFile("realt-market-data.csv", csv);
  }, [allRealtData]);

  return (
    <Card
      round
      className={clsx(
        "border-gradient-purple-blue mb-42 h-auto w-full border-none px-4 py-6 md:px-8",
        "flex flex-col-reverse items-start justify-center gap-x-8 gap-y-4",
        "md:flex-row md:items-center md:justify-between",
      )}
    >
      <div className="flex flex-col items-start gap-2">
        <h3 className="text-klerosUIComponentsPrimaryText text-base font-semibold">
          Advanced
        </h3>
        <p className="text-klerosUIComponentsSecondaryText text-sm">
          Check the opportunities if you want to LP or Trade specific outcome
          tokens in Seer.&nbsp;
          <Link
            href={
              "https://app.seer.pm/markets/100/which-movies-will-clement-watch-as-part-of-the-distilled-clements-judgement-expe-2"
            }
            target="_blank"
            rel="noreferrer noopener"
            className="text-klerosUIComponentsPrimaryBlue items-center text-sm"
          >
            Check it out <ExternalArrow className="ml-2 inline size-4" />
          </Link>
        </p>
        <div>
          <span className="text-klerosUIComponentsSecondaryText mr-1 text-sm">
            Download the latest data (updated in the last 24 hours) for the 9
            properties in CSV format
          </span>
          <LightButton
            text={isLoading ? "Loading..." : "here"}
            onPress={handleDownloadCsv}
            isDisabled={isLoading || !allRealtData}
            small
            className={clsx(
              "inline-flex flex-row-reverse p-0",
              "[&_.button-text]:text-klerosUIComponentsPrimaryBlue [&_.button-text]:text-sm",
              "hover:bg-transparent",
            )}
            icon={
              <DownloadIcon className="[&_path]:fill-klerosUIComponentsPrimaryBlue! ml-2" />
            }
          />
        </div>
      </div>
      <SeerLogo className="shrink-0" />
    </Card>
  );
};
export default AdvancedSection;
