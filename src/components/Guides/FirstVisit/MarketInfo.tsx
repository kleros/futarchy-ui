import React from "react";

export const Title: React.FC = () => {
  return <>Open the Market to Predict with the Slider</>;
};

export const SubTitle: React.FC = () => {
  return (
    <p className="text-klerosUIComponentsSecondaryText text-sm text-wrap whitespace-pre-line">
      View up-to-date market estimates, open the market and use the slider to
      set your predictions. Then, click on the &apos;Predict Selected&apos;
      button below to confirm your choice.
    </p>
  );
};
