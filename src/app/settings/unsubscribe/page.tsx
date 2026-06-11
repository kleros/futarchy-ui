"use client";
import React, { useCallback, useEffect, useState } from "react";

import { useAtlasProvider } from "@kleros/kleros-app";
import { AlertMessage, Button } from "@kleros/ui-components-library";
import clsx from "clsx";
import Link from "next/link";
import { usePrevious } from "react-use";
import { useAccount } from "wagmi";

import EnsureChain from "@/components/EnsureChain";
import Loader from "@/components/Loader";

import CheckIcon from "@/assets/svg/check-circle.svg";

import { cn } from "@/utils";
import { errorToast, infoToast, successToast } from "@/utils/wrapWithToast";

const pageLayoutClassName = clsx(
  "flex flex-col gap-x-4 gap-y-12 px-4 py-12 md:px-8 lg:px-32",
  "size-full items-center justify-center",
  "md:justify-between lg:flex-row",
);

const Unsubscribe: React.FC = () => {
  const { address } = useAccount();
  const [IsUnsubscribed, setIsUnsubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const {
    isFetchingUser,
    isVerified,
    isSigningIn,
    isDeletingUser,
    authoriseUser,
    deleteUser,
    userExists,
  } = useAtlasProvider();
  const prevIsFetchingUser = usePrevious(isFetchingUser);

  useEffect(() => {
    if (!address || !isVerified) {
      setIsLoading(false);
      return;
    }

    if (isFetchingUser) {
      setIsLoading(true);
      return;
    }

    if (prevIsFetchingUser) {
      setIsLoading(false);
      return;
    }

    const timeoutId = window.setTimeout(() => setIsLoading(false), 50);
    return () => window.clearTimeout(timeoutId);
  }, [address, isVerified, isFetchingUser, prevIsFetchingUser]);

  const isAlreadyUnsubscribed =
    !isLoading && Boolean(address) && isVerified && !userExists;
  const showSuccess = IsUnsubscribed || isAlreadyUnsubscribed;

  const handleUnsubscribe = useCallback(async () => {
    if (!address) return;

    if (!isVerified) {
      infoToast("Signing in User...");
      try {
        await authoriseUser();
        successToast("Signed In successfully!");
      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          errorToast(`Sign-In failed: ${error.message}`);
        }
        return;
      }
    }

    infoToast("Unsubscribing ...");
    try {
      const res = await deleteUser();
      if (!res) {
        errorToast("Unsubscribe failed: Unknown error");
        return;
      }
      setIsUnsubscribed(true);
      successToast("You have been unsubscribed from notifications.");
    } catch (error) {
      console.error("Unsubscribe failed:", error);
      if (error instanceof Error) {
        errorToast(`Unsubscribe failed: ${error.message}`);
      }
    }
  }, [address, isVerified, authoriseUser, deleteUser]);

  if (isLoading) {
    return (
      <div className={pageLayoutClassName}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={pageLayoutClassName}>
      {showSuccess ? (
        <>
          <div
            className={clsx(
              "flex grow flex-col gap-8",
              "items-center lg:items-start",
            )}
          >
            <CheckIcon
              className={cn(
                "[&_path]:fill-klerosUIComponentsSuccess",
                "size-16",
              )}
            />
            <h1 className="text-klerosUIComponentsSuccess llg:text-left text-center text-2xl font-semibold">
              You have been unsubscribed
            </h1>
            <h3
              className={clsx(
                "max-w-[735px]",
                "text-klerosUIComponentsPrimaryText text-center text-base font-semibold lg:text-left",
              )}
            >
              You will no longer receive notification emails from Kleros
              products.
            </h3>
            <Link href="/">
              <Button text="Back to Home" />
            </Link>
          </div>
          <CheckIcon
            width={250}
            height={250}
            className="[&_path]:fill-klerosUIComponentsWhiteBackground"
          />
        </>
      ) : (
        <>
          <div
            className={clsx(
              "flex w-full max-w-[735px] grow flex-col gap-8",
              "items-center lg:items-start",
            )}
          >
            <h1 className="text-klerosUIComponentsPrimaryText text-center text-2xl font-semibold lg:text-left">
              Unsubscribe from Notifications
            </h1>
            <EnsureChain>
              <div className="flex w-full flex-col items-center gap-6 lg:items-start">
                <Button
                  text="Unsubscribe"
                  onPress={handleUnsubscribe}
                  isDisabled={isSigningIn || isDeletingUser}
                  isLoading={isSigningIn || isDeletingUser}
                  className={clsx(
                    "bg-klerosUIComponentsError! hover:bg-klerosUIComponentsError! hover:opacity-75",
                    "border-klerosUIComponentsError! [&_.button-text]:text-wrap! [&_.button-text]:text-white!",
                  )}
                />
                <AlertMessage
                  variant="warning"
                  title="Warning"
                  msg="This will unsubscribe you from all kleros products"
                />
              </div>
            </EnsureChain>
          </div>
        </>
      )}
    </div>
  );
};

export default Unsubscribe;
