import ConnectWalletSlot from "@/components/ConnectWallet/ConnectWalletSlot";
import QuickGuideButton from "@/components/QuickGuideButton";

import GnosisIcon from "@/assets/svg/gnosis.svg";

import Logo from "./Logo";
import Menu from "./Menu";

interface IDesktopNavbar {
  toggleIsHelpOpen: () => void;
  toggleIsSettingsOpen: () => void;
}

const DesktopNavbar: React.FC<IDesktopNavbar> = ({
  toggleIsHelpOpen,
  toggleIsSettingsOpen,
}) => {
  return (
    <div className="relative hidden h-16 w-full items-center justify-between md:flex">
      <Logo />

      <div className="ml-2 flex items-center gap-1 md:gap-2">
        <QuickGuideButton />
        <GnosisIcon className="mx-2.5 size-6" />
        <ConnectWalletSlot />
        <div className="flex items-center">
          <Menu {...{ toggleIsHelpOpen, toggleIsSettingsOpen }} />
        </div>
      </div>
    </div>
  );
};

export default DesktopNavbar;
