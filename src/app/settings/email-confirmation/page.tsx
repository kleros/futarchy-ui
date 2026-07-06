"use client";
import React, { useEffect, useRef, useState } from "react";

import { useAtlasProvider } from "@kleros/kleros-app";
import { Button } from "@kleros/ui-components-library";
import clsx from "clsx";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { isAddress } from "viem";

import Loader from "@/components/Loader";
import Web3Gated from "@/components/Web3Gated";

import CheckIcon from "@/assets/svg/check-circle.svg";
import InvalidIcon from "@/assets/svg/minus-outline.svg";
import WarningIcon from "@/assets/svg/warning-outline.svg";

import { cn } from "@/utils";

import { tgLink } from "@/consts/markets";

enum TextColor {
  Primary,
  Error,
  Success,
  Warning,
}

const textStyle = "text-center whitespace-pre-line lg:text-left";

const textColorStyles: Record<TextColor, string> = {
  [TextColor.Primary]: "text-klerosUIComponentsPrimaryText",
  [TextColor.Error]: "text-klerosUIComponentsError",
  [TextColor.Success]: "text-klerosUIComponentsSuccess",
  [TextColor.Warning]: "text-klerosUIComponentsWarning",
};

const iconColorStyles: Record<TextColor, string> = {
  [TextColor.Primary]: "[&_path]:fill-klerosUIComponentsPrimaryText",
  [TextColor.Error]: "[&_path]:fill-klerosUIComponentsError",
  [TextColor.Success]: "[&_path]:fill-klerosUIComponentsSuccess",
  [TextColor.Warning]: "[&_path]:fill-klerosUIComponentsWarning",
};

const messageConfigs = {
  invalid: {
    headerMsg: "Invalid Link!",
    subtitleMsg: "Oops, seems like you followed an invalid link.",
    buttonMsg: "Contact Support",
    buttonTo: tgLink,
    Icon: InvalidIcon,
    color: TextColor.Primary,
  },
  error: {
    headerMsg: "Something went wrong",
    subtitleMsg: "Oops, seems like something went wrong in our systems",
    buttonMsg: "Contact Support",
    buttonTo: tgLink,
    Icon: WarningIcon,
    color: TextColor.Error,
  },
  confirmed: {
    headerMsg: "Congratulations! \nYour email has been verified!",
    subtitleMsg:
      "We'll remind you when you can redeem your positions on Foresight.",
    buttonMsg: "Let's start!",
    buttonTo: "/",
    Icon: CheckIcon,
    color: TextColor.Success,
  },
  expired: {
    headerMsg: "Verification link expired...",
    subtitleMsg:
      'Oops, the email verification link has expired. No worries! Go to settings and click on "Resend" it to receive another verification email.',
    buttonMsg: "Open Settings",
    buttonTo: "/#notifications",
    Icon: WarningIcon,
    color: TextColor.Warning,
  },
};

type Status = keyof typeof messageConfigs;

const EmailConfirmationContent: React.FC = () => {
  const { confirmEmail } = useAtlasProvider();

  const [status, setStatus] = useState<Status | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const hasConfirmed = useRef(false);

  const searchParams = useSearchParams();
  const address = searchParams.get("address");
  const token = searchParams.get("token");

  useEffect(() => {
    if (hasConfirmed.current) return;

    if (!address || !isAddress(address) || !token) {
      setStatus("invalid");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    confirmEmail({ address, token })
      .then((res) => {
        if (res.isConfirmed) {
          setStatus("confirmed");
          hasConfirmed.current = true;
        } else if (res.isTokenInvalid) {
          setStatus("invalid");
        } else if (res.isError) {
          setStatus("error");
        } else {
          setStatus("expired");
        }
      })
      .catch(() => {
        setStatus("error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [address, token, confirmEmail]);

  const { headerMsg, subtitleMsg, buttonMsg, buttonTo, Icon, color } =
    messageConfigs[status ?? "error"];

  return (
    <div
      className={clsx(
        "flex flex-col gap-x-4 gap-y-12 px-4 py-12 md:px-8 lg:px-32",
        "size-full items-center justify-center",
        "lg:flex-row lg:justify-between",
      )}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div
            className={clsx(
              "flex grow flex-col gap-8",
              "items-center lg:items-start",
            )}
          >
            <Icon className={cn(iconColorStyles[color], "size-16")} />
            <h1 className={cn(textStyle, textColorStyles[color])}>
              {headerMsg}
            </h1>
            <h3
              className={cn(
                "text-klerosUIComponentsPrimaryText max-w-[735px] text-base font-semibold",
                textStyle,
              )}
            >
              {subtitleMsg}
            </h3>
            <Link href={buttonTo}>
              <Button text={buttonMsg} />
            </Link>
          </div>
          <Icon
            width={250}
            height={250}
            className="[&_path]:fill-klerosUIComponentsWhiteBackground"
          />
        </>
      )}
    </div>
  );
};

const EmailConfirmation: React.FC = () => (
  <Web3Gated preload fallback={<Loader />}>
    <EmailConfirmationContent />
  </Web3Gated>
);

export default EmailConfirmation;
