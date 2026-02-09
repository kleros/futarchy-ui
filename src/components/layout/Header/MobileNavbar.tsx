import { Button, Modal } from "@kleros/ui-components-library";
import clsx from "clsx";
import { useToggle } from "react-use";
import { useAccount, useDisconnect } from "wagmi";

import ConnectWallet from "@/components/ConnectWallet";
import { CopiableAddressDisplay } from "@/components/ConnectWallet/AccountDetails";
import {
  ChainDisplay,
  IdenticonOrAvatar,
} from "@/components/ConnectWallet/AccountDisplay";
import LightButton from "@/components/LightButton";
import ThemeToggle from "@/components/ThemeToggle";

import HelpIcon from "@/assets/menu-icons/help.svg";
import HamburgerIcon from "@/assets/svg/hamburger.svg";

import Logo from "./Logo";

interface IMobileNavbar {
  toggleIsHelpOpen: () => void;
}

const MobileNavbar: React.FC<IMobileNavbar> = ({ toggleIsHelpOpen }) => {
  const { isConnected } = useAccount();
  const [isMenuOpen, toggleIsMenuOpen] = useToggle(false);
  const { disconnect } = useDisconnect();

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
        <hr className="border-klerosUIComponentsStroke w-full" />
        <div className="flex flex-wrap items-center justify-between gap-4">
          {isConnected ? (
            <>
              <div className="flex flex-col items-start gap-4 md:items-center">
                <div className="flex gap-2">
                  <IdenticonOrAvatar size={24} />
                  <CopiableAddressDisplay />
                </div>
                <ChainDisplay />
              </div>
              <Button
                small
                variant="primary"
                text="Disconnect"
                onPress={() => disconnect()}
              />
            </>
          ) : (
            <ConnectWallet />
          )}
        </div>

        <hr className="border-klerosUIComponentsStroke w-full" />
        <div>
          <LightButton
            className={clsx(
              "[&>p]:text-klerosUIComponentsPrimaryText [&>p]:ml-2 [&>p]:font-normal",
            )}
            text="Help"
            icon={<HelpIcon className={clsx("size-4")} />}
            onPress={toggleIsHelpOpen}
          />
          <ThemeToggle withText />
        </div>
      </Modal>
    </>
  );
};

export default MobileNavbar;
