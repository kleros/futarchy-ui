"use client";

import { useToggle } from "react-use";

import LazyFirstVisitGuide from "@/components/Guides/LazyFirstVisitGuide";

import BookIcon from "@/assets/svg/book-open.svg";

import { cn } from "@/utils";

import LightButton from "./LightButton";

type QuickGuideButtonProps = {
  className?: string;
};

const QuickGuideButton: React.FC<QuickGuideButtonProps> = ({ className }) => {
  const [isOpen, toggleGuide] = useToggle(false);
  return (
    <>
      <LightButton
        text={"Guide"}
        Icon={BookIcon}
        className={cn(
          "[&_.button-text]:text-klerosUIComponentsSecondaryPurple!",
          "[&_.button-text]:text-sm [&_.button-text]:font-thin!",
          "[&>svg]:mr-1",
          "[&>svg_path]:fill-klerosUIComponentsSecondaryPurple",
          "hover:[&>svg_path]:fill-klerosUIComponentsSecondaryPurple",
          className,
        )}
        small
        onPress={toggleGuide}
      />

      {isOpen ? (
        <LazyFirstVisitGuide
          isVisible={isOpen}
          closeGuide={() => {
            toggleGuide(false);
          }}
        />
      ) : null}
    </>
  );
};
export default QuickGuideButton;
