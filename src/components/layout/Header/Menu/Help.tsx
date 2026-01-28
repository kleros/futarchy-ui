import React from "react";

import { Modal } from "@kleros/ui-components-library";
import clsx from "clsx";
import Link from "next/link";

import Guide from "@/assets/menu-icons/book.svg";
import Bug from "@/assets/menu-icons/bug.svg";
import ETH from "@/assets/menu-icons/eth.svg";
import Feedback from "@/assets/menu-icons/feedback.svg";
import Faq from "@/assets/menu-icons/help.svg";
import Telegram from "@/assets/menu-icons/telegram.svg";

import { appGuideLink, faqLink } from "@/consts/markets";

// TODO : update links
const ITEMS = [
  {
    text: "Get Help",
    Icon: Telegram,
    url: "https://t.me/kleros",
  },
  {
    text: "Report a Bug",
    Icon: Bug,
    url: "https://github.com/kleros/futarchy-ui/issues",
  },
  {
    text: "Give Feedback",
    Icon: Feedback,
    url: "/",
  },
  {
    text: "App Guide",
    Icon: Guide,
    url: appGuideLink,
  },
  {
    text: "Crypto Beginner's Guide",
    Icon: ETH,
    url: "https://ethereum.org/en/wallets/",
  },
  {
    text: "FAQ",
    Icon: Faq,
    url: faqLink,
  },
];

interface IHelp {
  isOpen?: boolean;
  toggleIsHelpOpen: () => void;
}
const Help: React.FC<IHelp> = ({ isOpen, toggleIsHelpOpen }) => {
  return (
    <Modal
      className={clsx(
        "mt-18 h-auto max-h-[80vh] w-65 max-w-111 overflow-y-auto p-3 pr-6",
        "absolute top-0 right-0 left-auto flex flex-col",
        "shadow-default rounded-base border-klerosUIComponentsStroke bg-klerosUIComponentsWhiteBackground border",
        "animate-slide-in-left",
      )}
      isOpen={isOpen}
      onOpenChange={toggleIsHelpOpen}
      isDismissable
    >
      <div className="size-full" role="menu"></div>
      {ITEMS.map(({ text, Icon, url }) => (
        <Link
          className={clsx(
            "flex cursor-pointer items-center gap-2 px-2 py-3",
            "transition-transform duration-200 hover:scale-102",
          )}
          href={url}
          key={text}
          target="_blank"
          rel="noopener noreferrer"
          role="menuitem"
          aria-label={`${text} - opens in new tab`}
        >
          <Icon
            className={clsx(
              "fill-klerosUIComponentsSecondaryPurple [&_path]:fill-klerosUIComponentsSecondaryPurple",
              "inline-block size-4",
            )}
          />
          <small
            className={clsx(
              "text-klerosUIComponentsSecondaryText hover:text-klerosUIComponentsSecondaryPurple text-base",
              "hover:text-klerosUIComponentsSecondaryPurple transition-colors duration-200",
            )}
          >
            {text}
          </small>
        </Link>
      ))}
    </Modal>
  );
};
export default Help;
