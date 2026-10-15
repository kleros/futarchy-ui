import React from "react";

export const Title: React.FC = () => {
  return <>Process and Timeline</>;
};

export const SubTitle: React.FC = () => {
  return (
    <p className="text-klerosUIComponentsSecondaryText text-sm text-wrap whitespace-pre-line">
      Seven candidate side events have been proposed for DevCon. Only one of
      them will be held. At the end of the trading, the market closes, and once
      the chosen event takes place, the attendees&apos; mean post-event rating
      is publicly revealed.
    </p>
  );
};
