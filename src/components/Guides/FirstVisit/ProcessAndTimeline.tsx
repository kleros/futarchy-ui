import React from "react";

export const Title: React.FC = () => {
  return <>Process and Timeline - 1 Month Trading</>;
};

export const SubTitle: React.FC = () => {
  return (
    <p className="text-klerosUIComponentsSecondaryText text-sm text-wrap whitespace-pre-line">
      Sixteen movies have been selected for this experiment. Only five of them
      will be evaluated by Clément. The trading period will last approximately
      one month. At the end of this period, the market closes and the Final
      Ratings for the 5 movies chosen are publicly revealed.
    </p>
  );
};
