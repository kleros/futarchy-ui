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
  "https://app.seer.pm/markets/100/which-movies-will-clement-watch-as-part-of-the-distilled-clements-judgement-expe-5";

// number of movies Clément commits to watching from the 20 candidates
export const projectsChosen = 5;

export const parentMarket: Address =
  "0xb3027df942259e82c40b620daa4fd9f3541bcd4f";

export const parentConditionId =
  "0xf2005f6fb03217c002d20dbba523d5c427675b7f68a213b51559c69d4cb99b68";

export const invalidMarket: Address =
  "0x3f7c2e0e48dcf0b2dcce6016ab1ee0174fa64fb0";

// in unix timestamp, seconds
export const startTime: number = 1785801600;
export const endTime: number = startTime + 30 * 24 * 60 * 60;
export const endDate: string = "Thursday, 3 September 2026 00:00 UTC";

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
  name: "Distilled Clément's Judgement - Session 3",
  question:
    "If watched, what percentile score would Clément give to the movie?",
};

const MARKET_COLORS = [
  "#E6194B",
  "#3CB44B",
  "#FFD93D",
  "#6BCB77",
  "#4D96FF",
  "#845EC2",
  "#FF9671",
  "#0081CF",
  "#FFC75F",
  "#00C9A7",
  "#C34A36",
  "#9B51E0",
  "#2D4059",
  "#F9F871",
  "#B0A8B9",
  "#FF8066",
  "#F58231",
  "#911EB4",
  "#46F0F0",
  "#D2F53C",
] as const;

export const markets: Array<IMarket> = [
  {
    name: "Interrogation (1982)",
    color: MARKET_COLORS[0],
    upToken: "0x446b47b19f82a4c95bc024fe033e74094008ea8f",
    downToken: "0xd8a7015e03d5df472d7edb371454bf33ce3cc831",
    underlyingToken: "0x91d2a312a732b640bbcb68eeac913d0d34d4bff7",
    invalidToken: "0xb645d2097e0b87a11b0e2440405acf52b4dd1532",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x0bcf83a6ea2f39491e98bb5ed88261b9a429e3c8",
    parentMarketOutcome: 0,
    conditionId:
      "0xa70d895e397e12e338526586f948b0ca3e4c31f42179117d5f591274bead53c2",
    details: {
      imdbURL: "https://www.imdb.com/title/tt0084548/",
      posterURL:
        "https://upload.wikimedia.org/wikipedia/en/7/73/Przesluchanie_%28Interrogation%29_English_DVD_Cover.jpg",
      summary:
        "Tonia goes out drinking. She wakes up in prison, not having a clue why she's there. She is tortured to encourage her to confess to a crime she is not aware of.",
    },
  },
  {
    name: "The Suicide Squad (2021)",
    color: MARKET_COLORS[1],
    upToken: "0x211a324b19cbb278c30a0df0a91316b76e3d296a",
    downToken: "0x88b7df0da8d9e73ab3f7eb96062fa9f0ffe651bf",
    underlyingToken: "0x8fbbd7e4bd924b55f79e9c8075baa26d8637a4d6",
    invalidToken: "0x473ec55c45f8be9766a2b639c6ca8b8981fdd90c",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x95f6dd5829277ad0e0ba9fdc159add8feb2e4892",
    parentMarketOutcome: 1,
    conditionId:
      "0x5fee832e3a78ad331fb67e95c720fe05dc6ab2c298ee6b45ffeeba217c3ebf4c",
    details: {
      imdbURL: "https://www.imdb.com/title/tt6334354/",
      posterURL:
        "https://upload.wikimedia.org/wikipedia/en/0/06/The_Suicide_Squad_%28film%29_poster.jpg",
      summary:
        "Supervillains Harley Quinn, Bloodsport, Peacemaker, and a collection of nutty cons at Belle Reve prison join the super-secret, super-shady Task Force X as they are dropped off at the remote, enemy-infused island of Corto Maltese.",
    },
  },
  {
    name: "Citizen Vigilante (2026)",
    color: MARKET_COLORS[2],
    upToken: "0x4a5be95504eb8483a6685d86b987f65c0aed71df",
    downToken: "0x808a8950bb96d025db5cf725368b3b6c6dd11835",
    underlyingToken: "0x187a5bb9bd527b325f9a6bab6579497f147a315b",
    invalidToken: "0xbe03757766d8127149b0208641dcbcc8cd8774ff",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0xd2be61e589215fc7a773bd8662f585dcf08fa578",
    parentMarketOutcome: 2,
    conditionId:
      "0xee7fd008f54869d66cc81bcda25550fc109682e986ecc19336ab609830db1899",
    details: {
      imdbURL: "https://www.imdb.com/title/tt35309713/",
      posterURL:
        "https://upload.wikimedia.org/wikipedia/en/c/cf/Citizen_Vigilante_film_poster.png",
      summary:
        "A man takes justice into his own hands, hunting down criminals. His vigilante crusade makes him a social media star but puts him at odds with the local police chief.",
    },
  },
  {
    name: "Backrooms (2026)",
    color: MARKET_COLORS[3],
    upToken: "0x75b74f6f913b704a21b76fb265e6cd30350129ae",
    downToken: "0x468a1802bd86a39f36972dc5a062fb2c4490d53a",
    underlyingToken: "0xf49e1a390b60f077e85fd6c304b816c2aeb8aacc",
    invalidToken: "0x335fa2af05266a3dd619af4302fc0a8216a4f98d",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0xcec312c4c7626f15d2317b515c62538d88e210bc",
    parentMarketOutcome: 3,
    conditionId:
      "0x6ad4cb3421ccbdc238aa35f04bed8689ab428a3c90cb58906ade7fa9fb801d88",
    details: {
      imdbURL: "https://www.imdb.com/title/tt26657236/",
      posterURL:
        "https://upload.wikimedia.org/wikipedia/en/3/3d/Backrooms_%28film%29_poster.jpg",
      summary:
        "After a therapist's patient disappears into a dimension beyond reality, she must venture into the unknown to save him.",
    },
  },
  {
    name: "Midsommar (2019)",
    color: MARKET_COLORS[4],
    upToken: "0x8644c6e5e6e6760885306280ed1013caae3ef525",
    downToken: "0x35c804378b9d683ff8b6f7251c81774d2c14a5b5",
    underlyingToken: "0xf36d6cad3377805f9b4570fa61f60c5d7e72a68b",
    invalidToken: "0xc2ae94004944d225d4011871368cfb391aafbfd7",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x9ac8df0b70d483d9ab762cacdb1210cf399a82ae",
    parentMarketOutcome: 4,
    conditionId:
      "0xa7a4f56b1f6cf77d8d13466fd37922cfbb451e960a59e381c2d165dbfd069988",
    details: {
      imdbURL: "https://www.imdb.com/title/tt8772262/",
      posterURL:
        "https://upload.wikimedia.org/wikipedia/en/4/47/Midsommar_%282019_film_poster%29.png",
      summary:
        "A couple travels to Northern Europe to visit a rural hometown's fabled Swedish mid-summer festival. What begins as an idyllic retreat quickly devolves into an increasingly violent and bizarre competition at the hands of a pagan cult.",
    },
  },
  {
    name: "La La Land (2016)",
    color: MARKET_COLORS[5],
    upToken: "0xa30774e07bc345853ff7e09d64863f2c15c1126b",
    downToken: "0x83c3761b8523ae001b55e148f7f5b3af941c131a",
    underlyingToken: "0x515974475b6b869fdd007caf38ca0c23e631f5de",
    invalidToken: "0x1bb03639e27c909d0e58efa820f357014a1d6750",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x052661ffb8d05d0725d4586dfad2562156612fe6",
    parentMarketOutcome: 5,
    conditionId:
      "0x3ddee98e3ef018b425ae0ec5c3d2d7beb821de67d694eec3bb347ce1978844ec",
    details: {
      imdbURL: "https://www.imdb.com/title/tt3783958/",
      posterURL:
        "https://upload.wikimedia.org/wikipedia/en/a/ab/La_La_Land_%28film%29.png",
      summary:
        "When Sebastian, a pianist, and Mia, an actress, follow their passion and achieve success in their respective fields, they find themselves torn between their love for each other and their careers.",
    },
  },
  {
    name: "Corpse Bride (2005)",
    color: MARKET_COLORS[6],
    upToken: "0x4a796c38f2db23641a60d49da834bf5015ef70b8",
    downToken: "0xf4e508fab240e9546c01747110fa68e6238a9a5b",
    underlyingToken: "0xdf1a10335a5f6870f79fd5e1a6005a65ba924dbe",
    invalidToken: "0x6254bf9d42a5cf0972614be0f0331168c34f6814",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x4578f8134438dbcd2e0e723a61e113129ac6aaca",
    parentMarketOutcome: 6,
    conditionId:
      "0x105ac5f6b82e57705ae4690b0b909713af5d4a354fc1a08c5230297ff4d522b4",
    details: {
      imdbURL: "https://www.imdb.com/title/tt0121164/",
      posterURL:
        "https://upload.wikimedia.org/wikipedia/en/a/a6/Corpse_Bride_film_poster.jpg",
      summary:
        "When a shy groom practices his wedding vows in the inadvertent presence of a deceased young woman, she rises from the grave assuming he has married her.",
    },
  },
  {
    name: "Promising Young Woman (2020)",
    color: MARKET_COLORS[7],
    upToken: "0x9d641cdf1250120a9cb11cff4dfc29b92c5d11e2",
    downToken: "0xa15c55ff89f62a4a3a0032f3485f194c47beb856",
    underlyingToken: "0xa7bf9624fbec7bb9ff7a0ce0567acf93c0cd4692",
    invalidToken: "0x6f5e25bb827338bf3b1c62fc7719fb1d4dadd6e1",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x0335bab65aca67df3e14b673999ea4f774806d50",
    parentMarketOutcome: 7,
    conditionId:
      "0x62d6d724d7b8a6134b4c71d9452a240d31cb6d53eda4be10a867ccdcdf0fe030",
    details: {
      imdbURL: "https://www.imdb.com/title/tt9620292/",
      posterURL:
        "https://upload.wikimedia.org/wikipedia/en/0/06/Promising_Young_Woman_poster.jpg",
      summary:
        "An unexpected encounter gives a wickedly smart and cunning woman a chance to right the wrongs from her past.",
    },
  },
  {
    name: "Alice in Wonderland (2010)",
    color: MARKET_COLORS[8],
    upToken: "0xda05435d07da47d1b28586bf0e6bf0978d56282d",
    downToken: "0x3e8fba3555a194a809ad309a90b3022a8478ea93",
    underlyingToken: "0x3f810bc1ffb4282391b28f38ab2e05901f100664",
    invalidToken: "0x4d134d186a6d5636769c4f2822a59b36a184f197",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x05db83a02993581657ff591e3aff076859ae4c91",
    parentMarketOutcome: 8,
    conditionId:
      "0x02d96277510adae549609dcf0e18491e409cbcca973dded9c27d035d6a019b19",
    details: {
      imdbURL: "https://www.imdb.com/title/tt1014759/",
      posterURL:
        "https://upload.wikimedia.org/wikipedia/en/3/36/Alice_in_Wonderland_%282010_film%29.png",
      summary:
        "Nineteen-year-old Alice returns to the magical world from her childhood adventure, where she reunites with her old friends and learns of her true destiny: to end the Red Queen's reign of terror.",
    },
  },
  {
    name: "Elysium (2013)",
    color: MARKET_COLORS[9],
    upToken: "0x9c5e20e88ecb1e387934ba12ee7764ce798f2a98",
    downToken: "0x67fcf3104e53fc5a8522aa5e674a35bd7255d4d5",
    underlyingToken: "0x2d8388faf727c0c8a02c5f71b8a3bce7df17eb3d",
    invalidToken: "0x4c36e798d55b0b35107f0618edd0e5d6b6efe386",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0xd4eb5a0a687229dc14c17545c1ad19f02a151529",
    parentMarketOutcome: 9,
    conditionId:
      "0x8cd0833f32db80c2a2fae302074c9e15a4291c9d906707fb391c2e264e070892",
    details: {
      imdbURL: "https://www.imdb.com/title/tt1535108/",
      posterURL:
        "https://upload.wikimedia.org/wikipedia/en/f/f9/Elysium_Poster.jpg",
      summary:
        "In the year 2154, the very wealthy live on a man-made space station while the rest of the population resides on a ruined Earth. A man takes on a mission that could bring equality to the polarized worlds.",
    },
  },
  {
    name: "Soylent Green (1973)",
    color: MARKET_COLORS[10],
    upToken: "0x7c337ae7bea7dc09840693caf34a4e0819785ebd",
    downToken: "0xa811bc99ecb756c026bd68b14dedb8963103c908",
    underlyingToken: "0x46353927c189fea0b94159784be8dee08dfbe3c8",
    invalidToken: "0xec9cdaa22b5ecf6978e0c2d3b5d91487ff08a63c",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x485c51463cffba37ee0e15e66830361b256d472e",
    parentMarketOutcome: 10,
    conditionId:
      "0x2a0f221f1ad9433d7fcfdfa29c390f28f1cfa592b47f4d19257ea5f5516ca7cb",
    details: {
      imdbURL: "https://www.imdb.com/title/tt0070723/",
      posterURL:
        "https://upload.wikimedia.org/wikipedia/en/1/13/Soylent_green.jpg",
      summary:
        "A nightmarish futuristic fantasy about the controlling power of big corporations and an innocent cop who stumbles on the truth.",
    },
  },
  {
    name: "Tenet (2020)",
    color: MARKET_COLORS[11],
    upToken: "0xb2410fbc1e497a999783302264c56fb4800edf6e",
    downToken: "0xac81fcee3349c42eddbc6d656e54e9b91789a200",
    underlyingToken: "0x383f9df39c101620471b4f113d660090c71834d8",
    invalidToken: "0x8ee367d31f3dbeec8ffd05831a8244de84bfaa46",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0xa1be4097cc2c8ad807cc8b16c725eed900c1b797",
    parentMarketOutcome: 11,
    conditionId:
      "0x71654b613a65f19ada20bd523dd43bfd319cc8fd76e0f832fa8d610ce658ce0b",
    details: {
      imdbURL: "https://www.imdb.com/title/tt6723592/",
      posterURL:
        "https://upload.wikimedia.org/wikipedia/en/1/14/Tenet_movie_poster.jpg",
      summary:
        'Armed with only the word "Tenet," and fighting for the survival of the entire world, CIA operative, The Protagonist, journeys through a twilight world of international espionage on a global mission that unfolds beyond real time.',
    },
  },
  {
    name: "Lolita (1962)",
    color: MARKET_COLORS[12],
    upToken: "0xfdb0c9f9a8a41d629fd757540dc9792b2bef039a",
    downToken: "0x72093d16a31bee16acfd38855d6cbcf20bbc36b1",
    underlyingToken: "0x9a3632a45c86f640713032c8de65ee6903a3be17",
    invalidToken: "0xb9ff280e31604bef2e73aa730a0f38091f59dc79",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0xa9d202683e29cc760ce1b1cb5248317eefb5cae8",
    parentMarketOutcome: 12,
    conditionId:
      "0x76e1ec2b9ff0aaeffe02bbccaee3ec8c5e4f6fc39ede1d58b52c050911888e04",
    details: {
      imdbURL: "https://www.imdb.com/title/tt0056193/",
      posterURL:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Lolita_%281962_film_poster%29.jpg/500px-Lolita_%281962_film_poster%29.jpg",
      summary:
        "A middle-aged college professor becomes infatuated with a 14-year-old girl.",
    },
  },
  {
    name: "Swiss Army Man (2016)",
    color: MARKET_COLORS[13],
    upToken: "0xebc6747e75667899c562d0adb850dcef03bebddd",
    downToken: "0x072b71ffec23eda2fd5a9bc627fe6eb954c1664b",
    underlyingToken: "0x5930d983d90fa045d3ab2ec80ba7f75c34406385",
    invalidToken: "0x90485af1b83466ca581f42e532859176beb06ade",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x625ad2ecfec5ff97fbf0aa84334616a610528602",
    parentMarketOutcome: 13,
    conditionId:
      "0xcfe45f328e5fea0efd1c8759c0f66433cee9a7bfd75db1d6a74fcfb8fe57e049",
    details: {
      imdbURL: "https://www.imdb.com/title/tt4034354/",
      posterURL:
        "https://upload.wikimedia.org/wikipedia/en/7/72/Swiss_Army_Man_poster.png",
      summary:
        "A hopeless man stranded on a deserted island befriends a dead body, and together they go on a surreal journey to get home.",
    },
  },
  {
    name: "El Camino: A Breaking Bad Movie (2019)",
    color: MARKET_COLORS[14],
    upToken: "0x02ad7da5815fe34d2df59208e4d0d4caa0183cd9",
    downToken: "0x11e04136407fc61b3e716f4e9733709a4814a51a",
    underlyingToken: "0x6d11d964c40fac3acb10a816e04c84381d5ad7e1",
    invalidToken: "0x6ef49f6c6e943abcb5fe70e91a27857f2a813428",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x410c7c437e5ea2c5b8923bf194ceb99b00b784af",
    parentMarketOutcome: 14,
    conditionId:
      "0xcf9e1d0372d38d75632c56aff7435eb1fee2519fb47547ea530cd6d319724d5e",
    details: {
      imdbURL: "https://www.imdb.com/title/tt9243946/",
      posterURL:
        "https://upload.wikimedia.org/wikipedia/en/4/4e/El_camino_bb_film_poster.jpg",
      summary:
        "Fugitive Jesse Pinkman runs from his captors, the law, and his past.",
    },
  },
  {
    name: "City of Ember (2008)",
    color: MARKET_COLORS[15],
    upToken: "0xceccbb951593ff4b85a97d3a2ac4ebf152b4f749",
    downToken: "0xe79e339d5d927f0c42530f8958fcd199e1b805c7",
    underlyingToken: "0xe3a44f81bf1f82c4be262116eb1664f7764c8732",
    invalidToken: "0x23cd3b89c7b8ddf2fe3a029331156d43455610d9",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x367ca2c2dcaf69eaffac5808a1a60704cb0270b8",
    parentMarketOutcome: 15,
    conditionId:
      "0x58f5b19408c375bd0afc9c1d0d0e186c79927912dc067050bc88f836233aa857",
    details: {
      imdbURL: "https://www.imdb.com/title/tt0970411/",
      posterURL:
        "https://upload.wikimedia.org/wikipedia/en/1/18/City_of_ember.jpg",
      summary:
        "For generations, the people of the City of Ember have flourished in an amazing world of glittering lights. But Ember's once powerful generator is failing and the great lamps that illuminate the city are starting to flicker.",
    },
  },
  {
    name: "Jupiter Ascending (2015)",
    color: MARKET_COLORS[16],
    upToken: "0x03bbcda1cada818abc0b27db05c5a5c312c226de",
    downToken: "0x11e025d035e7f6d23bce4ba27dffc00e339fff62",
    underlyingToken: "0xf539cb3e9c1226b6794f425e9f22ecdba3926bed",
    invalidToken: "0xde9e1de441c16224288c4bc62c55dff95ad26dc3",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x75469573b22e27bd329ea0b9c10286d7dc4806e4",
    parentMarketOutcome: 16,
    conditionId:
      "0x72ce4b9f7a958cbbbc17886a416c47d7f1dca4a15479ce28f0387964bca804ac",
    details: {
      imdbURL: "https://www.imdb.com/title/tt1617661/",
      posterURL:
        "https://upload.wikimedia.org/wikipedia/en/7/76/%27Jupiter_Ascending%27_Theatrical_Poster.jpg",
      summary:
        "A genetically engineered soldier informs a young woman of her extraordinary destiny.",
    },
  },
  {
    name: "Poor Things (2023)",
    color: MARKET_COLORS[17],
    upToken: "0x18ecdaf65d6e45ae8205c82f71d579e597e7c21e",
    downToken: "0x2a88f43050809a9ca797233b28953de71944873f",
    underlyingToken: "0xc22411475eb5e548d5c3edc427ad900163b81b72",
    invalidToken: "0x9a53a9c66f475d5176c54f25437902b29cb87f47",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x438b742d6db6e350ff1f6767023263d3c3a77a62",
    parentMarketOutcome: 17,
    conditionId:
      "0xa23c64df270c58afd248e51f18ab3419cf1b12e7625cdd911ee4dcf8f240ddfa",
    details: {
      imdbURL: "https://www.imdb.com/title/tt14230458/",
      posterURL:
        "https://upload.wikimedia.org/wikipedia/en/f/f3/Poor_Things_poster.jpg",
      summary:
        "An account of the fantastical evolution of Bella Baxter, a young woman brought back to life by the brilliant and unorthodox scientist Dr. Godwin Baxter.",
    },
  },
  {
    name: "Kin-dza-dza! (1986)",
    color: MARKET_COLORS[18],
    upToken: "0xf8467dcabe731ab96f3df617e8755759a31aad46",
    downToken: "0x2d2586a0e31c0928312c95c1af6b51cd3cb16f7f",
    underlyingToken: "0xb8d9edac8e36fdd19c5e61896879663d30393f31",
    invalidToken: "0xb04984e1c12305709b51d75fc29e234a1eb357e1",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x045326fcb2384af8672b1b11bb1ff0dac0e25955",
    parentMarketOutcome: 18,
    conditionId:
      "0xc9ea637c3fee2c93f64c4b593843788bbfe49cbc3885d85d68db08ec92051f88",
    details: {
      imdbURL: "https://www.imdb.com/title/tt0091341/",
      posterURL:
        "https://upload.wikimedia.org/wikipedia/en/0/00/Kin-dza-dza-VHS.jpg",
      summary:
        "Two Soviet citizens push the wrong button on a strange device and end up on the telepathic planet Pluke with its strange societal norms.",
    },
  },
  {
    name: "When the Wind Blows (1986)",
    color: MARKET_COLORS[19],
    upToken: "0x40982ed933fe0c91802206f4e55d1e8d73c67dc3",
    downToken: "0x64868e7b3dbf0fe6de0105d05a5bcbada72a338d",
    underlyingToken: "0xa29bf175bfecf3f63e172e15f524b13b26d4da52",
    invalidToken: "0x22f3955720b19195d519773b89bcc7514e1d7cf7",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x69c6eef3b7e73cdebccc38171f9479c12216746b",
    parentMarketOutcome: 19,
    conditionId:
      "0xeb914a9d6462d2ebe77f5efaf3804aed90d5cd70835e2d2555e5287077727f3b",
    details: {
      imdbURL: "https://www.imdb.com/title/tt0090315/",
      posterURL:
        "https://upload.wikimedia.org/wikipedia/en/b/b6/When_the_Wind_Blows_1986.jpeg",
      summary:
        "A naive elderly British rural couple survive the initial onslaught of a nuclear war.",
    },
  },
];
