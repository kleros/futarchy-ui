import React, { useMemo } from "react";

import { formatUnits, Address } from "viem";
import { useAccount } from "wagmi";

import { useReadErc20BalanceOf } from "@/generated";

interface IPositionValue {
  upToken: Address;
  downToken: Address;
  marketPrice: number;
}

const PositionValue: React.FC<IPositionValue> = ({
  upToken,
  downToken,
  marketPrice,
}) => {
  const { address } = useAccount();
  const upValue = useTokenPositionValue(upToken, address ?? "0x", marketPrice);
  const downValue = useTokenPositionValue(
    downToken,
    address ?? "0x",
    1 - marketPrice,
  );
  const totalValue = useMemo(
    () => (upValue + downValue) / 5,
    [upValue, downValue],
  );
  if (totalValue > 0) {
    return (
      <div>
        <p>
          {`Current Position Value: `}
          <span className="font-bold"> {totalValue.toFixed(5)} </span>
          {`sDAI`}
        </p>
      </div>
    );
  } else {
    return null;
  }
};

const useTokenPositionValue = (
  token: Address,
  address: Address,
  price: number,
) => {
  const { data: balance } = useReadErc20BalanceOf({
    address: token,
    args: [address ?? "0x"],
    query: {
      staleTime: 5000,
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
