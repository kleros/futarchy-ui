import React from "react";

import Link from "next/link";

const OpenOrders: React.FC = () => {
  return (
    <Link
      className="text-klerosUIComponentsPrimaryBlue font-bold"
      href="https://swap.cow.fi/#/100/limit/?tab=open&page=1"
      rel="noopener noreferrer"
      target="_blank"
    >
      Open Orders
    </Link>
  );
};

export default OpenOrders;
