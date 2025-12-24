import { useCallback } from "react";

import clsx from "clsx";

import { useMarketsStore } from "@/store/markets";

import LightButton from "@/components/LightButton";

import DownloadIcon from "@/assets/svg/download.svg";

import { downloadCsvFile, generateMarketCsv } from "@/utils/csv";

const CsvDownload: React.FC = () => {
  const markets = useMarketsStore((state) => state.markets);
  const handleDownload = useCallback(() => {
    const csv = generateMarketCsv(markets);
    downloadCsvFile("market-predictions.csv", csv);
  }, [markets]);

  return (
    <LightButton
      text="Download CSV Template"
      onPress={handleDownload}
      small
      className={clsx(
        "flex-row-reverse p-0",
        "[&_.button-text]:text-klerosUIComponentsPrimaryBlue [&_.button-text]:text-sm [&_.button-text]:font-normal",
      )}
      icon={
        <DownloadIcon className="[&_path]:fill-klerosUIComponentsPrimaryBlue! ml-2" />
      }
    />
  );
};

export default CsvDownload;
