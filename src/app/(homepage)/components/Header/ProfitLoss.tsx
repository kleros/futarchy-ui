import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import { ProfitLossResponse } from "@/app/api/profit-loss/route";

import { useTradeWallet } from "@/context/TradeWalletContext";
import { useMarketResolutionInfo } from "@/hooks/useMarketResolutionInfo";
import { useSDaiPrice } from "@/hooks/useSDaiPrice";

import WithHelpTooltip from "@/components/WithHelpTooltip";

import ProfitIcon from "@/assets/svg/profit.svg";

import { formatBigNumbers } from "@/utils";

const ProfitLoss: React.FC = () => {
  const { tradeExecutor } = useTradeWallet();
  const { price: sDaiPrice } = useSDaiPrice();
  const { isMarketResolved, childResolvedByMarketId, isCheckingStatus } =
    useMarketResolutionInfo(tradeExecutor);

  const { data: marketProfitLoss, isLoading: isLoadingProfitLoss } =
    useQuery<ProfitLossResponse>({
      queryKey: ["profit-loss", tradeExecutor],
      enabled: Boolean(tradeExecutor) && isMarketResolved,
      queryFn: async () => {
        const res = await fetch(
          `/api/profit-loss?tradeExecutor=${tradeExecutor}`,
        );

        if (!res.ok) {
          throw new Error("Unable to fetch profit loss data.");
        }
        return res.json();
      },
      staleTime: 300_000,
    });

  const pnl = useMemo(() => {
    if (!marketProfitLoss) return 0;

    return marketProfitLoss.markets.reduce(
      (sum, market) =>
        childResolvedByMarketId.get(market.marketId) ? sum + market.pnl : sum,
      0,
    );
  }, [marketProfitLoss, childResolvedByMarketId]);

  if (
    !tradeExecutor ||
    isCheckingStatus ||
    isLoadingProfitLoss ||
    !marketProfitLoss ||
    !isMarketResolved
  ) {
    return null;
  }

  const pnlUsd = pnl * sDaiPrice;

  return (
    <div className="flex items-center gap-2">
      <ProfitIcon className="size-3.5" />
      <span className="text-klerosUIComponentsSecondaryText text-sm">P&L:</span>
      <WithHelpTooltip tooltipMsg="Total across evaluated markets">
        <span className="text-klerosUIComponentsPrimaryText text-sm font-semibold">
          {`${formatBigNumbers(pnl)} sDAI ($${formatBigNumbers(pnlUsd)})`}
        </span>
      </WithHelpTooltip>
    </div>
  );
};

export default ProfitLoss;
