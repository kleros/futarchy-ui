import { Address } from "viem";

import {
  foresightCreditsAddress,
  sDaiAddress,
  wxdaiAddress,
} from "@/generated";

import DAIIcon from "@/assets/svg/dai.svg";
import ForesightCreditsIcon from "@/assets/svg/foresight-logo.svg";

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
    address: sDaiAddress,
    Icon: DAIIcon,
  },
  [TokenType.xDAI]: {
    address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    Icon: DAIIcon,
  },
  [TokenType.WXDAI]: {
    address: wxdaiAddress,
    Icon: DAIIcon,
  },
  [TokenType.SeerCredits]: {
    address: foresightCreditsAddress,
    Icon: ForesightCreditsIcon,
  },
};
