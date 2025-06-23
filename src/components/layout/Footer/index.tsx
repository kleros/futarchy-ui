import React from "react";

import clsx from "clsx";
import Link from "next/link";

import LightButton from "@/components/LightButton";

import GithubLogo from "@/assets/socialmedia/github.svg";
import TelegramLogo from "@/assets/socialmedia/telegram.svg";
import XLogo from "@/assets/socialmedia/x.svg";
import SecuredByKlerosLogo from "@/assets/svg/secured-by-kleros.svg";

// TODO: update links
const socialmedia = {
  telegram: {
    icon: TelegramLogo,
    url: "https://t.me/kleros",
  },
  x: {
    icon: XLogo,
    url: "https://x.com/kleros_io",
  },
  github: {
    icon: GithubLogo,
    url: "https://github.com/kleros",
  },
};

const SecuredByKleros: React.FC = () => (
  <Link
    className="hover:underline"
    href="https://kleros.io"
    target="_blank"
    rel="noreferrer"
  >
    <SecuredByKlerosLogo
      className={clsx(
        "hover-short-transition ml-2 min-h-6",
        "[&_path]:fill-white/75 hover:[&_path]:fill-white",
      )}
    />
  </Link>
);

const SocialMedia = () => (
  <div className="flex">
    {Object.values(socialmedia).map(({ url, icon: Icon }) => (
      <Link key={url} href={url} target="_blank" rel="noreferrer">
        <LightButton icon={<Icon />} text="" className="[&_svg]:mr-0" />
      </Link>
    ))}
  </div>
);

const Footer: React.FC = () => (
  <div
    className={clsx(
      "bg-footer-background",
      "min-h-16 w-full",
      "flex shrink-0 flex-col items-center justify-between gap-4 px-6 py-5 md:flex-row md:py-0",
    )}
  >
    <SecuredByKleros />
    <SocialMedia />
  </div>
);

export default Footer;
