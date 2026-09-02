import { Address } from "viem";

export const positionExplainerLink =
  "https://kleros.notion.site/Kleros-Foresight-Advanced-Guide-What-Actually-Happens-After-Your-First-Prediction-30d9a9db4f0880f8a44ecb13d34ad3c6#30d9a9db4f0881969c23e8152ab1146d";

export const appGuideLink =
  "https://kleros.notion.site/Kleros-Foresight-Movie-Experiment-Round-2-3729a9db4f0880038348d53411e419e8";

export const faqLink =
  "https://kleros.notion.site/Kleros-Foresight-Movie-Experiment-Round-2-3729a9db4f0880038348d53411e419e8#3729a9db4f08800395c3e8ab82f74c01";

export const beginnerUserGuide =
  "https://kleros.notion.site/Kleros-Foresight-Movie-Experiment-Round-2-3729a9db4f0880038348d53411e419e8";

export const advancedUserGuide =
  "https://kleros.notion.site/Kleros-Foresight-Advanced-Guide-What-Actually-Happens-After-Your-First-Prediction-30d9a9db4f0880f8a44ecb13d34ad3c6";

export const tgLink = "https://t.me/+HrYn_tzqTGFlYTc0";

export const seerMarketLink =
  "https://app.seer.pm/markets/100/0xf094a219f85fc9880362fe096bd489bccb9b5359";

// number of side events that will be held from the 7 candidates
export const projectsChosen = 1;

export const parentMarket: Address =
  "0xf094a219f85fc9880362fe096bd489bccb9b5359";

export const parentConditionId =
  "0xe7e8dffc1525910ce4c98ac9986c8349f228f0354ef744463d6736ca831d69f0";

export const invalidMarket: Address =
  "0x639cfbc882ba81f1c6f59c3afadb40dc9bf7a786";

// in unix timestamp, seconds
export const startTime: number = 1788195120;
export const endTime: number = 1789300800;
export const endDate: string = "Sunday, 13 September 2026 12:00 UTC";

export interface ILocation {
  name: string;
  url?: string;
}

export interface IDetails {
  imdbURL?: string;
  posterURL?: string;
  pax?: string;
  locations?: ILocation[];
  summary: string;
}

export interface IMarket {
  name: string;
  color: string;
  upToken: Address;
  downToken: Address;
  underlyingToken: Address;
  invalidToken: Address;
  minValue: number;
  maxValue: number;
  precision: number;
  marketId: Address;
  parentMarketOutcome: number;
  details: IDetails;
  conditionId: `0x${string}`;
}

export const marketMetadata = {
  name: "DevCon Side Event - Satisfaction",
  question:
    "If held, what will the attendees’ mean post-event rating be on a 0-10 scale?",
};

const MARKET_COLORS = [
  "#a351f1",
  "#937a0c",
  "#0c8996",
  "#ea1395",
  "#358e0b",
  "#686bf3",
  "#dd4812",
] as const;

export const markets: Array<IMarket> = [
  {
    name: "Arcade / Bowling Night",
    color: MARKET_COLORS[0],
    upToken: "0x0b9aab1393f780cf16d7f227b1803129741d69e4",
    downToken: "0x7eb9bf5a00d63488e570ba587eb2e2b3629721c6",
    underlyingToken: "0x5b0d7ba8b37d6bea4849d099b68d6e8cbef99ef2",
    invalidToken: "0xe0f3346373a37377e2f1063e28bbd9d2ffee31a5",
    minValue: 0,
    maxValue: 10,
    precision: 10,
    marketId: "0x3bd0de16f4e1481c8a96944a4634c2d8e105e188",
    parentMarketOutcome: 0,
    conditionId:
      "0x0ba1ed5b305bdd214c8eb473ed497517aecee52b76e9d94d68beeac3eab42c10",
    details: {
      posterURL: "https://i.imgur.com/ZVAIXyf.jpeg",
      pax: "50-100",
      locations: [
        {
          name: "The Game Palacio",
          url: "https://share.google/0G0CEUJtsHe2faQXf",
        },
      ],
      summary:
        "A relaxed night of arcade games, bowling, food, drinks, and good company. We’ll kick things off with a quick introduction to the organisers, then leave the rest of the evening open for people to play, compete, and hang out. Expect a casual, drop-in-and-out kind of night with plenty of opportunities to meet other people from the ecosystem.",
    },
  },
  {
    name: "Marble Race Game",
    color: MARKET_COLORS[1],
    upToken: "0xa30a60734f31741ff5c93c782f5c693e4643c517",
    downToken: "0x8e47a826c9130ccacd212430289afdd5658451a2",
    underlyingToken: "0x6edc7288c3fb0a2b241dd12c2c94a0878853a95a",
    invalidToken: "0x865a0dae78f91d12bdf8e572d2c45760a7a1a444",
    minValue: 0,
    maxValue: 10,
    precision: 10,
    marketId: "0x8aae56a00c311e3a16095a26b3fdc1ad1969ae55",
    parentMarketOutcome: 1,
    conditionId:
      "0x680e76a4483f0e0eeeab924f2c791decbe4916da378d7a533d76864caa1defe8",
    details: {
      posterURL: "https://i.imgur.com/nAlYoB3.jpeg",
      pax: "50+",
      locations: [
        {
          name: "Coworking/Event spaces around Mumbai",
          url: "https://myhq.in/mumbai/event-space/mumbai",
        },
      ],
      summary:
        "A giant custom marble race where the crowd gets to decide what happens on the track. Each round, participants use event tokens to vote on interventions that could help the Kleros marble win — from removing obstacles to adding speed boosts or switching lanes. The winning intervention gets put to the test, with multiple races showing how collective predictions can play out in practice.",
    },
  },
  {
    name: "Murder Mystery Game",
    color: MARKET_COLORS[2],
    upToken: "0x034a80decd3913a13ec8b850c198ae292e6bab9c",
    downToken: "0x519ea47b2bc2ce735a12afd44ef81f6a26f72427",
    underlyingToken: "0xea29108dc06fd73a7ac9e6f2d64e155db3cbcf19",
    invalidToken: "0x29f9a461abb26d2d0885f307730f431f945edf30",
    minValue: 0,
    maxValue: 10,
    precision: 10,
    marketId: "0x5db467d53408df07d57511f3a816b145b584009e",
    parentMarketOutcome: 2,
    conditionId:
      "0x44c2acda4e4e98c85f8ee6c1a86516a1826d0b0b33c1b578f6d991b54c57fe15",
    details: {
      posterURL: "https://i.imgur.com/AQl4yaO.jpeg",
      pax: "30-50",
      locations: [
        {
          name: "Mystery Rooms",
          url: "https://www.google.com/search?q=escape+room+mumbai",
        },
        {
          name: "Rare Escape",
          url: "https://rareescape.in/lower-parel/",
        },
        {
          name: "No Escape",
          url: "https://share.google/3Hyn6xaupZn26Ln2Y",
        },
      ],
      summary:
        "A murder mystery where you’re not just solving the crime — you’re trading on it. Guests investigate clues, question suspects, piece together the timeline, and trade predictions about who did it and why. At the end, the case goes to a Kleros-style tribunal, where players become jurors and stake their event credits on the verdict. Come prepared to investigate, argue your case, and maybe accuse your friends.",
    },
  },
  {
    name: "Networking Dinner",
    color: MARKET_COLORS[3],
    upToken: "0x2c8960aa61ed7c5e78f3ac4ccd86744ee2c71eac",
    downToken: "0x75f2056b4ff8d7e2c187225a0a8d02174025ed8e",
    underlyingToken: "0xfb5f7783c28bf002663517336fd07efbdfdd5ee2",
    invalidToken: "0x6e6b015662a7576d3b165e67f07dca5c43cfb6a9",
    minValue: 0,
    maxValue: 10,
    precision: 10,
    marketId: "0x2fdd6b081d9faec9b9a6fc23353c98d7d15ffbd3",
    parentMarketOutcome: 3,
    conditionId:
      "0x8e29cc1776cd66bfeb26d7498ff35ddffc48d1fa19320183e60d04f387adf93d",
    details: {
      posterURL: "https://i.imgur.com/BlqTPZ9.jpeg",
      pax: "15+",
      locations: [
        {
          name: "Khar Social",
          url: "https://share.google/27z8eQZCNCK6pW5nO",
        },
        {
          name: "The Little Easy",
          url: "https://share.google/SjIcf7ALTM6QihzWZ",
        },
        {
          name: "Khane Khas",
          url: "https://share.google/XkSrvycY70AmTgiQx",
        },
        {
          name: "Lucky Restaurant",
          url: "https://share.google/OLgzHjigAvp3UtiEd",
        },
        {
          name: "Bastian Beach Club",
          url: "https://share.google/C0FdIBK1gC18Qh9tE",
        },
        {
          name: "Cecconi's Mumbai",
          url: "https://share.google/DaabG6LtxYOAiYUr2",
        },
        {
          name: "antiSOCIAL Lower Parel",
          url: "https://share.google/VyquiC31sCAKm8gTl",
        },
      ],
      summary:
        "A smaller, curated dinner bringing together people working across prediction markets, Web3, and the wider ecosystem. This is an evening built around good food and deeper conversations with a carefully selected group of people. A chance to meet interesting people, exchange ideas, and actually have time to talk.",
    },
  },
  {
    name: "Tuk-Tuk Street Food & Cocktail Night",
    color: MARKET_COLORS[4],
    upToken: "0x64f179aa0e809080039930fc5827c432a31f6815",
    downToken: "0xe5acb528d4be38c9de75896d32e68be91c967e89",
    underlyingToken: "0x6df1bd62d58d1e5f271029e9d835d62d9f07042b",
    invalidToken: "0xe02ae235a8b675cdd3ec798c351e73435df2a874",
    minValue: 0,
    maxValue: 10,
    precision: 10,
    marketId: "0x0e78cc36d6c99250639d21e26c039ba5e7590ffb",
    parentMarketOutcome: 4,
    conditionId:
      "0xeb783c2a0364d5f256039095f6e539c905a0e6222f4f64b35194a09123740e41",
    details: {
      posterURL: "https://i.imgur.com/yMUOueX.jpeg",
      pax: "50-70",
      locations: [
        {
          name: "Corona Garden Bandra",
          url: "https://share.google/Uyrt66sTU8kpsRoAu",
        },
      ],
      summary:
        "A Mumbai-inspired evening built around tuk tuks, street food, cocktails, chai, music, and casual conversations. Wander between a cocktail-serving tuk tuk, a cutting chai and street food station, and a DJ setup tucked into the back of another vehicle. Less conference, more night out — with a distinctly Mumbai twist.",
    },
  },
  {
    name: "Go-Karting",
    color: MARKET_COLORS[5],
    upToken: "0xe524c15d17d6f33f876ad7cf68f845df610584a5",
    downToken: "0x5f525a5a1adebf5a53e08116429ca0e283562fe3",
    underlyingToken: "0x2f9a847983c8f2f6cbe373c648a84563cd6e8f39",
    invalidToken: "0xc5e98750abec4150c98047ab5f088bde84127ab4",
    minValue: 0,
    maxValue: 10,
    precision: 10,
    marketId: "0x91052d4a4107304b34b5e174536f4dd1c269fd7f",
    parentMarketOutcome: 5,
    conditionId:
      "0x4c368748201b0a837f2725d5de95a4168616a10a1dbdc8371341ca444f597f3e",
    details: {
      posterURL: "https://i.imgur.com/WCXEshP.jpeg",
      pax: "50+",
      locations: [
        {
          name: "Ajmera IndiKarting",
          url: "https://share.google/l9eWkZ8pIuNJq2NIG",
        },
      ],
      summary:
        "A few hours of racing, friendly competition, and hanging out off the conference floor. We’ll start with a quick introduction to the organisers, then get straight onto the track for multiple rounds of go-karting. There may even be a few prediction markets around the races and leaderboard, because naturally, someone should be betting on who’s going to win.",
    },
  },
  {
    name: "The Last Mile of a Prediction Market",
    color: MARKET_COLORS[6],
    upToken: "0x4324ec13fabd8f193abd434ddbd76a96e76a1e11",
    downToken: "0x5dba2ba26acf6fd3958977d58eec7948d3d8df07",
    underlyingToken: "0x863cc1860f2c491c7345074a5d5d6f7135d4e9d4",
    invalidToken: "0x3dd9d8af5a1d04721822edc11cd0f3878d3a6818",
    minValue: 0,
    maxValue: 10,
    precision: 10,
    marketId: "0xa9d3ee5a91ef5a63b7c640cbc858f218c409a610",
    parentMarketOutcome: 6,
    conditionId:
      "0xe2629aaf1c267c9979d5d00686a54846d29de407f5c6c1ae9f8f76fd9b896cb9",
    details: {
      posterURL: "https://i.imgur.com/T1WqIb8.jpeg",
      locations: [
        {
          name: "IFBE (cultural centre)",
          url: "https://share.google/c26RTskWo7gsaeltl",
        },
        {
          name: "DevX",
          url: "https://share.google/dYH57MmqYr54sTprD",
        },
        {
          name: "WeWork (cowork space)",
          url: "https://share.google/YQAlcTOQJpi0AorZl",
        },
      ],
      summary:
        "A half-day gathering focused on what happens when prediction markets move from an interesting idea to something people actually rely on. We’ll bring together people building and working around prediction markets to discuss liquidity, oracle resolution, manipulation, institutional adoption, dispute resolution, and the challenges of using markets for real-world decisions. Expect a mix of focused conversations and plenty of time to meet others working in the space.",
    },
  },
];
