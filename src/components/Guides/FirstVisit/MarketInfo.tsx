import React from "react";

export const Title: React.FC = () => {
  return <>Predict and Trade Property Markets</>;
};

export const SubTitle: React.FC = () => {
  return (
    <p className="text-klerosUIComponentsSecondaryText text-sm text-wrap whitespace-pre-line">
      Use the available data for each property — click Details to view more
      information — and try to predict the final price that the professional
      evaluator will assign. When you&apos;re ready, select the property you
      want to predict and click the Predict Selected button below to confirm
      your choice.
    </p>
  );
};
