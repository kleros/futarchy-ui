import React from "react";

export const Title: React.FC = () => {
  return (
    <>
      Profit or Loss if you have predicted the Property evaluated by the Expert
    </>
  );
};

export const SubTitle: React.FC = () => {
  return (
    <ul className="list-disc pl-4">
      <li className="text-klerosUIComponentsSecondaryText text-sm text-wrap whitespace-pre-line">
        You make a profit if your prediction moves the market closer to the
        Final Evaluation Price.
      </li>
      <li className="text-klerosUIComponentsSecondaryText text-sm text-wrap whitespace-pre-line">
        You incur a loss if your prediction moves the market further away from
        the Final Evaluation Price.
      </li>
    </ul>
  );
};
