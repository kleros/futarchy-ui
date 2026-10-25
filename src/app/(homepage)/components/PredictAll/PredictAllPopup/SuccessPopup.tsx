import React from "react";

import { useAtlasProvider } from "@kleros/kleros-app";
import { Button, Modal, TextField } from "@kleros/ui-components-library";
import clsx from "clsx";

import { useIsSubscribed } from "@/hooks/useIsSubscribed";

import InfoCard from "@/components/InfoCard";
import FormContactDetails from "@/components/layout/Header/Menu/Settings/Notifications/FormContactDetails";

import CheckIcon from "@/assets/svg/check-circle.svg";

interface ISuccessPopup {
  isVisible: boolean;
  closePopup: () => void;
}
const SuccessPopup: React.FC<ISuccessPopup> = ({ isVisible, closePopup }) => {
  const { user } = useAtlasProvider();
  const { isSubscribed } = useIsSubscribed();

  return (
    <Modal
      isOpen={isVisible}
      modalOverlayClassname="z-40"
      className={clsx(
        "h-fit max-h-[calc(100vh-32px)] w-full max-w-[calc(100vw-32px)] overflow-y-auto sm:w-160",
        "flex flex-col items-center gap-8 p-8",
      )}
    >
      <h1 className="text-klerosUIComponentsPrimaryText text-center text-2xl font-semibold whitespace-pre-line">
        {"Congratulations! \nYour Prediction was Done!"}
      </h1>
      <CheckIcon className="size-32" />

      <hr className="border-klerosUIComponentsStroke w-full" />
      {isSubscribed ? (
        <div className="flex w-full flex-col items-center gap-8">
          <p className="text-klerosUIComponentsSecondaryText w-full text-center text-sm">
            {user?.email
              ? "You will receive a notification on the following email once the market resolves."
              : "You are already subscribed to notifications. " +
                "You will receive an email once the market resolves."}
          </p>
          <div className="space-y-2">
            {user?.email ? (
              <TextField
                isDisabled
                value={user?.email}
                className={clsx("w-full [&_input]:text-sm", "[&>label]:hidden")}
                label="Email"
              />
            ) : null}
            <InfoCard
              className="w-fit text-sm wrap-break-word"
              msg={
                user?.email
                  ? "You can update your subscription preference at any time on Settings. " +
                    "Please make sure that you have confirmed your email."
                  : "You can update your email or subscription preference at any time on Settings."
              }
            />
          </div>
          <Button small text="Close" onPress={closePopup} />
        </div>
      ) : (
        <div className="flex w-full flex-col items-center gap-11.25">
          <div>
            <h2 className="text-klerosUIComponentsPrimaryText w-full text-center text-base font-semibold">
              Subscribe for Email Notifications
            </h2>
            <p className="text-klerosUIComponentsSecondaryText w-full text-center text-sm">
              We advise you to subscribe to receive notifications about the
              progress of your predictions.
            </p>
          </div>
          <FormContactDetails
            togglePopup={closePopup}
            infoText="You can update your subscription preference at any time on Settings."
            isPostPrediction
          />
        </div>
      )}
    </Modal>
  );
};

export default SuccessPopup;
