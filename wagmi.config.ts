import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import { erc20Abi } from "viem";

import { getContractInfo } from "@/consts";

const gnosisRouter = getContractInfo("gnosisRouter");
const sDAI = getContractInfo("sDAI");
const sDAIAdapter = getContractInfo("sDAIAdapter");
const conditionalRouter = getContractInfo("conditionalRouter");
const creditsManager = getContractInfo("seerCreditsManager");
const seerCredits = getContractInfo("seerCredits");
const WXDAI = getContractInfo("wrappedXDai");

export default defineConfig({
  out: "src/generated.ts",
  contracts: [
    { ...gnosisRouter },
    { ...sDAI },
    { ...sDAIAdapter },
    { ...conditionalRouter },
    { ...creditsManager },
    { ...seerCredits },
    { ...WXDAI },
    { name: "ERC20", abi: erc20Abi },
  ],
  plugins: [react()],
});
