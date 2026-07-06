"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import WagmiShell from "./WagmiShell";

type Web3WalletProvidersComponent = React.ComponentType<{
  children: ReactNode;
}>;

interface Web3ReadyContextValue {
  isWeb3Ready: boolean;
  ensureWeb3Loaded: () => void;
}

const Web3ReadyContext = createContext<Web3ReadyContextValue>({
  isWeb3Ready: false,
  ensureWeb3Loaded: () => {},
});

export const useWeb3Ready = () => useContext(Web3ReadyContext);

interface Web3RootProps {
  children: ReactNode;
  cookies: string | null;
}

export const Web3Root: React.FC<Web3RootProps> = ({ children, cookies }) => {
  const [WalletProviders, setWalletProviders] =
    useState<Web3WalletProvidersComponent | null>(null);
  const [loadRequested, setLoadRequested] = useState(false);

  const ensureWeb3Loaded = useCallback(() => {
    setLoadRequested(true);
  }, []);

  useEffect(() => {
    if (!loadRequested) return;

    let cancelled = false;
    import("./Web3WalletProviders").then((mod) => {
      if (!cancelled) {
        setWalletProviders(() => mod.default);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [loadRequested]);

  useEffect(() => {
    const scheduleLoad = () => setLoadRequested(true);

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(scheduleLoad, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }

    const timeoutId = window.setTimeout(scheduleLoad, 1);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const contextValue = useMemo(
    () => ({
      isWeb3Ready: WalletProviders !== null,
      ensureWeb3Loaded,
    }),
    [WalletProviders, ensureWeb3Loaded],
  );

  const walletWrappedChildren = WalletProviders ? (
    <WalletProviders>{children}</WalletProviders>
  ) : (
    children
  );

  return (
    <WagmiShell cookies={cookies}>
      <Web3ReadyContext.Provider value={contextValue}>
        {walletWrappedChildren}
      </Web3ReadyContext.Provider>
    </WagmiShell>
  );
};
