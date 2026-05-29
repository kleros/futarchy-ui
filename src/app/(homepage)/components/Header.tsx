import clsx from "clsx";

import EyeIcon from "@/assets/svg/eye.svg";
import ForesightLogo from "@/assets/svg/foresight-logo.svg";
const Header: React.FC = () => {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <ForesightLogo className="w-24 md:w-39.75" />
      <EyeIcon />
      <h1
        className={clsx(
          "bg-gradient-to-r from-[#4872FF] to-[#1D6AAA] bg-clip-text dark:to-[#9DD3FF]",
          "text-center text-2xl font-bold text-transparent italic md:text-5xl",
        )}
      >
        See Further. Decide Smarter.
      </h1>
      <h2
        className={clsx(
          "bg-gradient-to-r from-[#4872FF] to-[#1D6AAA] bg-clip-text dark:to-[#9DD3FF]",
          "text-center text-sm text-transparent italic md:text-base",
        )}
      >
        EXPLORE AVAILABLE PREDICTIONS
      </h2>
    </div>
  );
};

export default Header;
