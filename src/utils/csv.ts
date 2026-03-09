import Papa from "papaparse";

import { PredictionMarket } from "@/store/markets";

import marketFromName from "./marketIdFromName";

import { formatWithPrecision } from ".";

export const parseMarketCSV = (csvText: string): Record<string, number> => {
  const parsed = Papa.parse<{ marketName: string; score: string }>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.errors.length > 0) {
    const firstError = parsed.errors[0];
    throw new Error(
      `CSV parse error${firstError.row != null ? ` at row ${firstError.row + 1}` : ""}: ${firstError.message}`,
    );
  }

  const rows = parsed.data;
  const fields = parsed.meta.fields;

  if (rows.length === 0) {
    throw new Error("CSV must have at least a header row and one data row");
  }

  // Check for required columns (matches original strict validation)
  if (!fields || fields.length !== 2) {
    throw new Error("CSV must have exactly 2 columns: marketName, score");
  }

  if (!fields.includes("marketName") || !fields.includes("score")) {
    throw new Error("CSV must have columns: marketName, score");
  }

  const result: Record<string, number> = {};

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row) continue;

    const marketName = String(row.marketName ?? "").trim();
    const scoreStr = String(row.score ?? "").trim();

    if (!marketName || !scoreStr) {
      throw new Error(`Row ${i + 2}: All columns must have values`);
    }
    const market = marketFromName(marketName);

    if (!market) {
      throw new Error(`Row ${i + 2}: No market found named: ${marketName}`);
    }

    const marketId = market.marketId;

    // Validate score
    const score = parseFloat(scoreStr);
    if (isNaN(score)) {
      throw new Error(
        `Row ${i + 2}: Score "${scoreStr}" is not a valid number`,
      );
    }

    if (score < 0) {
      throw new Error(`Row ${i + 2}: Score cannot be negative`);
    }

    const maxScore = formatWithPrecision(
      market.maxValue * market.precision,
      market.precision,
    );
    if (score > +maxScore) {
      throw new Error(
        `Row ${i + 2}: Score cannot be greater than the max value of ${maxScore}`,
      );
    }

    result[marketId] = Math.round(score * market.precision);
  }

  if (Object.values(result).length === 0) {
    throw new Error("CSV contains no valid data rows");
  }

  return result;
};

export function generateMarketCsv(markets: Record<string, PredictionMarket>) {
  const data = Object.values(markets).map((market) => ({
    marketName: market.name,
    score: formatWithPrecision(
      market.prediction ?? market.marketEstimate ?? 0,
      market.precision,
    ),
  }));

  return Papa.unparse(data, {
    columns: ["marketName", "score"],
  });
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
