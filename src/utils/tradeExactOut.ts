import {
  TokenAmount,
  Token as SwaprToken,
  CurrencyAmount,
  Currency,
  Percent,
} from "@swapr/sdk";
import { parseUnits } from "viem";

export function getTradeExactOutArgs(
  chainId: number,
  amount: string,
  outcomeToken: string,
  collateralToken: string,
  swapType: "buy" | "sell",
) {
  const [buyToken, sellToken] =
    swapType === "buy"
      ? [outcomeToken, collateralToken]
      : ([collateralToken, outcomeToken] as const);

  const { currencyIn, currencyOut, currencyAmountOut } =
    getCurrenciesFromTokens(chainId, buyToken, sellToken, amount);

  const maximumSlippage = new Percent("1", "100");

  return {
    buyToken,
    sellToken,
    currencyIn,
    currencyOut,
    currencyAmountOut,
    maximumSlippage,
  };
}

function getCurrenciesFromTokens(
  chainId: number,
  buyToken: string,
  sellToken: string,
  amount: string,
): {
  currencyIn: Currency;
  currencyOut: Currency;
  currencyAmountOut: CurrencyAmount;
} {
  const currencyIn: Currency = new SwaprToken(chainId, sellToken, 18);

  const currencyOut = new SwaprToken(chainId, buyToken, 18);

  const currencyAmountOut = new TokenAmount(
    currencyOut,
    parseUnits(String(amount), currencyOut.decimals),
  );

  return {
    currencyIn,
    currencyOut,
    currencyAmountOut,
  };
}
