import { Address } from "viem";

export const positionExplainerLink =
  "https://kleros.notion.site/Kleros-Foresight-Advanced-Guide-What-Actually-Happens-After-Your-First-Prediction-30d9a9db4f0880f8a44ecb13d34ad3c6#30d9a9db4f0881969c23e8152ab1146d";

export const appGuideLink =
  "https://kleros.notion.site/Kleros-Foresight-DevCon-Side-Event-Attendance-Session-3cf9a9db4f0880abb863c55794a31f68";

export const faqLink =
  "https://kleros.notion.site/Kleros-Foresight-DevCon-Side-Event-Attendance-Session-3cf9a9db4f0880abb863c55794a31f68#3cf9a9db4f0880c8904bf2e86bbc9904";

export const beginnerUserGuide =
  "https://kleros.notion.site/Kleros-Foresight-DevCon-Side-Event-Attendance-Session-3cf9a9db4f0880abb863c55794a31f68";

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
export const endTime: number = 1790812740;
export const endDate: string = "Wednesday, 30 September 2026 23:59 UTC";

export interface ILocation {
  name: string;
  url?: string;
}

export interface IDetails {
  imdbURL?: string;
  posterURLs?: string[];
  pax?: string;
  locations?: ILocation[];
  summary: string;
  rationale?: string;
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
      posterURLs: ["/events/arcade-bowling.jpg"],
      pax: "50-100",
      locations: [
        {
          name: "The Game Palacio",
          url: "https://share.google/0G0CEUJtsHe2faQXf",
        },
      ],
      summary:
        "An easy-going arcade and boutique bowling mixer designed for organic, low-pressure networking. It kicks off with a quick 30-minute introduction by the hosting teams, followed by an open floor with free-play games, private lanes, food, drinks and networking at their pace. There is no rigid program or obligation to stay—guests are free to drop in for a quick game or hang out for the entire evening.",
      rationale:
        'Arcade formats are the ultimate "low-brainpower" events that people say yes to on a whim or drop into between other commitments. While crypto side events usually face a heavy 60% RSVP drop-off, scheduling this during the pre-conference hype window keeps attendance high. Expect unique walk-ins to comfortably stabilise between 70 to 110 people. It is a catered, low-commitment, and highly accessible choice.',
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
      posterURLs: ["/events/marble-race.jpg", "/events/someplace-else.jpg"],
      pax: "50+",
      locations: [
        {
          name: "Someplace Else (Jio World Drive, BKC)",
          url: "https://www.google.com/search?q=Someplace+Else+Jio+World+Drive+BKC+Mumbai",
        },
      ],
      summary:
        "A live, interactive game night built around a custom 3-meter physical marble track set up inside a premium lounge bar. Five marbles race per heat, with one designated as the Kleros marble. Before each race, the crowd uses event tokens to vote on physical track interventions—such as removing obstacles, adding speed boosts, or switching lanes—to maximize the Kleros marble's chance of winning. The option with the highest market backing is built into the track live before the marbles run. Multiple heats run through the night to test the crowd's governance accuracy.",
      rationale:
        "This is a highly specialised, crypto-native concept that directly targets protocol engineers, prediction market traders, and game theorists. Because a physical table only allows 15 to 20 people to see the loop clearly at one time, raw crowd numbers are naturally capped. routing a live camera feed of the track onto the venue's big display screens turns it into an engaging spectator sport, boosting the active crowd to 40–60 players.",
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
      posterURLs: ["/events/murder-mystery.jpg"],
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
        "An immersive, interactive puzzle experience hosted inside a private rented escape-room environment. The night is set up as a live murder investigation with hidden clues and NPCs. Guests hunt for clues, cross-examine suspects, and trade predictions on the killer. The event culminates in a live Kleros Court live tribunal where players act as decentralised jurors, staking event credits to vote on the true culprit for a chance to win prizes.",
      rationale:
        'This event has a hard structural capacity cap of 30 to 50 players. It will naturally attract crowds who love escape rooms and gamified dispute resolution. Because it requires a connected narrative, structured roles, and strict pre-registration, it cannot accommodate a loose "walk-in" crowd or spontaneous drop-ins. Traders should note that this high-commitment format caps raw turnout, meaning attendance will tightly consolidate around the 25–40 player mark.',
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
      posterURLs: ["/events/bawri.jpg"],
      pax: "30+",
      locations: [
        {
          name: "Bawri",
          url: "https://www.google.com/search?q=Bawri+BKC+Mumbai",
        },
      ],
      summary:
        "An exclusive, invite-only networking dinner for a highly curated list of 30+ founders, investors, and core Web3 builders. Hosted at a premier, highly aesthetic BKC fine-dining venue, there are no presentations, keynotes, or pitches—just quiet, premium hospitality and high-level, targeted conversation.",
      rationale:
        "Raw headcount is an intentional lag metric here; on total volume, this market will mathematically finish last because it is strictly capped by a private guest list. However, because it is hosted directly inside BKC during the high-energy pre-conference days, invitees don't have to brave long taxi rides, making the actual guest arrival incredibly reliable.",
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
      posterURLs: ["/events/tuk-tuk.jpg", "/events/kleros-tuk-tuks.jpg"],
      pax: "100+",
      locations: [
        {
          name: "Kyma BKC",
          url: "https://www.google.com/search?q=Kyma+BKC+Mumbai",
        },
        {
          name: "Blah!",
          url: "https://www.google.com/search?q=Blah+BKC+Mumbai",
        },
        {
          name: "Hitchki",
          url: "https://www.google.com/search?q=Hitchki+BKC+Mumbai",
        },
      ],
      summary:
        "A stylised cultural mixer hosted at a premier BKC lounge. The event features custom Kleros-branded Tuk Tuks stationed right at the venue's entrance serving cocktails and safe, premium preparations of local street food (like Vada Pav and Samosas), acting as a unique welcome experience to set the vibe before guests flow into the indoor lounge space. There is no fixed schedule—people can move in and out freely between the outdoor welcome stations and the indoor venue throughout the night.",
      rationale:
        "This event has the highest natural crowd pull on the board. Foreign tech travelers love experiencing local Indian culture and providing a secure, high-end way to eat street food right next to the BKC hub is an instant crowd magnet. Having the venue located at BKC makes travel-friction non-existent.",
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
      posterURLs: ["/events/go-karting.jpg"],
      pax: "50+",
      locations: [
        {
          name: "Ajmera IndiKarting",
          url: "https://share.google/l9eWkZ8pIuNJq2NIG",
        },
      ],
      summary:
        "A high-octane racing tournament hosted at Ajmera IndiKarting. It starts with a short introduction of the organizers, followed by 2 to 3 hours of actual track driving across multiple structured heats, with food and drinks served between sessions. The night features a live digital leaderboard, podium trophy presentations, a casual spectator lounge with food and drinks for spectators and drivers. There will be a mini prediction market on who tops the leaderboard to keep everyone engaged between their driving heats.",
      rationale:
        "Decent ceiling. Go-karting has a powerful organic pull because it offers high adrenaline and a clean break from typical tech networking. But karting has real logistical friction: track capacity per session, wait time between heats, and travel time if the venue isn't central. While actual track driving spots are strictly limited by the number of karts, the spectator and lounge turnout can scale significantly. RSVPs could look strong while actual unique-attendee numbers come in softer if people drift off during the gaps.",
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
      posterURLs: ["/events/last-mile.jpg"],
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
        'A half-day side event featuring a premium, content-driven salon and panel discussion focused entirely on the hardest structural challenges facing modern prediction markets—such as dispute resolution, oracle bottlenecks, liquidity incentives, and the "last mile" of settling complex real-world data. It features a sharp, 45-minute debate between top minds from prominent prediction market protocols, followed by an open-floor networking lounge with drinks and appetizers. This event relies heavily on co-hosting partners to fully come together, making it a highly relationship-driven play leveraging existing industry contacts.',
      rationale:
        "This is a highly specialised, hyper-targeted event designed to pull in founders, researchers, and core prediction market enthusiasts who are already in Mumbai. Turnout depends on securing the right co-hosts. If those partners sign on, premium content-driven formats at Devcon routinely pull over 100+ attendees when properly promoted. This gives the event the highest potential attendance ceiling on the list, meaning a confirmed speaker or partner announcement should visibly shift the market odds.",
    },
  },
];
