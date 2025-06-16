import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import { getContractInfo } from "./src/consts";

const gnosisRouter = getContractInfo("gnosisRouter");
const sDAI = getContractInfo("sDAI");
const sDAIAdapter = getContractInfo("sDAIAdapter");

export default defineConfig({
  out: "src/generated.ts",
  contracts: [{ ...gnosisRouter }, { ...sDAI }, { ...sDAIAdapter }],
  plugins: [react()],
});
