import { useCallback } from "react";

import { useMarketsStore } from "@/store/markets";

import LightButton from "@/components/LightButton";

import { downloadCsvFile, generateMarketCsv } from "@/utils/csv";

const CsvDownload: React.FC = () => {
  const markets = useMarketsStore((state) => state.markets);
  const handleDownload = useCallback(() => {
    const csv = generateMarketCsv(markets);
    downloadCsvFile("market-predictions.csv", csv);
  }, [markets]);

  return (
    <LightButton
      text="Download template csv"
      onPress={handleDownload}
      small
      className="[&_.button-text]:text-klerosUIComponentsSecondaryText"
    />
  );
};

export default CsvDownload;
