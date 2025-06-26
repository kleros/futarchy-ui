"use client";

import { useTheme } from "next-themes";
import SeerLogoLight from "@/assets/svg/seer-logo-light.svg";
import SeerLogoDark from "@/assets/svg/seer-logo-dark.svg";
import { useEffect, useState } from "react";

const SeerLogo: React.FC<{ className?: string }> = ({ className }) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span className={className}>
        <SeerLogoLight aria-hidden />
      </span>
    );
  }

  return resolvedTheme === "light" ? (
    <SeerLogoLight className={className} />
  ) : (
    <SeerLogoDark className={className} />
  );
};

export default SeerLogo;
