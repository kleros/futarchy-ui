import React, { useCallback } from "react";

import { useAtlasProvider } from "@kleros/kleros-app";
import { Button } from "@kleros/ui-components-library";
import clsx from "clsx";

import HourglassIcon from "@/assets/menu-icons/hourglass.svg";

import { errorToast, infoToast, successToast } from "@/utils/wrapWithToast";

interface IEmailInfo {
  toggleIsSettingsOpen: () => void;
}

const EmailVerificationInfo: React.FC<IEmailInfo> = ({
  toggleIsSettingsOpen,
}) => {
  const { userExists, user, updateEmail } = useAtlasProvider();

  const resendVerificationEmail = useCallback(() => {
    if (!user) return;
    infoToast(`Sending verification email ...`);
    updateEmail({ newEmail: user.email })
      .then(async (res) => {
        if (res) {
          successToast("Verification email sent successfully!");
          toggleIsSettingsOpen();
        }
      })
      .catch((err) => {
        console.log(err);
        errorToast(`Failed to send verification email: ${err?.message}`);
      });
  }, [user, updateEmail, toggleIsSettingsOpen]);

  return userExists && !user?.isEmailVerified ? (
    <div
      className={clsx(
        "flex flex-row items-center gap-4",
        "mt-4 w-full pt-4",
        "border-klerosUIComponentsStroke border-t",
      )}
    >
      <HourglassIcon
        width={32}
        height={32}
        className="fill-klerosUIComponentsPrimaryBlue"
      />
      <div className="flex flex-col items-start gap-1">
        <h3 className="text-klerosUIComponentsPrimaryText text-base font-semibold">
          Email Verification Pending
        </h3>
        <label className="text-klerosUIComponentsSecondaryText text-sm">
          We sent you a verification email. Please, verify it.
          <br /> Didn’t receive the email?{" "}
          <Button
            variant="secondary"
            className={clsx(
              "inline-block border-none bg-transparent p-0 hover:bg-transparent focus:bg-transparent",
              "[&_.button-text]:text-sm [&_.button-text]:font-normal",
            )}
            text="Resend it"
            onPress={resendVerificationEmail}
          />
        </label>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default EmailVerificationInfo;
