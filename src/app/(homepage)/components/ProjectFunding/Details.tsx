import React from "react";

import Link from "next/link";

import { IDetails } from "@/consts/markets";

const Details: React.FC<IDetails> = ({ imdbURL, posterURL, summary }) => (
  <div className="flex flex-wrap items-start gap-4">
    <img src={posterURL} alt="movie poster" className="rounded-base" />
    <div>
      <Link
        className="text-klerosUIComponentsPrimaryBlue font-bold"
        href={imdbURL}
        rel="noopener noreferrer"
        target="_blank"
      >
        IMDB
      </Link>
      <p className="text-shadow-klerosUIComponentsSecondaryText max-w-160 italic">
        {summary}
      </p>
    </div>
  </div>
);

export default Details;
