import { useQuery } from "@tanstack/react-query";

import { isUndefined } from "@/utils";
import { GetQuoteProps, getQuotes } from "@/utils/getQuotes";

export const useGetQuotes = (quoteProps: GetQuoteProps, enabled: boolean) => {
  const { account, processedMarkets } = quoteProps;
  return useQuery({
    enabled: !isUndefined(account) && !isUndefined(processedMarkets) && enabled,
    queryKey: [
      "useGetQuotes",
      account,
      JSON.stringify(
        processedMarkets?.map((market) => ({
          ...market,
          balance: market.balance.toString(),
          underlyingBalance: market.underlyingBalance.toString(),
        })),
      ),
    ],
    queryFn: () => {
      console.log("fetchin");

      return getQuotes({ account, processedMarkets });
    },
  });
};
