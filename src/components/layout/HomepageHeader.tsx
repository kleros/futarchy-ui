"use client";

import clsx from "clsx";
import dynamic from "next/dynamic";
import { useToggle } from "react-use";

import LightButton from "@/components/LightButton";
import ThemeToggle from "@/components/ThemeToggle";

import HelpIcon from "@/assets/menu-icons/help.svg";

import Logo from "./Header/Logo";

const Help = dynamic(() => import("./Header/Menu/Help"), { ssr: false });

const HomepageHeader: React.FC = () => {
  const [isHelpOpen, toggleIsHelpOpen] = useToggle(false);

  return (
    <div
      className={clsx(
        "bg-klerosUIComponentsWhiteBackground",
        "sticky top-0 z-30 flex w-full px-6",
      )}
    >
      <div className="flex h-16 w-full items-center justify-between">
        <Logo />
        <div className="flex items-center gap-1">
          <div
            className={clsx(
              "flex min-h-8 items-center",
              "[&_.button-text]:block md:[&_.button-text]:hidden",
              "not-dark:not-md:[&_.button-svg]:fill-black/75 not-dark:not-md:hover:[&_.button-svg]:fill-black",
            )}
          >
            <LightButton
              text="Help"
              icon={<HelpIcon className="size-4" />}
              onPress={toggleIsHelpOpen}
            />
          </div>
          <ThemeToggle />
        </div>
      </div>
      {isHelpOpen ? (
        <Help isOpen={isHelpOpen} toggleIsHelpOpen={toggleIsHelpOpen} />
      ) : null}
    </div>
  );
};

export default HomepageHeader;
