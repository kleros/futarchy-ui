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
  "https://app.seer.pm/markets/100/0xd1d81ec6c50cac45c9930f31f837b62eedfaefc4";

// number of side events that will be held from the 7 candidates
export const projectsChosen = 1;

export const parentMarket: Address =
  "0xd1d81ec6c50cac45c9930f31f837b62eedfaefc4";

export const parentConditionId =
  "0xe7e8dffc1525910ce4c98ac9986c8349f228f0354ef744463d6736ca831d69f0";

export const invalidMarket: Address =
  "0x639cfbc882ba81f1c6f59c3afadb40dc9bf7a786";

// in unix timestamp, seconds
export const startTime: number = 1787926020;
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
  name: "DevCon Side Event - Attendance",
  question: "If held, how many unique non-staff attendees will enter?",
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
    upToken: "0x3d4ab59f162d139803bf1e6d9dd25825a2c3265a",
    downToken: "0xe3e41888dcc0a5718ff5b29172dc3cdcd16f6748",
    underlyingToken: "0x5b0d7ba8b37d6bea4849d099b68d6e8cbef99ef2",
    invalidToken: "0x649661d0e42d198ea70b71ed5c54eba4e3d1b29e",
    minValue: 0,
    maxValue: 150,
    precision: 1,
    marketId: "0x97fd5612ec07a6966f9fcaaaab2d5adc1c7bc1c4",
    parentMarketOutcome: 0,
    conditionId:
      "0xef6da409eb33b4dee7fffbf33d209b3f1e446092842ff8369a99d4f7fc4ef446",
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
    upToken: "0xa09b3fc8649f632b0c4d0874adbe8460a8c47c48",
    downToken: "0x8e3a2bc2c17588d2d5d2dd7f46cda7aceb6d7526",
    underlyingToken: "0x6edc7288c3fb0a2b241dd12c2c94a0878853a95a",
    invalidToken: "0x287658070ef29b224b682e9cc86e4152a1545aae",
    minValue: 0,
    maxValue: 150,
    precision: 1,
    marketId: "0xe079c1a97ab6d9e833774daf0921074b36163682",
    parentMarketOutcome: 1,
    conditionId:
      "0x4c08bf90c211410356ba0d3d1808516c35ca93d77a9697ce7329f9432e503397",
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
    upToken: "0x53c3b2a50af90995683aefd2b713b08b6b2c0508",
    downToken: "0xf988bcc13ea72f85dd0628af8ae936e2452b89e5",
    underlyingToken: "0xea29108dc06fd73a7ac9e6f2d64e155db3cbcf19",
    invalidToken: "0x98a5f7b210f3afa613a3010d6a2577f39d6f367e",
    minValue: 0,
    maxValue: 150,
    precision: 1,
    marketId: "0x97e5c16b405ed8e098c6351ff8a7f5bb114baedc",
    parentMarketOutcome: 2,
    conditionId:
      "0x791ca6a64324c8c2679f96401627792465217caacde2627685cf0bf844f51ffe",
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
    upToken: "0x19c72eb2faff296caf26bb1ab0b79d2a401a5280",
    downToken: "0x21a6b5052e11ec90e00469e4f5ec7933243a9df1",
    underlyingToken: "0xfb5f7783c28bf002663517336fd07efbdfdd5ee2",
    invalidToken: "0xc6d7dc9006c2fe2092921ea73aa52069a7ccbcf7",
    minValue: 0,
    maxValue: 150,
    precision: 1,
    marketId: "0xa137ef6eeb1ded3b21c480717979141d90ca50dd",
    parentMarketOutcome: 3,
    conditionId:
      "0x368741e158cbd05abd51b52193d043a068604c88fe79268529ea1386f2abc0f1",
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
    upToken: "0x4fcbe896dd47953b41c077584ca626bee6b6ff49",
    downToken: "0x41fc31aab0a88dec1be07d6bbf23c9ba8affaecc",
    underlyingToken: "0x6df1bd62d58d1e5f271029e9d835d62d9f07042b",
    invalidToken: "0x09d28df0d9562341a50d6cf458e75a010af0ba2f",
    minValue: 0,
    maxValue: 150,
    precision: 1,
    marketId: "0xe5e67744d858fdd568bfb1fcdf335bf31a727b1c",
    parentMarketOutcome: 4,
    conditionId:
      "0xcdbbe68264cf4e930c1192ba586a498eab93ad0ade256105adad0d8bbe9b8635",
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
    upToken: "0xbd74c71e3f6db2bd8d646a06dbbacc46a27c6558",
    downToken: "0xe7b7ea18b14316321dde5d313b7d0b3d42ce94df",
    underlyingToken: "0x2f9a847983c8f2f6cbe373c648a84563cd6e8f39",
    invalidToken: "0xb4ebf5a72ac52ac861831e3a7d4ff746deb7a0a6",
    minValue: 0,
    maxValue: 150,
    precision: 1,
    marketId: "0xac84fa4f3a3e37befb334db0b58a696e8da8d0a4",
    parentMarketOutcome: 5,
    conditionId:
      "0x1a5fb60f7704e03712ce8b363226c1b9fc66b942c9d4eb022d5be7496ced93bd",
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
    upToken: "0xede7200bcd0c064e314e61e7664c3a034536f1d5",
    downToken: "0xa5a772e324c5b0a35b760cd7a67067063b49905f",
    underlyingToken: "0x863cc1860f2c491c7345074a5d5d6f7135d4e9d4",
    invalidToken: "0x62fd7ed1f82134d79ca137edfa3bf824931395b3",
    minValue: 0,
    maxValue: 150,
    precision: 1,
    marketId: "0xcf355f361d363220e1eeb63263c8d70a3a7112a0",
    parentMarketOutcome: 6,
    conditionId:
      "0xf2b852ac364d6515a1af5e6494c5afb4acf38452abf5bc9847d2e71f0dc97854",
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
