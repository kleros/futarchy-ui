import { createContext, useContext, useMemo } from "react";

import { Address, zeroAddress } from "viem";
import { useAccount } from "wagmi";

import { useCheckTradeExecutorCreated } from "@/hooks/tradeWallet/useCheckTradeExecutorCreated";

import { isUndefined } from "@/utils";

interface ITradeWalletContext {
  tradeExecutor: Address;
}
const TradeWalletContext = createContext<ITradeWalletContext | undefined>(
  undefined,
);

export const useTradeWallet = (): ITradeWalletContext => {
  const context = useContext(TradeWalletContext);
  if (!context) throw Error("TradeWallet not initialized");

  return context;
};

export const TradeWalletProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { address } = useAccount();
  const { data: checkTradeWalletResult } =
    useCheckTradeExecutorCreated(address);

  const tradeExecutor = checkTradeWalletResult?.predictedAddress ?? zeroAddress;
  //   const isCreated = checkTradeWalletResult?.isCreated;

  const value = useMemo(() => ({ tradeExecutor }), [tradeExecutor]);
  return (
    <TradeWalletContext.Provider {...{ value }}>
      {/* {isLoading ? (
        <p className="text-klerosUIComponentsSecondaryText md:text-lg">
          Fetching trade wallet...
        </p>
      ) : null} */}

      {/* {!isUndefined(isCreated) && !isCreated ? (
        <p className="text-klerosUIComponentsSecondaryText md:text-lg">
          Please create a trade wallet to start predicting.
        </p>
      ) : null} */}

      {!isUndefined(tradeExecutor) && tradeExecutor !== zeroAddress
        ? children
        : null}
    </TradeWalletContext.Provider>
  );
};
