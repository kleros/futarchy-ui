import clsx from "clsx";
import Link from "next/link";

import ConnectWallet from "@/components/ConnectWallet";
import LightButton from "@/components/LightButton";
import ThemeToggle from "@/components/ThemeToggle";

import HelpIcon from "@/assets/menu-icons/help.svg";
import GnosisIcon from "@/assets/svg/gnosis.svg";

import Logo from "./Logo";

interface IDesktopNavbar {
  toggleIsHelpOpen: () => void;
}

const DesktopNavbar: React.FC<IDesktopNavbar> = ({ toggleIsHelpOpen }) => {
  return (
    <div className="relative hidden h-16 w-full items-center justify-between md:flex">
      <Logo />

      <div className="ml-2 flex items-center gap-1 md:gap-2">
        <div className="mr-8.75 flex items-center gap-4">
          {/* TODO: update links */}
          <Link
            href="/"
            className={clsx(
              "text-klerosUIComponentsPrimaryText text-base",
              "transition-transform duration-200 hover:scale-102",
            )}
          >
            Home
          </Link>
          <Link
            href="/"
            className={clsx(
              "text-klerosUIComponentsPrimaryText text-base",
              "transition-transform duration-200 hover:scale-102",
            )}
          >
            Policy
          </Link>
        </div>
        <GnosisIcon className="mr-2.5 size-6" />
        <ConnectWallet />
        <div className="flex items-center">
          <LightButton
            text=""
            onPress={toggleIsHelpOpen}
            icon={<HelpIcon className="size-4" />}
            className="flex min-h-8 items-center"
          />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default DesktopNavbar;
