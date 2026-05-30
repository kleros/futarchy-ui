import React from "react";

export const Title: React.FC = () => {
  return <>Process and Timeline - 1 Month Trading</>;
};

export const SubTitle: React.FC = () => {
  return (
    <p className="text-klerosUIComponentsSecondaryText text-sm text-wrap whitespace-pre-line">
      Nine properties have been selected for this experiment. Only one of them
      will be evaluated by a professional expert. The trading period will last
      approximately one month.
      <br /> At the end of this period, the market closes and the Final Price of
      the single professionally evaluated property is publicly revealed.
    </p>
  );
};
