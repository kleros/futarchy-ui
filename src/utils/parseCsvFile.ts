import { isAddress } from "viem";

export const parseMarketCSV = (csvText: string): Record<string, number> => {
  const lines = csvText.trim().split("\n");

  if (lines.length < 2) {
    throw new Error("CSV must have at least a header row and one data row");
  }

  const headers = lines[0].split(",").map((h) => h.trim());

  // Check for required columns
  if (headers.length !== 2) {
    throw new Error("CSV must have exactly 2 columns: marketId, score");
  }

  if (!headers.includes("marketId") || !headers.includes("score")) {
    throw new Error("CSV must have columns: marketId, score");
  }

  const result: Record<string, number> = {};

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines

    const values = line.split(",");

    if (values.length !== 2) {
      throw new Error(
        `Row ${i + 1}: Expected 2 columns, found ${values.length}`,
      );
    }

    const marketId = values[0];
    const scoreStr = values[1];

    // Check for empty values
    if (!marketId || !scoreStr) {
      throw new Error(`Row ${i + 1}: All columns must have values`);
    }

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

    if (!isAddress(marketId)) {
      throw new Error(`Row ${i + 1}: marketId needs to be the market address`);
    }
    result[marketId.trim()] = score;
  }

  if (Object.values(result).length === 0) {
    throw new Error("CSV contains no valid data rows");
  }

  return result;
};
