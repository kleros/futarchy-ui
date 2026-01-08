import { Address, parseUnits } from "viem";

import { isUndefined } from "@/utils";

import { useVolumeUntilPrice } from "./liquidity/useVolumeUntilPrice";

import { useBalance } from "./useBalance";
import { useMarketLimitQuote } from "./useMarketLimitQuote";

/**
 * @dev This hook returns the capped amount of underlying tokens that can be traded without
 *      overshooting the predicted price. [Min(tokensAmountThatOvershoot, userUnderlyingBalance)]
 * @param underlyingToken
 * @param targetToken
 * @param predictedPrice
 * @param shouldFetch
 * @returns capped underlying tokens amount
 */
const useCappedBalance = (
  underlyingToken: Address,
  targetToken: Address,
  predictedPrice: number,
  shouldFetch: boolean,
) => {
  const { data: underlyingBalance } = useBalance(underlyingToken);

  const data = useVolumeUntilPrice(
    underlyingToken,
    targetToken,
    "buy",
    predictedPrice,
  );

  const { data: fillToPriceQuote, isLoading } = useMarketLimitQuote(
    targetToken,
    underlyingToken,
    data?.toString() ?? "1",
    !isUndefined(data) && shouldFetch,
  );

  const amountRequiredToOvershoot = !isUndefined(fillToPriceQuote)
    ? parseUnits(
        fillToPriceQuote.inputAmount.toExact() ?? "0",
        fillToPriceQuote.details?.input.decimals ?? 18,
      )
    : undefined;

  const cappedUnderlyingAmount =
    (underlyingBalance ?? 0) > (amountRequiredToOvershoot ?? 0)
      ? amountRequiredToOvershoot
      : underlyingBalance;

  return { cappedUnderlyingAmount, isLoading };
};

export default useCappedBalance;
