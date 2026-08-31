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
    slug: "devcon-attendance",
    name: "DevCon Side Event - Attendance",
    question: "If held, how many unique non-staff attendees will enter?",
    url: "https://devcon-attendance.foresight.kleros.io",
    icon: "devcon",
    banner: "/experiment-banners/devcon-attendance-banner.jpg",
    countLabel: "7 Events",
    tradingPeriod: "Until September 13th 12:00 UTC",
    endTime: 1789300800,
    status: "live",
    parentMarket: "0xd1d81ec6c50cac45c9930f31f837b62eedfaefc4",
  },
  {
    slug: "movies-s3",
    name: "Movies Experiment - Session 3",
    question:
      "If watched, what percentile score would Clément give to the movie?",
    url: "https://movies-r3.foresight.kleros.io",
    icon: "movie",
    banner: "/experiment-banners/movies-r3-banner.webp",
    countLabel: "20 Movies",
    tradingPeriod: "Until September 30th 23:59 UTC",
    endTime: 1790812740,
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
