"use client";
import clsx from "clsx";
import { useToggle } from "react-use";

import Help from "./Menu/Help";
import Settings from "./Menu/Settings";

import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";
import { useEffect } from "react";

const Header: React.FC = () => {
  const [isHelpOpen, toggleIsHelpOpen] = useToggle(false);
  const [isSettingsOpen, toggleIsSettingsOpen] = useToggle(false);

  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;

      if (hash.startsWith("#notifications")) {
        toggleIsSettingsOpen();
      }
    };

    checkHash();

    window.addEventListener("hashchange", checkHash);

    return () => {
      window.removeEventListener("hashchange", checkHash);
    };
  }, []);

  return (
    <div
      className={clsx(
        "bg-klerosUIComponentsWhiteBackground",
        "wrap sticky top-0 z-30 flex w-full px-6",
      )}
    >
      <DesktopNavbar {...{ toggleIsHelpOpen, toggleIsSettingsOpen }} />
      <MobileNavbar {...{ toggleIsHelpOpen, toggleIsSettingsOpen }} />

      <Help {...{ toggleIsHelpOpen, isOpen: isHelpOpen }} />
      <Settings {...{ toggleIsSettingsOpen, isOpen: isSettingsOpen }} />
    </div>
  );
};

export default Header;
