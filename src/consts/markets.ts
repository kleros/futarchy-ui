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

export interface IDetails {
  imdbURL?: string;
  posterURL?: string;
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
      summary:
        "Pax: 50–100\nLocation: The Game Palacio\n\nA relaxed night of arcade games, bowling, food, drinks, and good company. We’ll kick things off with a quick introduction to the organisers, then leave the rest of the evening open for people to play, compete, and hang out. Expect a casual, drop-in-and-out kind of night with plenty of opportunities to meet other people from the ecosystem.\n\n- 30-minute welcome session: A brief introduction to the organisers, who we are/what we do, and the purpose of the event.\n- Free play & networking: Guests are then free to enjoy the arcade games and bowling, grab food and drinks, and mingle throughout the venue at their own pace.",
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
      summary:
        "Pax: 50+\nLocation: Coworking/Event spaces around Mumbai\n\nA giant custom marble race where the crowd gets to decide what happens on the track. Each round, participants use event tokens to vote on interventions that could help the Kleros marble win — from removing obstacles to adding speed boosts or switching lanes. The winning intervention gets put to the test, with multiple races showing how collective predictions can play out in practice.\n\n- Customise a 3m-long marble run race set and provide 5 marbles.\n- 1 is a Kleros marble. The objective is for the Kleros marble to win, and we’ll have a few mechanisms that could influence the speed of the marbles, such as: removing one obstacle, adding an acceleration piece, switching lanes.\n- Participants allocate their tokens to the intervention mechanism they believe is most likely to maximise Kleros’ chances of winning.\n- The intervention with stronger market support is implemented.\n- Those who win get rewards.\n- Multiple races can be run under the same intervention to illustrate how futarchy predicts possibilities.",
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
      summary:
        "Pax: 30–50\nLocation: Mystery Rooms, Rare Escape, No Escape\n\nA murder mystery where you’re not just solving the crime — you’re trading on it. Guests investigate clues, question suspects, piece together the timeline, and trade predictions about who did it and why. At the end, the case goes to a Kleros-style tribunal, where players become jurors and stake their event credits on the verdict. Come prepared to investigate, argue your case, and maybe accuse your friends.\n\nAn interactive game where a murder case is introduced with clues lying around the venue. Attendees hunt for clues and cross-examine suspects to trade on Umia, predicting the timeline and motives.\n\nThe event culminates in a Kleros Court tribunal, where players act as decentralised jurors, staking event credits to vote on the true killer and winning prizes based on the Schelling point mechanism.\n\n- Rent an escape room venue.\n- The game setup and NPCs will be our own.\n- We just need their space and existing setup.",
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
      summary:
        "Pax: 15+\n\nPossible Locations:\n- Khar Social\n- The Little Easy\n- Khane Khas\n- Lucky Restaurant\n- Bastian Beach Club\n- Cecconi's Mumbai\n- antiSOCIAL Lower Parel\n\nA smaller, curated dinner bringing together people working across prediction markets, Web3, and the wider ecosystem. This is an evening built around good food and deeper conversations with a carefully selected group of people. A chance to meet interesting people, exchange ideas, and actually have time to talk.\n\n- Invitation-only networking dinner at a restaurant by the seaside.\n- Since it's a curated list of participants, you may get the specific people that you want.\n- Would be more of a formal networking event.",
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
      summary:
        "Pax: 50–70\nLocation: Corona Garden Bandra\n\nA Mumbai-inspired evening built around tuk tuks, street food, cocktails, chai, music, and casual conversations. Wander between a cocktail-serving tuk tuk, a cutting chai and street food station, and a DJ setup tucked into the back of another vehicle. Less conference, more night out — with a distinctly Mumbai twist.\n\nKleros/Umia-themed tuk tuks serving Indian street food and cocktails, with space for casual networking and mingling.\n\n- Tuk-Tuk #1: The Bar — serves custom craft cocktails.\n- Tuk-Tuk #2: The Cutting Chai & Lounge Corner — serves authentic Mumbai cutting chai (spiced milk tea) and local street food staples like Vada Pav and Samosas.\n- Tuk-Tuk #3: The Sound System — a DJ controller and speaker setup in the backseat of one vehicle, playing lo-fi house or chill electronic beats. It keeps the energy upbeat but quiet enough for conversations.\n- Rent an outdoor, private gated venue that allows music and catering.",
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
      summary:
        "Pax: 50+\nLocation: Ajmera IndiKarting\n\nA few hours of racing, friendly competition, and hanging out off the conference floor. We’ll start with a quick introduction to the organisers, then get straight onto the track for multiple rounds of go-karting. There may even be a few prediction markets around the races and leaderboard, because naturally, someone should be betting on who’s going to win.\n\n- 30-minute short introduction about us.\n- 2–3 hours of go-karting and casual networking.\n- Could possibly run small prediction markets on who would top the leaderboard, what would happen during the races, etc.",
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
      summary:
        "Location: IFBE (cultural centre), DevX/WeWork (coworking space)\n\nA half-day gathering focused on what happens when prediction markets move from an interesting idea to something people actually rely on. We’ll bring together people building and working around prediction markets to discuss liquidity, oracle resolution, manipulation, institutional adoption, dispute resolution, and the challenges of using markets for real-world decisions.\n\nExpect a mix of focused conversations and plenty of time to meet others working in the space.\n\n- Half-day side event focusing on core discussion topics around prediction markets.\n- 2 hours of sessions bookended by open networking.\n- Need to pull partners to make this work. Prediction markets would be a bit easier, provided that we have the PMs Community Hub.\n\nPossible Topics:\n- Scaling liquidity and oracle resolution mechanics in real-world decision markets\n- Institutional adoption and financial risk frameworks for on-chain markets\n- Dispute resolution, subjective truth, and arbitration standards\n- Prediction markets and manipulation by whales",
    },
  },
];
