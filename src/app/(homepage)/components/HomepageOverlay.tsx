import clsx from "clsx";

import HomepageOverlaySvg from "@/assets/svg/homepage-overlay.svg";

const HomepageOverlay: React.FC = () => {
  return (
    <HomepageOverlaySvg
      className={clsx(
        "absolute left-1/2 -z-1 max-w-360 -translate-x-1/2 translate-y-6",
        "dark:[&_path]:fill-klerosUIComponentsWhiteBackground [&_path]:fill-[#4872FF05]",
      )}
    />
  );
};

export default HomepageOverlay;
