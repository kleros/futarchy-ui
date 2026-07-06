import { Modal } from "@kleros/ui-components-library";
import clsx from "clsx";
import { useToggle } from "react-use";

import ConnectWalletSlot from "@/components/ConnectWallet/ConnectWalletSlot";
import LightButton from "@/components/LightButton";
import QuickGuideButton from "@/components/QuickGuideButton";
import ThemeToggle from "@/components/ThemeToggle";
import Web3Gated from "@/components/Web3Gated";

import HelpIcon from "@/assets/menu-icons/help.svg";
import SettingsIcon from "@/assets/menu-icons/settings.svg";
import HamburgerIcon from "@/assets/svg/hamburger.svg";

import Logo from "./Logo";
import MobileNavbarWallet from "./MobileNavbarWallet";

interface IMobileNavbar {
  toggleIsHelpOpen: () => void;
  toggleIsSettingsOpen: () => void;
}

const MobileNavbar: React.FC<IMobileNavbar> = ({
  toggleIsHelpOpen,
  toggleIsSettingsOpen,
}) => {
  const [isMenuOpen, toggleIsMenuOpen] = useToggle(false);

  return (
    <>
      <div className="relative flex h-16 w-full items-center justify-between md:!hidden">
        <Logo />
        <LightButton
          text=""
          icon={<HamburgerIcon />}
          onPress={toggleIsMenuOpen}
        />
      </div>
      <Modal
        className={clsx(
          "mt-16 h-auto max-h-[80vh] w-full overflow-y-auto px-6 py-8",
          "absolute top-0 left-0 flex flex-col gap-6",
          "shadow-default rounded-base border-klerosUIComponentsStroke bg-klerosUIComponentsWhiteBackground border",
          "animate-slide-in-top",
        )}
        isOpen={isMenuOpen}
        onOpenChange={toggleIsMenuOpen}
        isDismissable
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Web3Gated preload fallback={<ConnectWalletSlot />}>
            <MobileNavbarWallet />
          </Web3Gated>
        </div>

        <hr className="border-klerosUIComponentsStroke w-full" />
        <div>
          <QuickGuideButton
            className={clsx(
              "[&_.button-text]:text-klerosUIComponentsPrimaryText! [&_.button-text]:text-base",
              "[&>svg_path]:fill-klerosUIComponentsSecondaryText [&_.button-svg]:mr-2",
              "hover:[&>svg_path]:fill-klerosUIComponentsPrimaryText",
            )}
          />
          <LightButton
            className={clsx(
              "[&>p]:text-klerosUIComponentsPrimaryText [&>p]:ml-2 [&>p]:font-normal",
            )}
            text="Help"
            icon={<HelpIcon className={clsx("size-4")} />}
            onPress={toggleIsHelpOpen}
          />
          <LightButton
            className={clsx(
              "[&>p]:text-klerosUIComponentsPrimaryText [&>p]:ml-2 [&>p]:font-normal",
            )}
            text="Settings"
            icon={<SettingsIcon className={clsx("size-4")} />}
            onPress={toggleIsSettingsOpen}
          />
          <ThemeToggle withText />
        </div>
      </Modal>
    </>
  );
};

export default MobileNavbar;
