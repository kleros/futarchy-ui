import { useAccount } from "wagmi";

import { isUndefined } from "@/utils";

import ConnectWallet from "./ConnectWallet";

const EnsureChain: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { address } = useAccount();

  return isUndefined(address) ? (
    <ConnectWallet text="Connect To Predict" />
  ) : (
    children
  );
};
export default EnsureChain;
