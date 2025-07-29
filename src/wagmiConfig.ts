import { gnosis, mainnet } from "@reown/appkit/networks";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { cookieStorage, createStorage, fallback, http } from "wagmi";

import { reownProjectId } from "@/consts";

if (!reownProjectId) {
  throw new Error("Project ID is not defined");
}

export const networks = [gnosis, mainnet];

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId: reownProjectId,
  networks,
  transports: {
    [gnosis.id]: fallback([
      http("https://rpc.gnosis.gateway.fm", { batch: true }),
    ]),
    [mainnet.id]: fallback([
      http("https://eth-mainnet.g.alchemy.com/v2/demo", { batch: true }),
    ]),
  },
});

export const config = wagmiAdapter.wagmiConfig;
