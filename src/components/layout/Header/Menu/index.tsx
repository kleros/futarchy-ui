import React from "react";

import clsx from "clsx";

import LightButton from "@/components/LightButton";
import ThemeToggle from "@/components/ThemeToggle";

import HelpIcon from "@/assets/menu-icons/help.svg";
import SettingsIcon from "@/assets/menu-icons/settings.svg";

export interface ISettings {
  toggleIsSettingsOpen: () => void;
}

interface IHelp {
  toggleIsHelpOpen: () => void;
}

const Menu: React.FC<ISettings & IHelp> = ({
  toggleIsHelpOpen,
  toggleIsSettingsOpen,
}) => {
  return (
    <div className="flex flex-col md:flex-row">
      <div
        className={clsx(
          "flex min-h-8 items-center",
          "[&_.button-text]:block md:[&_.button-text]:hidden",
          "not-dark:not-md:[&_.button-svg]:fill-black/75 not-dark:not-md:hover:[&_.button-svg]:fill-black",
        )}
      >
        <LightButton
          text="Settings"
          Icon={SettingsIcon}
          onPress={toggleIsSettingsOpen}
        />
      </div>
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
  );
};

export default Menu;
