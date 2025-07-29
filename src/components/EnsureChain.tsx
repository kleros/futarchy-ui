import { useAccount } from "wagmi";

import { isUndefined } from "@/utils";

import ConnectWallet from "./ConnectWallet";

const EnsureChain: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { address } = useAccount();

  return isUndefined(address) ? (
    <div className="mt-28 w-full">
      <ConnectWallet text="Connect To Participate" className="mx-auto" />
    </div>
  ) : (
    children
  );
};
export default EnsureChain;
