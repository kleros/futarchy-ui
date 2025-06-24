import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";

import { ERC20Abi } from "@/abi/ERC20";
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
    { name: "ERC20", abi: ERC20Abi },
  ],
  plugins: [react()],
});
