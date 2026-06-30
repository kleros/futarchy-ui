export type ExperimentStatus = "live" | "ended" | "coming soon";

export interface IExperiment {
  slug: string;
  name: string;
  question: string;
  url: string;
  icon: string;
  banner: string;
  countLabel: string;
  tradingPeriod: string;
  endTime: number;
  status: ExperimentStatus;
}

export const experiments: IExperiment[] = [
  {
    slug: "movies-s2",
    name: "Movies Experiment - Session 2",
    question:
      "If watched, what percentile score would Clément give to the movie?",
    url: "https://movies-r2.foresight.kleros.io",
    icon: "movie",
    banner: "/experiment-banners/movies-r2-banner.webp",
    countLabel: "20 Movies",
    tradingPeriod: "Until July 5th 00:00 UTC",
    endTime: 1783209600,
    status: "live",
  },
  {
    slug: "movies",
    name: "Movies Experiment",
    question:
      "If watched, what percentile score would Clément give to the movie?",
    url: "https://movies.foresight.kleros.io",
    icon: "movie",
    banner: "/experiment-banners/movies-banner.webp",
    countLabel: "16 Movies",
    tradingPeriod: "Until Friday 3rd 18:00 UTC",
    endTime: 1775239200,
    status: "ended",
  },
];
