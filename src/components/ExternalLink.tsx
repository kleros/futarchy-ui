import Link from "next/link";

import ExternalArrow from "@/assets/svg/external-arrow.svg";

const ExternalLink: React.FC<{ url: string; text: string }> = ({
  url,
  text,
}) => (
  <Link
    href={url}
    target="_blank"
    rel="noreferrer noopener"
    className="text-klerosUIComponentsPrimaryBlue items-center text-sm"
  >
    {text} <ExternalArrow className="ml-1 inline size-4" />
  </Link>
);

export default ExternalLink;
