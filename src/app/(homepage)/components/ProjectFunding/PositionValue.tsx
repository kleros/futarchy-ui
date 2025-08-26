import React, { useMemo } from "react";

import clsx from "clsx";
import { formatUnits, Address, formatEther } from "viem";
import { useAccount } from "wagmi";

import { useReadErc20BalanceOf } from "@/generated";

import { useMarketPrice } from "@/hooks/useMarketPrice";

import { formatValue, isUndefined } from "@/utils";

import { projectsChosen } from "@/consts/markets";

interface IPositionValue {
  upToken: Address;
  downToken: Address;
  underlyingToken: Address;
}

const PositionValue: React.FC<IPositionValue> = ({
  upToken,
  downToken,
  underlyingToken,
}) => {
  const { address } = useAccount();
  const {
    value: upValue,
    balance: upBalance,
    price: upPrice,
  } = useTokenPositionValue(upToken, underlyingToken, address ?? "0x");
  const {
    value: downValue,
    balance: downBalance,
    price: downPrice,
  } = useTokenPositionValue(downToken, underlyingToken, address ?? "0x");
  const totalValue = upValue + downValue;

  if (totalValue > 0) {
    return (
      <div className="flex flex-col gap-2">
        <h3 className="text-klerosUIComponentsPrimaryText">
          Current position value:
        </h3>
        <div
          className={clsx(
            "flex flex-col justify-start gap-4",
            "flex-wrap md:flex-row md:justify-center",
          )}
        >
          {!isUndefined(upBalance) && upBalance > 0 ? (
            <>
              <p className="text-klerosUIComponentsPrimaryText justify-center text-sm">
                <span className="font-bold">
                  {formatValue(upBalance ?? 0n, 18)} UP &nbsp;
                </span>
                ~{upValue.toFixed(5)} sDAI &nbsp;
                <span className="text-klerosUIComponentsSecondaryText text-xs">
                  ({upPrice.toFixed(5)} sDAI per UP)
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
                ~{downValue.toFixed(5)} sDAI &nbsp;
                <span className="text-klerosUIComponentsSecondaryText text-xs">
                  ({downPrice.toFixed(5)} sDAI per DOWN)
                </span>
              </p>
              <span className="text-klerosUIComponentsPrimaryText justify-center text-sm max-md:hidden">
                {" | "}
              </span>
            </>
          ) : null}

          <p className="text-klerosUIComponentsPrimaryText justify-center text-sm">
            Total:
            <span className="font-bold"> {totalValue.toFixed(5)} sDAI </span>
          </p>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

const useTokenPositionValue = (
  token: Address,
  underlyingToken: Address,
  address: Address,
) => {
  const { data: balance } = useReadErc20BalanceOf({
    address: token,
    args: [address ?? "0x"],
    query: {
      staleTime: 5000,
      enabled: typeof address !== "undefined",
    },
  });

  const { data } = useMarketPrice(
    token,
    underlyingToken,
    formatEther(balance ?? 0n),
  );

  const price = !isUndefined(data)
    ? parseFloat(data.price) / projectsChosen
    : 0;

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
