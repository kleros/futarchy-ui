import { useTheme } from "next-themes";

import SeerLogoLight from "@/assets/svg/seer-logo-dark.svg";
import SeerLogoDark from "@/assets/svg/seer-logo-light.svg";

const SeerLogo: React.FC<{ className?: string }> = ({ className }) => {
  const { theme } = useTheme();
  return theme === "light" ? (
    <SeerLogoLight {...{ className }} />
  ) : (
    <SeerLogoDark {...{ className }} />
  );
};

export default SeerLogo;
