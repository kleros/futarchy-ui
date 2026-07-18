import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import { erc20Abi } from "viem";

import { getContractInfo } from "@/consts";

const gnosisRouter = getContractInfo("gnosisRouter");
const sDAI = getContractInfo("sDAI");
const sDAIAdapter = getContractInfo("sDAIAdapter");
const conditionalRouter = getContractInfo("conditionalRouter");
const conditionalTokens = getContractInfo("conditionalTokens");
const creditsManager = getContractInfo("foresightCreditsManager");
const foresightCredits = getContractInfo("foresightCredits");
const WXDAI = getContractInfo("wrappedXDai");
const futarchyFactory = getContractInfo("futarchyFactory");

export default defineConfig({
  out: "src/generated.ts",
  contracts: [
    { ...gnosisRouter },
    { ...sDAI },
    { ...sDAIAdapter },
    { ...conditionalRouter },
    { ...conditionalTokens },
    { ...creditsManager },
    { ...foresightCredits },
    { ...WXDAI },
    { ...futarchyFactory },
    { name: "ERC20", abi: erc20Abi },
  ],
  plugins: [react()],
});
