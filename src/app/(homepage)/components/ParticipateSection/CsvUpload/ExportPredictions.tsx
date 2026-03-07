import { useCallback } from "react";

import clsx from "clsx";

import { useMarketsStore } from "@/store/markets";

import LightButton from "@/components/LightButton";

import DownloadIcon from "@/assets/svg/download.svg";

import { downloadCsvFile, generateMarketCsv } from "@/utils/csv";

const ExportPredictions: React.FC = () => {
  const markets = useMarketsStore((state) => state.markets);

  const handleExport = useCallback(() => {
    const csv = generateMarketCsv(markets);
    downloadCsvFile(`market-predictions-${new Date().toDateString()}.csv`, csv);
  }, [markets]);

  return (
    <LightButton
      text="Export Predictions"
      onPress={handleExport}
      small
      className={clsx(
        "flex-row-reverse p-0",
        "[&_.button-text]:text-klerosUIComponentsPrimaryBlue [&_.button-text]:text-sm [&_.button-text]:font-normal",
        "hover:bg-klerosUIComponentsWhiteBackground",
      )}
      icon={
        <DownloadIcon className="[&_path]:fill-klerosUIComponentsPrimaryBlue! ml-2" />
      }
    />
  );
};

export default ExportPredictions;
