import React from "react";

export const Title: React.FC = () => {
  return <>Profit or Loss - Your Prediction on the Evaluated Movie</>;
};

export const SubTitle: React.FC = () => {
  return (
    <p className="text-klerosUIComponentsSecondaryText text-sm text-wrap whitespace-pre-line">
      ✅ You earn a profit if your prediction helps move the market price closer
      to the final expert evaluation price.
      <br /> ❌ You incur a loss if your prediction moves the market price
      further away from the final expert evaluation price.
    </p>
  );
};
