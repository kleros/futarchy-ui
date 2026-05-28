import clsx from "clsx";

import EyeIcon from "@/assets/svg/eye.svg";

const BottomHeader: React.FC = () => {
  return (
    <div className="mb-57.75 flex w-full flex-col items-center gap-3">
      <EyeIcon />
      <h1
        className={clsx(
          "bg-gradient-to-r from-[#4872FF] to-[#1D6AAA] bg-clip-text dark:to-[#9DD3FF]",
          "text-center text-2xl font-bold text-transparent italic md:text-5xl",
        )}
      >
        Predicting Trends. Informing Decisions.
      </h1>
      <h2
        className={clsx(
          "bg-gradient-to-r from-[#4872FF] to-[#1D6AAA] bg-clip-text dark:to-[#9DD3FF]",
          "text-center text-sm text-transparent italic md:text-base",
        )}
      >
        Anticipate Change. Act Early.
      </h2>
    </div>
  );
};

export default BottomHeader;
