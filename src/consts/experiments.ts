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
  /** Parent market address of the current deployment, lowercase. */
  parentMarket: string;
}

export const experiments: IExperiment[] = [
  {
    slug: "movies-s3",
    name: "Movies Experiment - Session 3",
    question:
      "If watched, what percentile score would Clément give to the movie?",
    url: "https://movies-r3.foresight.kleros.io",
    icon: "movie",
    banner: "/experiment-banners/movies-r3-banner.webp",
    countLabel: "20 Movies",
    tradingPeriod: "Until September 3rd 00:00 UTC",
    endTime: 1788393600,
    status: "live",
    parentMarket: "0xacc15cfa0f4ae4932b12ab14595941285098436a",
  },
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
    status: "ended",
    parentMarket: "0x6b182ffe23a9df5f5bfb2e9b6b4ce5716e84ab1f",
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
    parentMarket: "0x6f7ae2815e7e13c14a6560f4b382ae78e7b1493e",
  },
];
