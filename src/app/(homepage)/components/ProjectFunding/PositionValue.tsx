import React, { useMemo } from "react";

import { formatUnits, Address } from "viem";
import { useAccount } from "wagmi";

import { useReadErc20BalanceOf } from "@/generated";

import { useMarketQuote } from "@/hooks/useMarketQuote";

interface IPositionValue {
  upToken: Address;
  downToken: Address;
}

const PositionValue: React.FC<IPositionValue> = ({ upToken, downToken }) => {
  const { address } = useAccount();
  const upValue = useTokenPositionValue(upToken, address ?? "0x");
  const downValue = useTokenPositionValue(downToken, address ?? "0x");
  const totalValue = useMemo(() => upValue + downValue, [upValue, downValue]);
  if (totalValue > 0) {
    return (
      <div>
        <p>
          {`Current Position Value: `}
          <span className="font-bold"> {totalValue.toFixed(5)} </span>
          {`sDAI |`}
        </p>
      </div>
    );
  } else {
    return null;
  }
};

const useTokenPositionValue = (token: Address, address: Address) => {
  const { data: price } = useMarketQuote(token);
  const { data: balance } = useReadErc20BalanceOf({
    address: token,
    args: [address ?? "0x"],
    query: {
      enabled: typeof address !== "undefined",
    },
  });
  const normalizedBalance = useMemo(
    () => parseFloat(formatUnits(balance ?? 0n, 18)),
    [balance],
  );

  return useMemo(
    () => normalizedBalance * (price ?? 0),
    [normalizedBalance, price],
  );
};

export default PositionValue;
