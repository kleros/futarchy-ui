import { useMemo } from "react";

import { useTheme } from "next-themes";

import MoonIcon from "@/assets/svg/moon.svg";
import SunIcon from "@/assets/svg/sun.svg";

import { cn } from "@/utils";

import LightButton from "./LightButton";

const ThemeToggle: React.FC<{
  className?: string;
  iconClassName?: string;
  withText?: boolean;
}> = ({ className, iconClassName, withText = false }) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  const text = useMemo(
    () => (theme === "light" ? "Dark Mode" : "Light Mode"),
    [theme],
  );
  return (
    <LightButton
      text={withText ? text : ""}
      onPress={toggleTheme}
      icon={
        theme === "light" ? (
          <MoonIcon className={cn("size-4", iconClassName)} />
        ) : (
          <SunIcon className={cn("size-4", iconClassName)} />
        )
      }
      className={cn(
        "flex min-h-8 items-center",
        "[&>p]:text-klerosUIComponentsPrimaryText [&>p]:font-normal",
        { "[&>p]:ml-2": withText },
        className,
      )}
    />
  );
};

export default ThemeToggle;
