import { Address } from "viem";

export const positionExplainerLink =
  "https://kleros.notion.site/Kleros-Foresight-Advanced-Guide-What-Actually-Happens-After-Your-First-Prediction-30d9a9db4f0880f8a44ecb13d34ad3c6#30d9a9db4f0881969c23e8152ab1146d";

export const appGuideLink =
  "https://app.notion.com/p/kleros/Kleros-Foresight-DevCon-Side-Event-Satisfaction-Session-3cf9a9db4f088021ab0eed008dfc046a";

export const faqLink =
  "https://app.notion.com/p/kleros/Kleros-Foresight-DevCon-Side-Event-Satisfaction-Session-3cf9a9db4f088021ab0eed008dfc046a#3cf9a9db4f0880baaac2fbcd7ed86d52";

export const beginnerUserGuide =
  "https://app.notion.com/p/kleros/Kleros-Foresight-DevCon-Side-Event-Satisfaction-Session-3cf9a9db4f088021ab0eed008dfc046a";

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
        "Bowling and retro games are universally fun and break the ice instantly. The event is highly likely to get solid satisfaction scores because it avoids awkward networking silences. The only limiting factor is noise—bowling alleys are loud, which means deep business conversations will be fragmented. It’s a very safe bet for a fun night, but unlikely to be a quiet networking hub.",
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
        "High risk, high reward. It physically demonstrates Kleros's core Schelling point coordination mechanism in real life, which devs will love. The metric depends entirely on fluid execution: if the track physics work seamlessly and the voting rounds are fast, satisfaction will be off the charts. If the marbles get stuck or the digital voting layer lags, the room's energy will drop quickly. Price this share based on your trust in the physical setup.",
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
        "High execution risk, but incredible upside for those who show up. Because it gives every attendee a direct, personalised role and physically mirrors decentralised jury mechanics, the depth of engagement is unmatched. The primary risk is execution pacing: if the script drags or guests arrive late due to traffic, the timeline breaks. If it runs smoothly, it will be a major highlight of the week; if logistics lag, player retention will drop sharply.",
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
        "Curation and comfort drive the score here. High-profile founders and VCs actively avoid loud, sweaty mixers; they want quiet spaces where they can actually hear each other and close strategic deals over world-class food. By eliminating travel friction and providing a premium regional Indian dining environment, this event is structurally positioned to get an incredibly high satisfaction score. If the list lands the right mix of people, the mean rating could be the highest of the seven, measuring networking quality rather than room size.",
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
        "The visual of branded crypto Tuk Tuks and local food creates instant FOMO and is designed to go viral on X. The casual, moving layout allows people to naturally mingle, grab a high-quality drink, and chat without being trapped in rigid structures. This format historically scores the highest crowd satisfaction because it feels like a real, immersive experience rather than a corporate pitch.",
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
        "Satisfaction is structurally protected here because friendly competition and physical racing are universally memorable. The live leaderboard and podium finishes create natural high-energy moments. The primary risk to satisfaction is downtime: if there are too many attendees, guests will spend a lot of time waiting in the lounge for their 10-minute driving heat. If the organizers manage the race rotation quickly, this will score exceptionally high for pure entertainment value.",
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
        "Maximum satisfaction floor for B2B networking. Attendees are showing up specifically for the technical content and the exact peer group in the room because they deeply care about the topic, not because it looks flashy on a social media story. Because it uses a standard panel-and-lounge format, the physical execution risk is very low—there are no complex games or custom tracks to build. If you believe the market craves deep, actionable infrastructure discussions over loud parties, this share is a highly secure bet for top-tier satisfaction.",
    },
  },
];
