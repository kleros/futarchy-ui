import { SwaprV3Trade, TradeType } from "@swapr/sdk";
import { type Address } from "viem";
import { gnosis } from "viem/chains";

import { getTradeArgs } from "./trade";

type GetQuoteArgs = {
  address?: Address;
  chain?: number;
  amount?: string;
  outcomeToken: string;
  collateralToken: string;
};

export const getSwaprQuote = async ({
  address,
  chain = gnosis.id,
  outcomeToken,
  collateralToken,
  amount = "1",
}: GetQuoteArgs) => {
  const args = getTradeArgs(
    chain,
    amount,
    outcomeToken,
    collateralToken,
    "buy",
  );

  return await SwaprV3Trade.getQuote(
    {
      amount: args.currencyAmountIn,
      quoteCurrency: args.currencyOut,
      recipient: address,
      tradeType: TradeType.EXACT_INPUT,
      maximumSlippage: args.maximumSlippage,
    },
    undefined,
    false,
  );
};
