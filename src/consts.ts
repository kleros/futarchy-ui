import { type Abi } from "viem";
import { gnosis } from "viem/chains";

import { CowSwapAbi } from "@/abi/CowSwap";
import { RouterAbi } from "@/abi/Router";
import { sDAIAbi } from "@/abi/sDAI";
import { sDAIAdapterAbi } from "@/abi/sDAIAdapter";

export const reownProjectId = process.env.NEXT_PUBLIC_REOWN_PROJECTID;

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
} satisfies Record<string, IContract>;

export const getContractInfo = (
  contractName: keyof typeof contracts,
): IContract => contracts[contractName];

interface IProject {
  name: string;
  details: string;
  color: string;
  upToken: string;
  downToken: string;
  minValue: number;
  maxValue: number;
  marketId: string;
}

export const projects: Array<IProject> = [
  {
    name: "Project 1",
    details: "aaaaaa",
    color: "red",
    upToken: "0x330797721e4F9773c02Ab6165292777E879E43f8",
    downToken: "0x8932198b384F8cb090bBE825cF0a1061f436F053",
    minValue: 0,
    maxValue: 40,
    marketId: "0xa77dd0d6988f0f79b056d3196fa67f2488370909",
  },
  {
    name: "Project 2",
    details: "aaaaaa",
    color: "blue",
    upToken: "0x330797721e4F9773c02Ab6165292777E879E43f8",
    downToken: "0x8932198b384F8cb090bBE825cF0a1061f436F053",
    minValue: 0,
    maxValue: 40,
    marketId: "0xa77dd0d6988f0f79b056d3196fa67f2488370909",
  },
  {
    name: "Project 3",
    details: "aaaaaa",
    color: "green",
    upToken: "0x330797721e4F9773c02Ab6165292777E879E43f8",
    downToken: "0x8932198b384F8cb090bBE825cF0a1061f436F053",
    minValue: 0,
    maxValue: 40,
    marketId: "0xa77dd0d6988f0f79b056d3196fa67f2488370909",
  },
  {
    name: "Project 4",
    details: "aaaaaa",
    color: "orange",
    upToken: "0x330797721e4F9773c02Ab6165292777E879E43f8",
    downToken: "0x8932198b384F8cb090bBE825cF0a1061f436F053",
    minValue: 0,
    maxValue: 40,
    marketId: "0xa77dd0d6988f0f79b056d3196fa67f2488370909",
  },
];

export const cowSwapAppCode = "futarchy-test";

export const DEFAULT_CHAIN = gnosis;
