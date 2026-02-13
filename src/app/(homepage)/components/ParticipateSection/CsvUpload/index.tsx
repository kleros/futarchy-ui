import React, { useCallback, useState } from "react";

import { Button, FileUploader, Modal } from "@kleros/ui-components-library";
import clsx from "clsx";
import { useToggle } from "react-use";

import { useMarketsStore } from "@/store/markets";

import { isUndefined } from "@/utils";
import { parseMarketCSV } from "@/utils/csv";

import CsvDownload from "./CsvDownload";

interface ICsvUploadPopup {
  isOpen: boolean;
  toggleIsOpen: () => void;
}

const CsvUploadPopup: React.FC<ICsvUploadPopup> = ({
  isOpen,
  toggleIsOpen,
}) => {
  const [file, setFile] = useState<File>();
  const [parseError, setParseError] = useState<string>();
  const setPrediction = useMarketsStore.getState().setPrediction;

  const handleLoad = useCallback(async () => {
    try {
      if (isUndefined(file)) return;

      const csvText = await file.text();
      const records = parseMarketCSV(csvText);

      Object.entries(records).forEach(([marketId, score]) => {
        setPrediction(marketId, score);
      });

      toggleIsOpen();
    } catch (err) {
      if (err instanceof Error) setParseError(err.message);
    }
  }, [file, setPrediction, toggleIsOpen]);

  return (
    <Modal
      className="relative h-fit w-full overflow-x-hidden p-8 md:w-162.5"
      onOpenChange={toggleIsOpen}
      {...{ isOpen }}
    >
      <div className="flex size-full flex-col justify-center gap-6">
        <h2 className="w-full. text-klerosUIComponentsPrimaryText text-center text-2xl font-semibold">
          Upload CSV Predictions
        </h2>
        <div
          className={clsx(
            "bg-klerosUIComponentsMediumBlue rounded-base w-full px-4 pt-3 pb-4.5",
            "flex flex-col gap-2",
          )}
        >
          <h3 className="text-klerosUIComponentsPrimaryText text-sm">
            Required CSV File
          </h3>
          <div
            className={clsx(
              "border-klerosUIComponentsPrimaryText rounded-base bg-klerosUIComponentsLightBlue border p-4 pb-5",
              "flex w-full flex-1 flex-col",
            )}
          >
            <span className="text-klerosUIComponentsSecondaryText text-sm">
              marketName,score
            </span>
            <span className="text-klerosUIComponentsPrimaryText text-sm">
              23750 W 7 Mile,4.45
            </span>
            <span className="text-klerosUIComponentsPrimaryText text-sm">
              18881 Mound,5.52
            </span>
            <span className="text-klerosUIComponentsSecondaryText text-sm">
              ...
            </span>
          </div>
          <span className="text-klerosUIComponentsPrimaryText text-sm">
            Each row represents a prediction for a property&apos;s price in the
            Gnosis ecosystem.
          </span>
        </div>
        <CsvDownload />
        <FileUploader
          className="w-full [&_small]:top-0 [&_small]:text-sm"
          callback={(file) => {
            setParseError(undefined);
            setFile(file);
          }}
          acceptedFileTypes={[".csv"]}
          selectedFile={file}
          msg={parseError ?? "Required CSV File"}
          variant={parseError ? "error" : "info"}
        />
        <div className="mt-7.5 flex w-full flex-row justify-center gap-3.5 max-md:flex-col-reverse">
          <Button text="Close" variant="secondary" onPress={toggleIsOpen} />
          <Button text="Load Predictions" onPress={handleLoad} />
        </div>
      </div>
    </Modal>
  );
};

const CsvUpload: React.FC = () => {
  const [isOpen, toggleIsOpen] = useToggle(false);
  return (
    <div className="flex w-full justify-end">
      <Button
        text="Upload CSV Predictions"
        variant="secondary"
        onPress={toggleIsOpen}
      />
      {isOpen ? <CsvUploadPopup {...{ isOpen, toggleIsOpen }} /> : null}
    </div>
  );
};
export default CsvUpload;
