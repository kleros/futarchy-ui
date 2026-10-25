import { formatUnits } from "viem";

import { type IMarket } from "@/consts/markets";

interface IDataPoint {
  pool: {
    id: string;
    token0: {
      id: string;
      name: string;
    };
    token1: {
      id: string;
      name: string;
    };
    liquidity: `${number}`;
  };
  liquidity: `${number}`;
  sqrtPrice: `${number}`;
  token0Price: `${number}`;
  token1Price: `${number}`;
  periodStartUnix: number;
}

type RawMarketChartResponse = Array<Array<IDataPoint>>;

export type IChartData = Record<
  string,
  { market: IMarket; data: Array<{ timestamp: number; value: number }> }
>;

const getSqrtPrices = (
  sqrtPrice: string,
): { token0Price: `${number}`; token1Price: `${number}` } => {
  const sqrtPriceBigInt = BigInt(sqrtPrice);
  const token0Price = formatUnits(
    (2n ** 192n * 10n ** 18n) / (sqrtPriceBigInt * sqrtPriceBigInt),
    18,
  ) as `${number}`;
  const token1Price = formatUnits(
    (sqrtPriceBigInt * sqrtPriceBigInt * 10n ** 18n) / 2n ** 192n,
    18,
  ) as `${number}`;
  return { token0Price, token1Price };
};

export function processMarketChartData(
  rawData: RawMarketChartResponse,
  market: IMarket,
): IChartData {
  const processed = rawData[1].map((dataPoint) => {
    let token0Price = dataPoint.token0Price;
    let token1Price = dataPoint.token1Price;
    const sqrtPrice = dataPoint.sqrtPrice;
    if (
      token0Price === "0" &&
      token1Price === "0" &&
      sqrtPrice &&
      sqrtPrice !== "0"
    ) {
      ({ token0Price, token1Price } = getSqrtPrices(sqrtPrice));
    }
    return {
      timestamp: dataPoint.periodStartUnix,
      value:
        parseFloat(
          (dataPoint.pool.token0.id.toLowerCase() ===
          market.underlyingToken.toLowerCase()
            ? token0Price
            : token1Price
          ).slice(0, 9),
        ) * market.maxValue,
    };
  });

  return { [market.name]: { market, data: processed } };
}

export function processAllMarketChartData(
  rawResponses: RawMarketChartResponse[],
  markets: IMarket[],
): IChartData[] {
  return rawResponses.map((rawData, i) =>
    processMarketChartData(rawData, markets[i]),
  );
}
