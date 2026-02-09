import Link from "next/link";

import ExternalArrow from "@/assets/svg/external-arrow.svg";

import { cn } from "@/utils";

interface IExternalLink {
  url: string;
  text: string;
  showIcon?: boolean;
  className?: string;
}
const ExternalLink: React.FC<IExternalLink> = ({
  url,
  text,
  showIcon = true,
  className,
}) => (
  <Link
    href={url}
    target="_blank"
    rel="noreferrer noopener"
    className={cn(
      "text-klerosUIComponentsPrimaryBlue items-center text-sm",
      className,
    )}
  >
    {text} {showIcon ? <ExternalArrow className="ml-1 inline size-4" /> : null}
  </Link>
);

export default ExternalLink;
