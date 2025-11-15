import React, { useMemo } from "react";

import clsx from "clsx";
import { formatUnits, Address, formatEther } from "viem";

import { useMarketContext } from "@/context/MarketContext";
import { useMarketPrice } from "@/hooks/useMarketPrice";
import { useTokenBalance } from "@/hooks/useTokenBalance";

import { formatValue, isUndefined } from "@/utils";

import { projectsChosen } from "@/consts/markets";

import RedeemButton from "./RedeemButton";

interface IPositionValue {
  upToken: Address;
  downToken: Address;
  underlyingToken: Address;
  tradeExecutor: Address;
}

const PositionValue: React.FC<IPositionValue> = ({
  upToken,
  downToken,
  underlyingToken,
  tradeExecutor,
}) => {
  const {
    isLoadingMarketPrice,
    isResolved,
    isParentResolved,
    selected,
    marketPrice,
  } = useMarketContext();

  const {
    value: upValue,
    balance: upBalance,
    price: upPrice,
  } = useTokenPositionValue(upToken, underlyingToken, tradeExecutor ?? "0x", {
    isUp: true,
  });
  const {
    value: downValue,
    balance: downBalance,
    price: downPrice,
  } = useTokenPositionValue(downToken, underlyingToken, tradeExecutor ?? "0x", {
    isUp: false,
  });
  const totalValue = upValue + downValue;

  const displayTotal = useMemo(() => {
    if (totalValue > 0) {
      if (totalValue < 0.01) {
        return "< 0.01";
      } else {
        return totalValue;
      }
    }
    return "0";
  }, [totalValue]);

  if (
    displayTotal === "0" ||
    (isParentResolved && !selected) ||
    (isLoadingMarketPrice && marketPrice === 0)
  ) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-klerosUIComponentsPrimaryText">
        {isResolved ? (
          <strong>Position to redeem:</strong>
        ) : (
          "Current position value:"
        )}
      </h3>
      <div
        className={clsx(
          "flex flex-col justify-start gap-4",
          "flex-wrap md:flex-row md:items-center md:justify-center",
        )}
      >
        {!isUndefined(upBalance) && upBalance > 0 ? (
          <>
            <p className="text-klerosUIComponentsPrimaryText justify-center text-sm">
              <span className="font-bold">
                {formatValue(upBalance ?? 0n, 18)} UP &nbsp;
              </span>
              ~{upValue.toFixed(2)} sDAI &nbsp;
              <span className="text-klerosUIComponentsSecondaryText text-xs">
                ({upPrice.toFixed(2)} sDAI per UP)
              </span>
            </p>
            <span className="text-klerosUIComponentsPrimaryText justify-center text-sm max-md:hidden">
              {" | "}
            </span>
          </>
        ) : null}

        {!isUndefined(downBalance) && downBalance > 0 ? (
          <>
            <p className="text-klerosUIComponentsPrimaryText justify-center text-sm">
              <span className="font-bold">
                {formatValue(downBalance ?? 0n, 18)} DOWN &nbsp;
              </span>
              ~{downValue.toFixed(2)} sDAI &nbsp;
              <span className="text-klerosUIComponentsSecondaryText text-xs">
                ({downPrice.toFixed(2)} sDAI per DOWN)
              </span>
            </p>
            <span className="text-klerosUIComponentsPrimaryText justify-center text-sm max-md:hidden">
              {" | "}
            </span>
          </>
        ) : null}

        <p className="text-klerosUIComponentsPrimaryText justify-center text-sm">
          Total:
          <span className="font-bold"> {totalValue.toFixed(2)} sDAI </span>
        </p>
      </div>
      {isResolved ? <RedeemButton tradeExecutor={tradeExecutor!} /> : null}
    </div>
  );
};

const useTokenPositionValue = (
  token: Address,
  underlyingToken: Address,
  address: Address,
  config?: { isUp?: boolean },
) => {
  const { hasLiquidity, marketPrice } = useMarketContext();

  const { data: balanceData } = useTokenBalance({
    token: token,
    address: address,
  });
  const balance = balanceData?.value;

  const { data } = useMarketPrice(
    token,
    underlyingToken,
    formatEther(balance ?? 0n),
  );

  const price = useMemo(() => {
    if (hasLiquidity) {
      return !isUndefined(data) ? parseFloat(data.price) / projectsChosen : 0;
    } else {
      return config?.isUp ? marketPrice : 1 - marketPrice;
    }
  }, [data, hasLiquidity, marketPrice, config]);

  const normalizedBalance = useMemo(
    () => parseFloat(formatUnits(balance ?? 0n, 18)),
    [balance],
  );

  const value = useMemo(
    () => normalizedBalance * (price ?? 0),
    [normalizedBalance, price],
  );

  return { balance, value, price };
};

export default PositionValue;
