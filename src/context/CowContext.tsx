"use client";

import React, {
  type ReactNode,
  createContext,
  useContext,
  useMemo,
} from "react";

import { TradingSdk, OrderBookApi, SubgraphApi } from "@cowprotocol/cow-sdk";
import { gnosis } from "@reown/appkit/networks";

import { useEthersSigner } from "@/hooks/useEthersSigner";

import FullScreenLoader from "@/components/FullScreenLoader";

import { cowSwapAppCode } from "@/consts";

interface ICowContext {
  sdk: TradingSdk;
  orderBook: OrderBookApi;
  cowSubgraph: SubgraphApi;
}

const CowContext = createContext<ICowContext | undefined>(undefined);

const CowContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const signer = useEthersSigner({ chainId: 100 });

  const sdk = useMemo(() => {
    if (typeof signer === "undefined") return null;
    return new TradingSdk(
      {
        chainId: gnosis.id,
        signer,
        appCode: cowSwapAppCode,
      },
      { enableLogging: true },
    );
  }, [signer]);

  const orderBook = useMemo(() => {
    return new OrderBookApi({ chainId: gnosis.id });
  }, []);

  const cowSubgraph = useMemo(() => {
    return new SubgraphApi({ chainId: gnosis.id });
  }, []);

  if (sdk === null) return <FullScreenLoader />;

  return (
    <CowContext.Provider value={{ sdk, orderBook, cowSubgraph }}>
      {children}
    </CowContext.Provider>
  );
};

export const useCowSdk = (): ICowContext => {
  const context = useContext(CowContext);
  if (!context) throw Error("CowSdk not initialized");

  return context;
};

export default CowContextProvider;
