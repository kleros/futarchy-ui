import React from "react";

export const Title: React.FC = () => {
  return <>Predict and Trade Event Markets</>;
};

export const SubTitle: React.FC = () => {
  return (
    <p className="text-klerosUIComponentsSecondaryText text-sm text-wrap whitespace-pre-line">
      Use the available data for each event — click Details to view more
      information — and try to predict how many unique non-staff attendees will
      enter if it is held. When you&apos;re ready, select the event you want to
      predict and click the Predict Selected button below to confirm your
      choice.
    </p>
  );
};
