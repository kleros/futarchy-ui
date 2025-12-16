import { Address, erc20Abi, type Abi } from "viem";
import { gnosis } from "viem/chains";

import { CondtionalRouterAbi } from "@/abi/ConditionalRouter";
import { CowSwapAbi } from "@/abi/CowSwap";
import { CreditsManagerAbi } from "@/abi/CreditsManager";
import { RouterAbi } from "@/abi/Router";
import { sDAIAbi } from "@/abi/sDAI";
import { sDAIAdapterAbi } from "@/abi/sDAIAdapter";
import { wrappedXDAIAbi } from "@/abi/wrappedXDAI";
import DAIIcon from "@/assets/svg/dai.svg";
import SeerCreditsIcon from "@/assets/svg/seer-credits.svg";

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
  seerCreditsManager: {
    address: "0xB29D0C9875D93483891c0645fdC13D665a4d2D70",
    abi: CreditsManagerAbi,
    name: "CreditsManager",
  },
  seerCredits: {
    address: "0xEDd48e43EBd4E2b31238a5CBA8FD548fC051aCAF",
    abi: erc20Abi,
    name: "SeerCredits",
  },
  wrappedXDai: {
    address: "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d",
    abi: wrappedXDAIAbi,
    name: "WXDAI",
  },
} satisfies Record<string, IContract>;

export enum TokenType {
  sDAI = "sDAI",
  xDAI = "xDAI",
  WXDAI = "WXDAI",
  SeerCredits = "SEER_CREDITS",
}

export const Tokens: Record<
  TokenType,
  { address: Address; Icon: React.FC<React.SVGProps<SVGElement>> }
> = {
  [TokenType.sDAI]: {
    address: contracts["sDAI"].address,
    Icon: DAIIcon,
  },
  [TokenType.xDAI]: {
    address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    Icon: DAIIcon,
  },
  [TokenType.WXDAI]: {
    address: contracts["wrappedXDai"].address,
    Icon: DAIIcon,
  },
  [TokenType.SeerCredits]: {
    address: contracts["seerCredits"].address,
    Icon: SeerCreditsIcon,
  },
};

export const getContractInfo = (
  contractName: keyof typeof contracts,
): IContract => contracts[contractName];

export const cowSwapAppCode = "futarchy-test";

export const DEFAULT_CHAIN = gnosis;

export const SWAPR_CONTRACT = "0xffb643e73f280b97809a8b41f7232ab401a04ee1";

// trade wallet specific
export const GNOSIS_CREATE_CALL = "0xBE202e30F21083619F9e8e62440CDe71903b94C4";
export const SALT_KEY = "TradeExecutorV1";
export const collateral = {
  // sDAI
  address: "0xaf204776c7245bF4147c2612BF6e5972Ee483701" as Address,
  decimals: 18,
};
export const DECIMALS = 18;
export const VOLUME_MIN = 0.01;
export const MIN_SEER_CREDITS_USAGE = 0.01;
