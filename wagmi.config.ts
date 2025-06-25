import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import { erc20Abi } from "viem";

import { getContractInfo } from "@/consts";

const gnosisRouter = getContractInfo("gnosisRouter");
const sDAI = getContractInfo("sDAI");
const sDAIAdapter = getContractInfo("sDAIAdapter");

export default defineConfig({
  out: "src/generated.ts",
  contracts: [
    { ...gnosisRouter },
    { ...sDAI },
    { ...sDAIAdapter },
    { name: "ERC20", abi: erc20Abi },
  ],
  plugins: [react()],
});
