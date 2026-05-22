import React from "react";

import { Modal, Tabs } from "@kleros/ui-components-library";
import clsx from "clsx";
import { useRouter } from "next/navigation";

import { isUndefined } from "@/utils";

import General from "./General";
import NotificationSettings from "./Notifications";

const TABS = [
  {
    id: 0,
    value: 0,
    text: "General",
    content: <General />,
  },
  {
    id: 1,
    value: 1,
    text: "Notifications",
    content: null,
  },
];

const Settings: React.FC<{
  isOpen?: boolean;
  toggleIsSettingsOpen: () => void;
}> = ({ isOpen, toggleIsSettingsOpen }) => {
  const router = useRouter();

  const handleOpenChange = () => {
    toggleIsSettingsOpen();

    if (!isUndefined(window) && window.location.hash.includes("notifications"))
      router.push("/");
  };

  return (
    <Modal
      className={clsx(
        "absolute mt-18 h-auto max-h-[80vh] w-full overflow-y-auto p-8 md:w-120 md:max-w-120",
        "top-0 right-0 left-0 flex flex-col md:left-auto",
        "shadow-default rounded-base border-klerosUIComponentsStroke bg-klerosUIComponentsWhiteBackground border",
        "animate-slide-in-left",
      )}
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      isDismissable
    >
      <div
        className={clsx(
          "flex justify-center",
          "text-klerosUIComponentsPrimaryText text-2xl font-semibold",
        )}
      >
        Settings
      </div>
      <Tabs
        className="w-full"
        items={[
          TABS[0],
          {
            ...TABS[1],
            content: <NotificationSettings {...{ toggleIsSettingsOpen }} />,
          },
        ]}
      />
    </Modal>
  );
};

export default Settings;
