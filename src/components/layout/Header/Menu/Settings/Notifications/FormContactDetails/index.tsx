import React, { useCallback, useEffect, useState } from "react";

import { useAtlasProvider } from "@kleros/kleros-app";
import {
  AlertMessage,
  Button,
  Form,
  TextField,
} from "@kleros/ui-components-library";
import clsx from "clsx";
import { useAccount } from "wagmi";

import InfoCard from "@/components/InfoCard";

import { isEmpty, isUndefined } from "@/utils";
import { timeLeftUntil } from "@/utils/date";
import { errorToast, infoToast, successToast } from "@/utils/wrapWithToast";

import EmailVerificationInfo from "./EmailVerificationInfo";

// https://www.w3.org/TR/2012/WD-html-markup-20120329/input.email.html#input.email.attrs.value.single
export const EMAIL_REGEX =
  // eslint-disable-next-line max-len
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const unsubscribeButtonClassName = clsx(
  "bg-klerosUIComponentsError! hover:bg-klerosUIComponentsError! hover:opacity-75",
  "border-klerosUIComponentsError! [&_.button-text]:text-wrap! [&_.button-text]:text-white!",
);

type FormDetailsParams = {
  togglePopup: () => void;
  isPostPrediction?: boolean;
  infoText?: string;
};
const FormContactDetails: React.FC<FormDetailsParams> = ({
  togglePopup,
  isPostPrediction,
  infoText,
}) => {
  const [emailInput, setEmailInput] = useState<string>("");
  const [isConfirmingUnsubscribe, setIsConfirmingUnsubscribe] = useState(false);
  const { address } = useAccount();
  const {
    user,
    isAddingUser,
    isFetchingUser,
    addUser,
    updateEmail,
    isUpdatingUser,
    isDeletingUser,
    deleteUser,
    userExists,
    isVerified,
    authoriseUser,
    isSigningIn,
  } = useAtlasProvider();

  const isEditingEmail = user?.email !== emailInput;
  const emailIsValid = EMAIL_REGEX.test(emailInput);

  const isEmailUpdateable = user?.email
    ? !isUndefined(user?.emailUpdateableAt) &&
      new Date(user.emailUpdateableAt).getTime() < new Date().getTime()
    : true;

  useEffect(() => {
    if (!user || !userExists) return;

    setEmailInput(user.email);
  }, [user, userExists]);

  const handleAuthorization = useCallback(async () => {
    infoToast(`Signing in User...`);
    try {
      await authoriseUser();
      successToast("Signed In successfully!");
      return true;
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        errorToast(`Sign-In failed: ${error.message}`);
      }
      return false;
    }
  }, [authoriseUser]);

  const handleConfirmUnsubscribe = useCallback(async () => {
    if (isUndefined(address)) return;

    infoToast("Unsubscribing ...");
    deleteUser()
      .then((res) => {
        if (!res) {
          errorToast("Unsubscribe failed: Unknown error");
          return;
        }
        setEmailInput("");
        setIsConfirmingUnsubscribe(false);
        successToast("You have been unsubscribed from notifications.");
        togglePopup();
      })
      .catch((err) => {
        console.error("Unsubscribe failed:", err);
        errorToast(`Unsubscribe failed: ${err?.message || "Unknown error"}`);
      });
  }, [address, deleteUser, togglePopup]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!address || isFetchingUser) {
      return;
    }
    const handleSuccess = (action: string) => {
      successToast(`${action} successful!`);
      togglePopup();
    };

    const handleError = (action: string, err: Error) => {
      console.error(`${action} failed:`, err);
      errorToast(`${action} failed: ${err?.message || "Unknown error"}`);
    };

    if (!isVerified) {
      const res = await handleAuthorization();
      if (!res) return;
    }
    // if user exists then update email
    if (userExists) {
      if (!isEmailUpdateable) return;
      const data = {
        newEmail: emailInput,
      };
      infoToast("Updating email ...");
      updateEmail(data)
        .then((res) => res && handleSuccess("Email update"))
        .catch((err) => handleError("Email update", err));
    } else {
      const data = {
        email: emailInput,
      };
      infoToast("Adding user ...");
      addUser(data)
        .then((res) => res && handleSuccess("User addition"))
        .catch((err) => handleError("User addition", err));
    }
  };

  const SubscribeButton = (
    <Button
      type="submit"
      text={isPostPrediction ? "Subscribe" : "Save"}
      isDisabled={
        !isEditingEmail ||
        !emailIsValid ||
        isAddingUser ||
        isFetchingUser ||
        isUpdatingUser ||
        isDeletingUser ||
        !isEmailUpdateable ||
        isSigningIn
      }
    />
  );
  return (
    <Form
      className="relative flex w-full flex-col gap-4"
      onSubmit={handleSubmit}
    >
      <TextField
        className={clsx(
          "w-full [&_input]:text-sm",
          isPostPrediction ? "[&>label]:hidden" : undefined,
        )}
        label="Email"
        placeholder="your.email@email.com"
        defaultValue={user?.email}
        value={emailInput}
        onChange={setEmailInput}
        isDisabled={!isEmailUpdateable}
        validate={(val) => {
          if (isEmpty(val)) {
            return undefined;
          }
          return EMAIL_REGEX.test(emailInput) ? undefined : "Invalid email";
        }}
        fieldErrorProps={{
          children: ({ validationErrors }) => (
            <ul className="w-full">
              {validationErrors.map((error) => (
                <li
                  key={error}
                  className="text-klerosUIComponentsError text-sm"
                >
                  {error}
                </li>
              ))}
            </ul>
          ),
        }}
        showFieldError
      />
      {infoText || !isEmailUpdateable ? (
        <InfoCard
          className="w-fit text-sm wrap-break-word"
          msg={
            infoText ??
            `You can update email again ${timeLeftUntil(user?.emailUpdateableAt ?? "")}`
          }
        />
      ) : null}
      {!isPostPrediction && isConfirmingUnsubscribe ? (
        <AlertMessage
          title="Warning"
          variant="warning"
          msg="This will unsubscribe you from all kleros products"
        />
      ) : null}
      {isPostPrediction ? (
        <div className="mt-8.25 flex w-full flex-row justify-center gap-4">
          <Button variant="secondary" text="Skip" onClick={togglePopup} />
          {SubscribeButton}
        </div>
      ) : (
        <div className="flex flex-row-reverse justify-between gap-2">
          {isConfirmingUnsubscribe ? (
            <>
              <Button
                text="Confirm Unsubscribe"
                onPress={handleConfirmUnsubscribe}
                isDisabled={isFetchingUser || isDeletingUser}
                isLoading={isDeletingUser}
                className={unsubscribeButtonClassName}
              />
              <Button
                variant="secondary"
                text="Cancel"
                onPress={() => setIsConfirmingUnsubscribe(false)}
                isDisabled={isDeletingUser}
              />
            </>
          ) : (
            <>
              {SubscribeButton}
              {userExists ? (
                <Button
                  variant="secondary"
                  text="Unsubscribe"
                  onPress={() => setIsConfirmingUnsubscribe(true)}
                  isDisabled={isFetchingUser || isDeletingUser}
                  className={unsubscribeButtonClassName}
                />
              ) : null}
            </>
          )}
        </div>
      )}
      <EmailVerificationInfo toggleIsSettingsOpen={togglePopup} />
    </Form>
  );
};

export default FormContactDetails;
