import {
  TokenAmount,
  Token as SwaprToken,
  CurrencyAmount,
  Currency,
  Percent,
} from "@swapr/sdk";
import { parseUnits } from "viem";
import { gnosis } from "viem/chains";

export function getTradeArgs(
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

  const sellAmount = CurrencyAmount.nativeCurrency(
    parseUnits(amount, 18),
    gnosis.id,
  );

  const { currencyIn, currencyOut, currencyAmountIn } = getCurrenciesFromTokens(
    chainId,
    buyToken,
    sellToken,
    amount,
  );

  const maximumSlippage = new Percent("1", "100");

  return {
    buyToken,
    sellToken,
    sellAmount,
    currencyIn,
    currencyOut,
    currencyAmountIn,
    maximumSlippage,
  };
}

export function getCurrenciesFromTokens(
  chainId: number,
  buyToken: string,
  sellToken: string,
  amount: string,
): {
  currencyIn: Currency;
  currencyOut: Currency;
  currencyAmountIn: CurrencyAmount;
} {
  const tokenIn = new SwaprToken(chainId, sellToken, 18);

  const currencyAmountIn = new TokenAmount(
    tokenIn,
    parseUnits(String(amount), tokenIn.decimals),
  );

  const currencyIn: Currency = tokenIn;

  const currencyOut = new SwaprToken(chainId, buyToken, 18);

  return {
    currencyIn,
    currencyOut,
    currencyAmountIn,
  };
}
