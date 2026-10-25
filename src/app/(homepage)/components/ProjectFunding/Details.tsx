import React from "react";

import Link from "next/link";

import { IDetails } from "@/consts/markets";

const Details: React.FC<IDetails> = ({
  imdbURL,
  posterURLs,
  pax,
  locations,
  summary,
  rationale,
}) => (
  <div className="flex flex-wrap items-start gap-4">
    {posterURLs?.length ? (
      <div className="flex flex-wrap items-start gap-4">
        {posterURLs.map((posterURL) => (
          <img
            key={posterURL}
            src={posterURL}
            alt="event poster"
            loading="lazy"
            decoding="async"
            className="rounded-base max-w-100 max-md:max-w-full"
          />
        ))}
      </div>
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
      {rationale ? (
        <>
          <h4 className="text-klerosUIComponentsPrimaryText font-semibold">
            Rationale
          </h4>
          <p className="text-shadow-klerosUIComponentsSecondaryText whitespace-pre-line">
            {rationale}
          </p>
        </>
      ) : null}
    </div>
  </div>
);

export default Details;
