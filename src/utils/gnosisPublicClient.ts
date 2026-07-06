import { createPublicClient, fallback, http } from "viem";
import { gnosis } from "viem/chains";

import { GNOSIS_RPC } from "@/consts";

export const gnosisPublicClient = createPublicClient({
  chain: gnosis,
  transport: fallback([
    http(GNOSIS_RPC, { batch: true }),
    http("https://rpc.gnosis.gateway.fm", { batch: true }),
  ]),
});
