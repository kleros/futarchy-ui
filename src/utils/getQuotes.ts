import { SwaprV3Trade } from "@swapr/sdk";
import { Address, formatUnits, parseUnits } from "viem";

import { sDaiAddress, wxdaiAddress } from "@/generated";

import { ProcessedMarket } from "@/hooks/useProcessMarkets";

import { DECIMALS, DEFAULT_CHAIN, VOLUME_MIN } from "@/consts";

import { getMinimumAmountOut, getSwaprQuote } from "./swapr";

import { minBigIntArray } from ".";

export type GetQuoteProps = {
  // account that will trade, tradeExecutor in this case
  account: Address;
  // amount of underlyingBalance, if non-zero, the flow will mint and provide more liquidity to trade with
  //   amount: number; we use the underlyingBalance directly from processed market data
  processedMarkets: ProcessedMarket[];
};

export type GetQuotesResult = {
  quotes: {
    sellQuotes: SwaprV3Trade[];
    buyQuotes: SwaprV3Trade[];
  };
  mergeAmount: bigint;
};

export const getQuotes = async ({
  account,
  processedMarkets,
}: GetQuoteProps) => {
  const [buyMarkets, sellMarkets] = processedMarkets.reduce(
    (acc, curr) => {
      acc[curr.action === "buy" ? 0 : 1].push(curr);
      return acc;
    },
    [[], []] as [ProcessedMarket[], ProcessedMarket[]],
  );

  // getting sell quotes
  const sellPromises = sellMarkets.reduce(
    (promises, market) => {
      // if underlying balance is non-zero, then the previous step will have minted this much tokens already
      // so we have that available, hence added here
      const availableSellVolume = market.underlyingBalance + market.balance;

      // calculating the max amount of tokens we can sell
      const volume =
        parseUnits(market.volumeUntilPrice.outcomeVolume.toString(), DECIMALS) >
        availableSellVolume
          ? formatUnits(availableSellVolume, DECIMALS)
          : market.volumeUntilPrice.outcomeVolume.toString();
      if (Number(volume) < VOLUME_MIN) {
        return promises;
      }

      promises.push(
        getSwaprQuote({
          address: account,
          chain: DEFAULT_CHAIN.id,
          // we are want collateral as outcome here
          outcomeToken: market.underlyingToken,
          // we are giving in the UP or DOWN token
          collateralToken: market.token,
          amount: volume,
        }).catch((e) => {
          throw e;
        }),
      );

      return promises;
    },
    [] as Promise<SwaprV3Trade | null>[],
  );

  // means there were sell markets but no route was found
  if (!sellPromises.length && sellMarkets.length > 0) {
    throw new Error("Quote Info: No sell route found.\nTry higher amount.");
  }

  const sellTokenMapping: { [key: string]: bigint } = {};
  const sellQuoteResults = await Promise.allSettled(sellPromises);
  const sellQuotes = sellQuoteResults.reduce((quotes, result) => {
    if (result.status === "fulfilled" && result.value) {
      quotes.push(result.value);
      sellTokenMapping[
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        result.value.inputAmount.currency.address?.toLowerCase()!
      ] = parseUnits(result.value.inputAmount.toExact(), DECIMALS);
    }
    return quotes;
  }, [] as SwaprV3Trade[]);

  const collateralFromSell = sellQuotes.reduce(
    (acc, curr) => acc + parseUnits(curr!.outputAmount.toExact(), DECIMALS),
    0n,
  );

  //get new balances
  const newBalances = processedMarkets.map(
    (market) =>
      // keep in mind underlying balance here is to denote the amount we minted
      (market.balance ?? 0n) +
      market.underlyingBalance -
      (sellTokenMapping[market.token.toLowerCase()] ?? 0n),
  );

  //get collateral from merge
  const collateralFromMerge = minBigIntArray(newBalances);

  const totalCollateral = collateralFromSell + collateralFromMerge;

  if (!totalCollateral) {
    throw new Error(
      `Quote Error: Cannot sell to Underlying token.\nNot enough collateral.`,
    );
  }

  // get buy quotes
  const sumBuyDifference = buyMarkets.reduce(
    (acc, curr) => acc + curr.difference,
    0,
  );
  const buyPromises = buyMarkets.reduce(
    (promises, market) => {
      // here we allocate the collateral based on the weight of prediction,
      // so if a market has high difference they get more collateral to utilize
      const availableBuyVolume =
        (parseUnits(market.difference.toString(), DECIMALS) * totalCollateral) /
        parseUnits(sumBuyDifference.toString(), DECIMALS);

      const volume =
        // note that here we use collateral volume, instead of sellToken volume like above
        parseUnits(
          market.volumeUntilPrice.collateralVolume.toString(),
          DECIMALS,
        ) > availableBuyVolume
          ? formatUnits(availableBuyVolume, DECIMALS)
          : market.volumeUntilPrice.collateralVolume.toString();

      if (Number(volume) < VOLUME_MIN) {
        return promises;
      }

      // get quote
      promises.push(
        getSwaprQuote({
          address: account,
          chain: DEFAULT_CHAIN.id,
          // we are want UP/DOWN as outcome here
          outcomeToken: market.token,
          // we are giving in the underlying token
          collateralToken: market.underlyingToken,
          amount: volume,
        }).catch((e) => {
          throw e;
        }),
      );
      return promises;
    },
    [] as Promise<SwaprV3Trade | null>[],
  );

  if (!buyPromises.length && buyMarkets.length > 0) {
    throw new Error("Quote Error: No Buy Route found.\nTry higher amount.");
  }

  const buyQuoteResult = await Promise.allSettled(buyPromises);
  const buyQuotes = buyQuoteResult.reduce((quotes, result) => {
    if (result.status === "fulfilled" && result.value) {
      quotes.push(result.value);
    }
    return quotes;
  }, [] as SwaprV3Trade[]);

  if (!buyQuotes) {
    throw new Error(
      `Quote Error: Cannot buy from Underlying token.\nNo route found.`,
    );
  }
  return {
    quotes: { sellQuotes, buyQuotes },
    mergeAmount: collateralFromMerge,
  };
};

export const getSDaiToWXdaiData = async (account: Address, amount?: bigint) => {
  if (!amount) return;
  const quoteSDaiToWXDai = await getSwaprQuote({
    address: account,
    chain: DEFAULT_CHAIN.id,
    outcomeToken: wxdaiAddress,
    collateralToken: sDaiAddress,
    amount: formatUnits(amount, DECIMALS),
  }).catch((e) => {
    throw e;
  });

  if (!quoteSDaiToWXDai) {
    throw new Error("No route found for sDAI <> WXDAI");
  }

  const minWXDaiReceived = await getMinimumAmountOut(quoteSDaiToWXDai);
  const quoteWXDaiToSDai = await getSwaprQuote({
    address: account,
    chain: DEFAULT_CHAIN.id,
    outcomeToken: sDaiAddress,
    collateralToken: wxdaiAddress,
    amount: formatUnits(minWXDaiReceived, DECIMALS),
  }).catch((e) => {
    throw e;
  });
  if (!quoteWXDaiToSDai) {
    throw new Error("No route found for WXDAI <> sDAI");
  }
  const minSDaiReceived = await getMinimumAmountOut(quoteWXDaiToSDai);

  return {
    quote: quoteSDaiToWXDai,
    minSDaiReceived,
    slippage: amount - minSDaiReceived,
  };
};
