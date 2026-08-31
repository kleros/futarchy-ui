import React from "react";

import Link from "next/link";

import { IDetails } from "@/consts/markets";

const Details: React.FC<IDetails> = ({
  imdbURL,
  posterURL,
  pax,
  locations,
  summary,
}) => (
  <div className="flex flex-wrap items-start gap-4">
    {posterURL ? (
      <img
        src={posterURL}
        alt="event poster"
        loading="lazy"
        decoding="async"
        className="rounded-base max-w-62.5"
      />
    ) : null}
    <div className="flex max-w-160 flex-col gap-2">
      {imdbURL ? (
        <Link
          className="text-klerosUIComponentsPrimaryBlue font-bold"
          href={imdbURL}
          rel="noopener noreferrer"
          target="_blank"
        >
          IMDB
        </Link>
      ) : null}
      {pax ? (
        <p className="text-shadow-klerosUIComponentsSecondaryText">
          Pax: {pax}
        </p>
      ) : null}
      {locations?.length ? (
        <p className="text-shadow-klerosUIComponentsSecondaryText">
          Location:{" "}
          {locations.map((location, i) => (
            <React.Fragment key={location.name}>
              {i > 0 ? ", " : null}
              {location.url ? (
                <Link
                  className="text-klerosUIComponentsPrimaryBlue"
                  href={location.url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {location.name}
                </Link>
              ) : (
                location.name
              )}
            </React.Fragment>
          ))}
        </p>
      ) : null}
      <p className="text-shadow-klerosUIComponentsSecondaryText whitespace-pre-line">
        {summary}
      </p>
    </div>
  </div>
);

export default Details;
