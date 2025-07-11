import { SwaprV3Trade, TradeType } from "@swapr/sdk";
import { useQuery } from "@tanstack/react-query";
import { gnosis } from "viem/chains";
import { useAccount } from "wagmi";

import { getTradeArgs } from "@/utils/trade";

export const useMarketQuote = (
  token: string,
  collateralToken: string,
  amount?: string,
  enabled: boolean = true,
) => {
  const { address } = useAccount();
  return useQuery({
    enabled,
    queryKey: [`market-${token.toLowerCase()}`, amount],
    staleTime: 10000,
    retry: (failureCount) => failureCount < 3,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));

      const args = getTradeArgs(
        gnosis.id,
        amount ?? "1",
        token,
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
    },
  });
};
