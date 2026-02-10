import React, { useState } from "react";

import { CompactPagination, Modal } from "@kleros/ui-components-library";
import clsx from "clsx";

import BookIcon from "@/assets/svg/book-open.svg";

import LightButton from "../LightButton";

export interface IGuide {
  isVisible: boolean;
  closeGuide: () => void;
}

interface IGuideStructure extends IGuide {
  content: Array<{
    title: React.ReactNode;
    subtitle: React.ReactNode;
    svg: React.ReactNode;
  }>;
}
const GuideStructure: React.FC<IGuideStructure> = ({
  content,
  isVisible,
  closeGuide,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const numPages = content.length;

  const { title, subtitle, svg } = content[currentPage - 1];
  return (
    <Modal
      isOpen={isVisible}
      className="h-fit w-full max-w-[calc(100vw-32px)] sm:w-294.5"
    >
      {/* top content */}
      <div
        className={clsx(
          "bg-klerosUIComponentsLightBlue rounded-base min-h-80 w-full sm:min-h-129.5",
          "flex flex-col p-4 sm:p-8",
        )}
      >
        <div className="flex w-full justify-between">
          <div className="flex items-center gap-2">
            <BookIcon />
            <label className="text-klerosUIComponentsSecondaryPurple text-right text-sm">
              Quick Guide
            </label>
          </div>
          <LightButton
            text="Close"
            className={clsx(
              "p-0",
              "[&_.button-text]:text-klerosUIComponentsPrimaryBlue [&_.button-text]:text-sm [&_.button-text]:font-normal",
            )}
            onPress={closeGuide}
          />
        </div>
        <div className="flex w-full flex-1 items-center justify-center overflow-hidden pt-4 sm:pt-8">
          {svg}
        </div>
      </div>

      {/* bottom content */}
      <div
        className={clsx(
          "h-fit w-full",
          "flex flex-col gap-6 p-4 sm:gap-8 sm:p-8",
        )}
      >
        <div className="flex flex-col gap-4">
          <h1 className="text-klerosUIComponentsPrimaryText text-base font-semibold">
            {title}
          </h1>
          <div>{subtitle}</div>
        </div>

        {/* Dont show pagination if only one slide */}
        {numPages > 1 ? (
          <div className="flex items-center gap-4">
            <label className="text-klerosUIComponentsSecondaryText text-sm font-semibold">
              {currentPage}/{numPages}
            </label>
            <CompactPagination
              currentPage={currentPage}
              numPages={numPages}
              callback={(page) => {
                setCurrentPage(page);
              }}
              onCloseOnLastPage={() => {
                closeGuide();
                setCurrentPage(1);
              }}
            />
          </div>
        ) : null}
      </div>
    </Modal>
  );
};

export default GuideStructure;
