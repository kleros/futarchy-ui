import { OrderKind } from "@cowprotocol/cow-sdk";
import { useQuery } from "@tanstack/react-query";

import { sDaiAddress } from "@/generated";

import { useCowSdk } from "@/context/CowContext";

export const useMarketQuote = (token: string) => {
  const { sdk } = useCowSdk();
  return useQuery({
    queryKey: [`market-${token}`],
    staleTime: 10000,
    retry: (failureCount) => failureCount < 3,
    retryDelay: 3000,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));
      const { quoteResults } = await sdk.getQuote({
        kind: OrderKind.SELL,
        sellToken: token,
        buyToken: sDaiAddress,
        buyTokenDecimals: 18,
        sellTokenDecimals: 18,
        amount: "1000000000000000000",
      });
      const marketPriceInt =
        BigInt(quoteResults.quoteResponse.quote.buyAmount) / 100000000000000n;
      return parseInt(marketPriceInt.toString()) / 10000;
    },
  });
};
