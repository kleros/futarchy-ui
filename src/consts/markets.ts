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
  "https://app.seer.pm/markets/100/0xacc15cfa0f4ae4932b12ab14595941285098436a";

// number of movies Clément commits to watching from the 20 candidates
export const projectsChosen = 5;

export const parentMarket: Address =
  "0xacc15cfa0f4ae4932b12ab14595941285098436a";

export const parentConditionId =
  "0x43bd2f34cc6183e9f76c59ead51204206894f4f2a8709f05329e5e89af80d5d3";

export const invalidMarket: Address =
  "0x3133255a319ccc24d859fb0c8390a1622a4358ef";

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
    upToken: "0x80bb382f7b1cd31af0530f7adfee71b8eee03a91",
    downToken: "0xf9867cf1d9d794e2fdff222a46559cdfe101362d",
    underlyingToken: "0x5eb3a8df0c83cac64064aadc480818876e0d26e4",
    invalidToken: "0x67c39a45f0fc484d85f36ad6c927a5e1007eab43",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x72917b537875c9dad261140684dc0c9f6ca1ea68",
    parentMarketOutcome: 0,
    conditionId:
      "0x134ecb5953670b873a30aefe9eb0f5cca6c05ab515ed3d2176ec698e89b4915b",
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
    upToken: "0x63117da298ab44d6cf232d8d600b75641ec288e5",
    downToken: "0x9382a9bfe9e5a7f9d3f4c8c6cd606a4ee338f183",
    underlyingToken: "0xd8b78bacf4d96c9ace34956c9753875116d6a597",
    invalidToken: "0x19f01ba5cd2527ef520fc12ec992d7b66a1ac992",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x572389e82e409a4a51f10b58f846554f458c4466",
    parentMarketOutcome: 1,
    conditionId:
      "0xaee56574db04bf3774468df14f2032a717930986d34a07a923a217846c5c6aea",
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
    upToken: "0xed4ef4257a515bfb65987fd99f6a6045a5a79ba6",
    downToken: "0xfd16e42321d5bccca8364b242d4edf501e92e4f1",
    underlyingToken: "0x9db338ebf799bf8bc14f32a16fe9eba92f1cc5cd",
    invalidToken: "0x881ae933d22129eb75ee5f00263b028c82ea8767",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0xa90db19f8ca09689a8f66a13d64884427362b058",
    parentMarketOutcome: 2,
    conditionId:
      "0xc9817340ece06bf589f666e6e0dad7061e6a2712c28b01b7466561860b09d904",
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
    upToken: "0x01cef5a68598733b5e2ad7c26126113ab42b066a",
    downToken: "0x4dbc6ab5c9d8971d228951d26b9409f59b9740fc",
    underlyingToken: "0x966cf78b059f7f475029395b4d4ab4894cd209f4",
    invalidToken: "0x7c29651611c612f7c8ef6e54190e8ea217f5951c",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x9c591ee8395580e44cca5b4e448b5c702857d1dc",
    parentMarketOutcome: 3,
    conditionId:
      "0xe4ab7a99c05b2135dbab4248d80cc71caff90650144cfd7dc6f900e412aef110",
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
    upToken: "0xc1edb924a03103124e6600c8efe307509109ecaa",
    downToken: "0x5d11956fad14918e2eb42c29b15b57411da28938",
    underlyingToken: "0x5f8b6c071e37e50c8ac85adb7981fae7596de70f",
    invalidToken: "0x40aaa53dd96171ff20c978ef5be6a2e467df100d",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x5fe4134ca8a6e8d15ef792585cd9e66d8564a69d",
    parentMarketOutcome: 4,
    conditionId:
      "0x1cb4a361ba62338644ffae3718d6ee4a1788b1da2c42d8963088df721bc64bce",
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
    upToken: "0xb1f66754fc0804bf6d02bfb0bd709cbed73007e4",
    downToken: "0xe2e10524cf0295f8cae9ed157fdbd9859af38cc3",
    underlyingToken: "0x8e1cdaaadbb2533f0e20cc665d85035889a0ef86",
    invalidToken: "0xa611dc9ea731a5ace77335234386aa2d832ca059",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x5311e959d7201dca87294d196a88988d8d7d412b",
    parentMarketOutcome: 5,
    conditionId:
      "0x475b932bd0f82351c2012d1e72dada9dd1efda5b0fb16cd5c9b70cddd6d29be6",
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
    upToken: "0x3637ee0af01bac537ea32597a56e1a9006998c20",
    downToken: "0x9ad5e7bf6f69506738e64b6c114bcebb4d29e116",
    underlyingToken: "0x665c43e2b73d6539149907ff7ba9a6dc54ee5cda",
    invalidToken: "0xafdbc4e50b85403bce28fc31d7570b635b0eaaf5",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x4b3ab1149e17d23555dbfa20dcf4fe612b239824",
    parentMarketOutcome: 6,
    conditionId:
      "0xeb6afe7a09a90b4113af13c9096a501bbf9989512e1e4ccf51a1783ad7812c2f",
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
    upToken: "0xde017800f4440ee9a8dbfc1131ee4b4690d78653",
    downToken: "0x47d61068a99421442f3c0102b2caf0c8afd29de7",
    underlyingToken: "0xe2d88c41d4c7a535d3abf90455ec0f605d5029f3",
    invalidToken: "0x17579481f7a524029820291c5503b48c0a94cb47",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x55476566ee8a736b7d6dc45da1c4e60fb9486245",
    parentMarketOutcome: 7,
    conditionId:
      "0x319f3228fdad955985bb21b15defd0c4742b6844a6d461fb27a4c0127251aad1",
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
    upToken: "0xc15787c5fac834386c36fd63966d5af8de2cf8f8",
    downToken: "0x25b9025316d2d533d21d90222ac32bfd13cf29a7",
    underlyingToken: "0x2599905d0c43a7a972590d66c2075130d117a450",
    invalidToken: "0x6b922578858b2d86ca844978ebb171ccd5817a4a",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x3f24508c255423eec28af62f3ad0180f3674b976",
    parentMarketOutcome: 8,
    conditionId:
      "0x9b8316f4af9dec8017485e54a1333fe7291198aca393bb25bdc1fddac304eb2c",
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
    upToken: "0xfae90c4ddd0a0d90017efeef4593a4ff321ce982",
    downToken: "0x1d78c7a7834d3307c079c8bac16a3b997f9f727f",
    underlyingToken: "0x8761c6ca567385267e148db0ea127f37de2250c5",
    invalidToken: "0x7cedfa9fde6c9022188fc176f82f640e4e72ec80",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0xa5d6da5859a34ba12012e25b5d27fa3e4b378131",
    parentMarketOutcome: 9,
    conditionId:
      "0xb64f637586c3bbbd1aae44bf6a764bb78089ad2425f8fd566b04df59da0fe988",
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
    upToken: "0x67e0514c646ab4d2009b1197ef5e7a09af0a1a23",
    downToken: "0xb495a4457838ff1b2b5fab8f08e6e7cfa1c75f0b",
    underlyingToken: "0x93e6790512c19687f15aec83c6278179ab4b5122",
    invalidToken: "0x9771371982e3b2126739580738b68be9a532992b",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x6844a88042083de8681ef04a8186de9bc57ad05f",
    parentMarketOutcome: 10,
    conditionId:
      "0x560ee0f8ce866e9825a71a9376b657f0db2c60d3b5890ec4e0c7fa6aa86bee9c",
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
    upToken: "0x49efc6e93dcddaf7b01b16fae5691d5410bdd65e",
    downToken: "0x9f89b742e8f3e71530139043481de4bbca97af1a",
    underlyingToken: "0x574c58c186a6b3454709989839df71a62681fb3c",
    invalidToken: "0xb3da5d5ad69ef8a669f2958899bb28dd61cc7fe6",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x56a590730d0f3c995c11c314fdd903b311ff550e",
    parentMarketOutcome: 11,
    conditionId:
      "0x615eb52bb2d17fbc2398b7c7ce41070d8a9c793a4cddc842bca70ca40ca2d410",
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
    upToken: "0x29fed0a04deecde9401653d1c212612ddf3e3164",
    downToken: "0x2bea841774202d8d318908a8d868a450c9a594e0",
    underlyingToken: "0x9caabeb54733f88ad66a5036500e90c15fd33b4e",
    invalidToken: "0x1f7987d2c83e29eb229e8d38326bc92a45c22433",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x62442648c599eebe8a175aa0568b1c0c71dcc3e2",
    parentMarketOutcome: 12,
    conditionId:
      "0x077afd80626864d9887982651124e3704e6449d9a2d006cdea16c20ab67d0662",
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
    upToken: "0x70850fa8fefa267b0605e6cfe59de9ca9c3aa937",
    downToken: "0xe5edcdd3a85bf5e5decc5fc294c674266ba64893",
    underlyingToken: "0x2a1fcc243495503a990113b827dec9495ea1be97",
    invalidToken: "0x7de3173bf99ef9b3ed97748c7c68e7490f5f7691",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0xdb0c2dc30a61acadef9a367deb97396c5cb32114",
    parentMarketOutcome: 13,
    conditionId:
      "0x9092c720b759c4708ff18cbb39cd5f44f6a3660ea9c34479157e6bb9dc8e1ae8",
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
    upToken: "0xd7333f0dc10f78aeaec91b3e212ddef16f67118c",
    downToken: "0x3424794c26c820674dc74df85815d9b44d7a86e3",
    underlyingToken: "0x850b9ea3c7c92e7e121355d6ca80f963691b5b3d",
    invalidToken: "0x6b4ee859f53bc80ab0a3f82d797e9603ba6e6cd1",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x9cd54d7e2c4d6d2b12590f8cf0ac6828594be2a4",
    parentMarketOutcome: 14,
    conditionId:
      "0x241b683e3f88a45dec4fdd680338e0a345d575aed263532539cac21f04ebb49d",
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
    upToken: "0x8814fe905679a5835f0ecee942954f87903a9db1",
    downToken: "0x5c7072713065ddb39cebec7d3fa64e58c91dab5b",
    underlyingToken: "0x0bc112e66d408d0758fae3dde7b3f5ab5568cacd",
    invalidToken: "0x535d4ae05d5c672d48a5c4e27b50fa61ce5ae0cc",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x32707ed352915812fe462e5bd18a3d41d447fb0c",
    parentMarketOutcome: 15,
    conditionId:
      "0x9e06a77b31eb466e019935b5130e0fc54a93ee8b772b606d69b0dc4a82fcdfe7",
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
    upToken: "0x6483f76e13035d442e712012a6d71438294a8125",
    downToken: "0x661490ddf6a48ecb475f35fd4a46cc2133ce5b30",
    underlyingToken: "0x0338550280eb6b5ffdd34187fb9f678859caaf57",
    invalidToken: "0x54efb39bafbf99ed4dcba598bbd88c39fc95dfc5",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0xc32110598c798bd4894767b517f933aa5dfa1a4a",
    parentMarketOutcome: 16,
    conditionId:
      "0x32cbb2b0ad290036d00daf1fb58e00173305fb539ad6efbec778c778439f0813",
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
    upToken: "0x55c3fd9666987deae459011c0fc84f581e9a4cae",
    downToken: "0x6fa904a815ba51f11d381c1997efefa748f99e87",
    underlyingToken: "0x9c1dc96d4061bd34cf79eee7817a2b380b5d3e14",
    invalidToken: "0x33e7f35c389b65eae179cc6cc9d221b805a16a89",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x8461e8b5ecc43717547c350ab47301fc0794556d",
    parentMarketOutcome: 17,
    conditionId:
      "0x57d7a879718c71acbb0a3277eebf37ab082ac34b56f64b735746621708233d3a",
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
    upToken: "0x1d0df673fd6b159bd7b9dc670149ce695b85b146",
    downToken: "0x67655ba92ac30fc7166378cc32a13ea6e38c6234",
    underlyingToken: "0xdced5d250713bd1c4a91e575ea02638f2f2d51f4",
    invalidToken: "0x42bf148813dffab5f4d0d6239c82c0a099f939d1",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0xf8355cd3c90dbe397b3f4575a05606f60254e297",
    parentMarketOutcome: 18,
    conditionId:
      "0x711098f3069e0032b3d3906d1661869b5fd77fa30bd8dc9e84c15fad9dba513c",
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
    upToken: "0x9b62afa5070276b3203c6a4f1b34bfc61ab93fba",
    downToken: "0x8dbbdbf1ff42049b8e206488d3e96f51e3143f0b",
    underlyingToken: "0x5c0dfc72cd02cbff99133dbea71d57526a6c8f3d",
    invalidToken: "0x023f6f1a27f983e10378fd0768a0e79ddcb95706",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x8b659e9755f203d5597bc59d7a03d1c19604aaf1",
    parentMarketOutcome: 19,
    conditionId:
      "0x2aa401b9933ce249e9ad6704fe1270dd051172e1371141ccdeb08baa29d8372d",
    details: {
      imdbURL: "https://www.imdb.com/title/tt0090315/",
      posterURL:
        "https://upload.wikimedia.org/wikipedia/en/b/b6/When_the_Wind_Blows_1986.jpeg",
      summary:
        "A naive elderly British rural couple survive the initial onslaught of a nuclear war.",
    },
  },
];
