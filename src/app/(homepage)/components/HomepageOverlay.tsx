import clsx from "clsx";

import HomepageOverlaySvg from "@/assets/svg/homepage-overlay.svg";

const HomepageOverlay: React.FC = () => {
  return (
    <HomepageOverlaySvg
      className={clsx(
        "absolute left-1/2 -z-1 -translate-x-1/2 translate-y-6",
        "w-[200%] origin-top scale-50 sm:w-[150%] sm:scale-75 md:w-full md:max-w-360 md:scale-95",
        "dark:[&_path]:fill-klerosUIComponentsWhiteBackground [&_path]:fill-[#4872FF05]",
      )}
    />
  );
};

export default HomepageOverlay;
