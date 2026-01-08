import { PredictionMarket } from "@/store/markets";

import marketFromName from "./marketIdFromName";

import { isUndefined } from ".";

export const parseMarketCSV = (csvText: string): Record<string, number> => {
  const lines = csvText.trim().split("\n");

  if (lines.length < 2) {
    throw new Error("CSV must have at least a header row and one data row");
  }

  const headers = lines[0].split(",").map((h) => h.trim());

  // Check for required columns
  if (headers.length !== 2) {
    throw new Error("CSV must have exactly 2 columns: marketName, score");
  }

  if (!headers.includes("marketName") || !headers.includes("score")) {
    throw new Error("CSV must have columns: marketName, score");
  }

  const result: Record<string, number> = {};

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines

    const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);

    if (isUndefined(values) || values.length !== 2) {
      throw new Error(
        `Row ${i + 1}: Expected 2 columns, found ${values?.length}`,
      );
    }

    // remove quotes
    const marketName = values[0].replace(/^"|"$/g, "");
    const scoreStr = values[1];
    // Check for empty values
    if (!marketName || !scoreStr) {
      throw new Error(`Row ${i + 1}: All columns must have values`);
    }
    const market = marketFromName(marketName);

    if (!market) {
      throw new Error(`Row ${i + 1}: No market found named: ${marketName}`);
    }

    const marketId = market.marketId;

    // Validate score
    const score = parseFloat(scoreStr);
    if (isNaN(score)) {
      throw new Error(
        `Row ${i + 1}: Score "${scoreStr}" is not a valid number`,
      );
    }

    if (score < 0) {
      throw new Error(`Row ${i + 1}: Score cannot be negative`);
    }

    result[marketId] = score;
  }

  if (Object.values(result).length === 0) {
    throw new Error("CSV contains no valid data rows");
  }

  return result;
};

export function generateMarketCsv(markets: Record<string, PredictionMarket>) {
  const header = ["marketName", "score"];

  const rows = Object.values(markets).map((market) => [
    `"${market.name}"`,
    market.prediction ?? market?.marketEstimate,
  ]);

  const csvContent = [header, ...rows]
    .map((row) => row.map((v) => `${v}`).join(","))
    .join("\n");

  return csvContent;
}

export function downloadCsvFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
