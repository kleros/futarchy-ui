import React from "react";

import Link from "next/link";

import { IDetails } from "@/consts/markets";

const Details: React.FC<IDetails> = ({ imdbURL, posterURL, summary }) => (
  <div className="flex gap-4">
    <img src={posterURL} alt="movie poster" />
    <div>
      <Link
        className="text-klerosUIComponentsPrimaryBlue font-bold"
        href={imdbURL}
        rel="noopener noreferrer"
        target="_blank"
      >
        IMDB
      </Link>
      <p className="text-shadow-klerosUIComponentsSecondaryText italic">
        {summary}
      </p>
    </div>
  </div>
);

export default Details;
