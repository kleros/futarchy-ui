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
}

export const experiments: IExperiment[] = [
  {
    slug: "movies",
    name: "Movies Experiment",
    question:
      "If watched, what percentile score would Clément give to the movie?",
    url: "https://movies.foresight.kleros.io",
    icon: "movie",
    banner: "movies-banner",
    countLabel: "16 Movies",
    tradingPeriod: "Until Friday 3rd 18:00 UTC",
    endTime: 1775239200,
  },
  {
    slug: "realt",
    name: "RealT Properties Prediction",
    question: "If evaluated, what is the current price of the property?",
    url: "https://realt.foresight.kleros.io",
    icon: "realt",
    banner: "properties-banner",
    countLabel: "9 Properties",
    tradingPeriod: "Until Wednesday 17th 00:00 UTC",
    endTime: 1781721000,
  },
  {
    slug: "movies-s2",
    name: "Movies Experiment - Session 2",
    question:
      "If watched, what percentile score would Clément give to the movie?",
    url: "https://movies.foresight.kleros.io",
    icon: "movie",
    banner: "movies-banner",
    countLabel: "20 Movies",
    tradingPeriod: "Until Friday 3rd 18:00 UTC",
    endTime: 1775239200,
  },
];
