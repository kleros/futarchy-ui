import React, { useMemo } from "react";

import { Tooltip } from "@kleros/ui-components-library";
import clsx from "clsx";
import Link from "next/link";
import { Address } from "viem";

import { useMarketContext } from "@/context/MarketContext";
import { useTokenPositionValue } from "@/hooks/useTokenPositionValue";

import InfoIcon from "@/assets/svg/info.svg";

import { formatValue, isUndefined } from "@/utils";

import { positionExplainerLink } from "@/consts/markets";

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
    <div className="flex flex-col gap-x-2 gap-y-3">
      <h3 className="text-klerosUIComponentsPrimaryText">
        {isResolved ? (
          <strong>Position to redeem:</strong>
        ) : (
          "Details of your position:"
        )}
      </h3>
      <div
        className={clsx(
          "flex flex-col justify-start gap-x-4 gap-y-1",
          "flex-wrap md:flex-row md:items-center md:justify-center",
        )}
      >
        {!isUndefined(upBalance) && upBalance > 0 ? (
          <>
            <p className="text-klerosUIComponentsPrimaryText justify-center text-sm">
              <span className="font-bold">
                {formatValue(upBalance ?? 0n, 18)} UP &nbsp;
              </span>
              ~{upValue.toFixed(2)}$ &nbsp;
              <span className="text-klerosUIComponentsSecondaryText text-xs">
                ({upPrice.toFixed(2)}$ per UP)
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
              ~{downValue.toFixed(2)}$ &nbsp;
              <span className="text-klerosUIComponentsSecondaryText text-xs">
                ({downPrice.toFixed(2)}$ per DOWN)
              </span>
            </p>
            <span className="text-klerosUIComponentsPrimaryText justify-center text-sm max-md:hidden">
              {" | "}
            </span>
          </>
        ) : null}

        <Tooltip
          text="Click here to understand your Position"
          small
          delay={0}
          closeDelay={300}
          className="px-2 py-2 [&_small]:text-xs"
        >
          <Link
            href={positionExplainerLink}
            target="_blank"
            rel="noopener noreferrer"
            className={clsx(
              "flex w-fit items-center gap-1",
              "text-klerosUIComponentsPrimaryText justify-center text-sm",
              "hover:text-klerosUIComponentsPrimaryBlue transition-colors",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            Total:
            <span className="font-bold"> {totalValue.toFixed(2)}$ </span>
            <InfoIcon className="mb-0.25 inline size-3" />
          </Link>
        </Tooltip>
      </div>
      {isResolved ? <RedeemButton tradeExecutor={tradeExecutor!} /> : null}
    </div>
  );
};

export default PositionValue;
