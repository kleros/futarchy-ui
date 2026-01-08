import DAIIcon from "@/assets/svg/dai.svg";
import SeerCreditsIcon from "@/assets/svg/seer-credits.svg";
import { sDaiAddress, seerCreditsAddress, wxdaiAddress } from "@/generated";
import { Address } from "viem";

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
    address: seerCreditsAddress,
    Icon: SeerCreditsIcon,
  },
};
