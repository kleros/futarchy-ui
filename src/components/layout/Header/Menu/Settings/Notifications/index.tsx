import React from "react";

import EnsureAuth from "@/components/EnsureAuth";
import EnsureChain from "@/components/EnsureChain";

import { ISettings } from "../..";

import FormContactDetails from "./FormContactDetails";

const NotificationSettings: React.FC<ISettings> = ({
  toggleIsSettingsOpen,
}) => {
  return (
    <div className="flex justify-center pt-4">
      <EnsureChain>
        <div className="flex size-full flex-col items-center">
          <EnsureAuth>
            <>
              <div className="text-klerosUIComponentsPrimaryText mt-4 mb-3 flex justify-center text-base font-semibold">
                Contact Details
              </div>
              <FormContactDetails togglePopup={toggleIsSettingsOpen} />
            </>
          </EnsureAuth>
        </div>
      </EnsureChain>
    </div>
  );
};

export default NotificationSettings;
