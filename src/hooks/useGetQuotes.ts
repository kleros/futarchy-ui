import { useQuery } from "@tanstack/react-query";

import { isUndefined } from "@/utils";
import { GetQuoteProps, getQuotes } from "@/utils/getQuotes";

export const useGetQuotes = ({ account, processedMarkets }: GetQuoteProps) => {
  return useQuery({
    enabled: !isUndefined(account) && !isUndefined(processedMarkets),
    queryKey: [
      "useGetQuotes",
      account,
      processedMarkets?.map((market) => ({
        ...market,
        balance: market.balance.toString(),
        underlyingBalance: market.underlyingBalance.toString(),
      })),
    ],
    queryFn: () => {
      return getQuotes({ account, processedMarkets });
    },
  });
};
