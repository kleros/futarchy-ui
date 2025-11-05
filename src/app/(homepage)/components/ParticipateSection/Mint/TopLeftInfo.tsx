import WithHelpTooltip from "@/components/WithHelpTooltip";

import WalletIcon from "@/assets/svg/wallet.svg";

import { formatValue } from "@/utils";

const TopLeftInfo: React.FC<{ balance: bigint }> = ({ balance }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <WithHelpTooltip
        tooltipMsg={
          "First, you need to convert sDAI into project tokens. Then, you can predict how many projects you prefer. It's not mandatory to predict all projects. \nAfter predicting, you will need to wait until the prediction market is concluded (appr. 1 month), to redeem the tokens using this interface, or if you prefer you can do it using the Seer at any time."
        }
      >
        <p className="text-klerosUIComponentsSecondaryText shrink-0 text-sm">
          <strong className="text-klerosUIComponentsPrimaryText">1st</strong>{" "}
          Convert sDAI into Project Tokens
        </p>
      </WithHelpTooltip>
      <div className="flex items-center gap-1">
        <WalletIcon />{" "}
        <span className="text-klerosUIComponentsSecondaryText text-xs">
          Total:
        </span>
        <span className="text-klerosUIComponentsSecondaryText text-xs">
          {formatValue(balance ?? 0n)} sDAI
        </span>
      </div>
    </div>
  );
};

export default TopLeftInfo;
