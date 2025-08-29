import { type Abi } from "viem";
import { gnosis } from "viem/chains";

import { CondtionalRouterAbi } from "@/abi/ConditionalRouter";
import { CowSwapAbi } from "@/abi/CowSwap";
import { RouterAbi } from "@/abi/Router";
import { sDAIAbi } from "@/abi/sDAI";
import { sDAIAdapterAbi } from "@/abi/sDAIAdapter";

export const reownProjectId = process.env.NEXT_PUBLIC_REOWN_PROJECTID;

export const GNOSIS_RPC = process.env.NEXT_PUBLIC_GNOSIS_RPC;

interface IContract {
  address: `0x${string}`;
  abi: Abi;
  name: string;
}

const contracts = {
  gnosisRouter: {
    address: "0xeC9048b59b3467415b1a38F63416407eA0c70fB8",
    abi: RouterAbi,
    name: "GnosisRouter",
  },
  sDAIAdapter: {
    address: "0xD499b51fcFc66bd31248ef4b28d656d67E591A94",
    abi: sDAIAdapterAbi,
    name: "sDAIAdapter",
  },
  sDAI: {
    address: "0xaf204776c7245bF4147c2612BF6e5972Ee483701",
    abi: sDAIAbi,
    name: "sDAI",
  },
  cowSwap: {
    address: "0xC92E8bdf79f0507f65a392b0ab4667716BFE0110",
    abi: CowSwapAbi,
    name: "cowSwap",
  },
  conditionalRouter: {
    address: "0x774284d5cdfec3a0a0ebc7283ad4d5b33013c29c",
    abi: CondtionalRouterAbi,
    name: "conditionalRouter",
  },
} satisfies Record<string, IContract>;

export const getContractInfo = (
  contractName: keyof typeof contracts,
): IContract => contracts[contractName];

export const cowSwapAppCode = "futarchy-test";

export const DEFAULT_CHAIN = gnosis;

export const SWAPR_CONTRACT = "0xffb643e73f280b97809a8b41f7232ab401a04ee1";
