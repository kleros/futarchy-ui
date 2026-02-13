import { PredictionMarket } from "@/store/markets";

import marketFromName from "./marketIdFromName";

import { formatWithPrecision, isUndefined } from ".";

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

    const maxScore = formatWithPrecision(market.maxValue, market.precision);
    if (score > +maxScore) {
      throw new Error(
        `Row ${
          i + 1
        }: Score cannot be greater than the max value of ${maxScore}`,
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
  const header = ["marketName", "score"];

  const rows = Object.values(markets).map((market) => {
    return [
      `"${market.name}"`,
      formatWithPrecision(
        market.prediction ?? market.marketEstimate ?? 0,
        market.precision,
      ),
    ];
  });

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

function escapeCsvValue(value: unknown): string {
  if (value === null || value === undefined) return "";

  if (Array.isArray(value) || (typeof value === "object" && value !== null)) {
    const json = JSON.stringify(value);
    return `"${json.replace(/"/g, '""')}"`;
  }

  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function flattenObject(
  obj: Record<string, unknown>,
  prefix = "",
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const flatKey = prefix ? `${prefix}.${key}` : key;

    if (Array.isArray(value)) {
      result[flatKey] = value;
    } else if (
      value !== null &&
      typeof value === "object" &&
      !(value instanceof Date)
    ) {
      Object.assign(
        result,
        flattenObject(value as Record<string, unknown>, flatKey),
      );
    } else {
      result[flatKey] = value;
    }
  }

  return result;
}

export function generateRealtDataCsv(
  allData: Record<string, Record<string, unknown>>,
  contractAddresses: string[],
): string {
  const entries = contractAddresses
    .map((addr) => allData[addr.toLowerCase()])
    .filter(Boolean)
    .map((data) => flattenObject(data as Record<string, unknown>));

  if (entries.length === 0) return "";

  // Collect all unique keys across all entries to ensure no field is missed
  const allKeys = new Set<string>();
  for (const entry of entries) {
    for (const key of Object.keys(entry)) {
      allKeys.add(key);
    }
  }
  const columns = Array.from(allKeys);

  const header = columns.map(escapeCsvValue).join(",");
  const rows = entries.map((entry) =>
    columns.map((col) => escapeCsvValue(entry[col])).join(","),
  );

  return [header, ...rows].join("\n");
}
