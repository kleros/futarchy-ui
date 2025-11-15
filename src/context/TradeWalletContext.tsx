import { createContext, useContext, useMemo } from "react";

import { Address } from "viem";
import { useAccount } from "wagmi";

import { useCheckTradeExecutorCreated } from "@/hooks/tradeWallet/useCheckTradeExecutorCreated";

interface ITradeWalletContext {
  tradeExecutor?: Address;
  isLoadingTradeWallet: boolean;
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
  const { data: checkTradeWalletResult, isLoading: isLoadingTradeWallet } =
    useCheckTradeExecutorCreated(address);

  const tradeExecutor = checkTradeWalletResult?.predictedAddress;
  //   const isCreated = checkTradeWalletResult?.isCreated;

  const value = useMemo(
    () => ({ tradeExecutor, isLoadingTradeWallet }),
    [tradeExecutor, isLoadingTradeWallet],
  );
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

      {children}
    </TradeWalletContext.Provider>
  );
};
