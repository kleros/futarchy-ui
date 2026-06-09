import { Address } from "viem";

export const positionExplainerLink =
  "https://kleros.notion.site/Kleros-Foresight-Advanced-Guide-What-Actually-Happens-After-Your-First-Prediction-30d9a9db4f0880f8a44ecb13d34ad3c6#30d9a9db4f0881969c23e8152ab1146d";

export const appGuideLink =
  "https://kleros.notion.site/Kleros-Foresight-Beginner-User-Guide-30d9a9db4f088064a588f7d5acc2751f";

export const faqLink =
  "https://kleros.notion.site/Kleros-Foresight-Beginner-User-Guide-30d9a9db4f088064a588f7d5acc2751f#30d9a9db4f088138a266e870c56159e0";

export const beginnerUserGuide =
  "https://kleros.notion.site/Kleros-Foresight-Beginner-User-Guide-30d9a9db4f088064a588f7d5acc2751f";

export const advancedUserGuide =
  "https://kleros.notion.site/Kleros-Foresight-Advanced-Guide-What-Actually-Happens-After-Your-First-Prediction-30d9a9db4f0880f8a44ecb13d34ad3c6";

export const tgLink = "https://t.me/+HrYn_tzqTGFlYTc0";

export const seerMarketLink =
  "https://app.seer.pm/markets/100/which-movies-will-clement-watch-as-part-of-the-distilled-clements-judgement-expe-3";

// TODO: update to latest
export const projectsChosen = 5;

export const parentMarket: Address =
  "0x6b182ffe23a9df5f5bfb2e9b6b4ce5716e84ab1f";

export const parentConditionId =
  "0x72ae8f9929c0e485bdf0f054f53ca9d55c6e27bc356732ea2f0eb775ae435920";

export const invalidMarket: Address =
  "0x8FD01b1879AC2D141ddb4514F13c7C06E11c9938";

// in unix timestamp, seconds
export const startTime: number = 1780617600;
export const endTime: number = startTime + 30 * 24 * 60 * 60;
export const endDate: string = "Sunday, 5 July 2026 00:00 UTC";

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
  name: "Distilled Clément's Judgement - Session 2",
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
    name: "Anatomy of a Fall (2023)",
    color: MARKET_COLORS[0],
    upToken: "0x967c2c9449855ac7c68b7abfabc2321cb68a6190",
    downToken: "0x5bfbe9307156c984a6c88ed8d91fd6e17d1738b9",
    underlyingToken: "0x48e99311f273375e17f5a030324bb9ac8372aa1d",
    invalidToken: "0x5f0096d28b0f1cee3e3e7ef4ebe72f62f2625184",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x500753632d2787dc33f0c891c228b8e33755e2c8",
    parentMarketOutcome: 0,
    conditionId:
      "0xfd443bca42916c670e6363566260f92beda5ac2432aab17b3224916ea8db2057",
    details: {
      imdbURL: "https://www.imdb.com/title/tt17009710/",
      posterURL:
        "https://upload.wikimedia.org/wikipedia/en/8/88/Anatomy_of_a_Fall_%282023%29_film_poster.jpg",
      summary:
        "A writer stands trial for her husband's death at their remote chalet, while their blind son wrestles with whether he witnessed the truth.",
    },
  },
  {
    name: "Les Misérables (2012)",
    color: MARKET_COLORS[1],
    upToken: "0x238bf04f081e973872fdf4c886c1bfbac8bf79fe",
    downToken: "0xb9e3a26b7ee054af700ed3ff01665bcab3a84dca",
    underlyingToken: "0xc43e91405bfbdef25861a6b68e390f6036e6b365",
    invalidToken: "0xbb0747df5a07ae4ed77ba1f54ba857745d3c1d07",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x8f0f575b91999d857249cf909ca93e01ec104607",
    parentMarketOutcome: 1,
    conditionId:
      "0x51490ca267fd6bab25d5600aa4f4664a3fb340196e1867e977fdb3c223d207e6",
    details: {
      imdbURL: "https://www.imdb.com/title/tt1707386/",
      posterURL:
        "https://upload.wikimedia.org/wikipedia/en/0/05/Les_Mis%C3%A9rables_2019_film_poster.jpg",
      summary:
        "After a police sting goes wrong in a Paris banlieue, an anti-crime squad patrols a tense housing project where a new officer witnesses escalating brutality.",
    },
  },
  {
    name: "American Sniper (2014)",
    color: MARKET_COLORS[2],
    upToken: "0x45726ec447f3870313f66f18f850d9e606f89d66",
    downToken: "0x7a6c6d455b1dd72424f9c38f2720a44acb5d3610",
    underlyingToken: "0x3bdd96d52f517b8b36ed25f46e8d98e603a30d20",
    invalidToken: "0x69983f6fc5225d567f6aac68c803dac9b02e82df",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x7b3e2fb92f24303eb1d379d041eaa94e8a1eb04d",
    parentMarketOutcome: 2,
    conditionId:
      "0x96426fa3c094337e6c78ea11a3787ce9ccf63e0e53779d954cd1b6e889bb4a3c",
    details: {
      imdbURL: "https://www.imdb.com/title/tt2179136/",
      posterURL:
        "https://upload.wikimedia.org/wikipedia/en/1/10/American_Sniper_poster.jpg",
      summary:
        "Navy SEAL sniper Chris Kyle becomes a legend on the battlefield in Iraq, but his skill and the war take a heavy toll on his life back home.",
    },
  },
  {
    name: "Top Gun: Maverick (2022)",
    color: MARKET_COLORS[3],
    upToken: "0x66b52fc7c7574eae684c0c43f24a49fd4c5a0a7c",
    downToken: "0xff9e4c1e1bd2e646745b13de888748096896afe7",
    underlyingToken: "0x43ec5b66d596abb631b4c9c884d184899ca7bf52",
    invalidToken: "0xaac3a1ed8aadd3b5ab82af0d1dc0bb9fe5ebe013",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x49312327caf9f981a85ee08a8e415f1a15093791",
    parentMarketOutcome: 3,
    conditionId:
      "0x42a1615f88d589e1135f2c891cc2d26c44b5d815c758e2a3d305a5ecbbdfb870",
    details: {
      imdbURL: "https://www.imdb.com/title/tt1745960/",
      posterURL:
        "https://upload.wikimedia.org/wikipedia/en/1/13/Top_Gun_Maverick_Poster.jpg",
      summary:
        "Decades after Top Gun, Maverick trains elite pilots for a dangerous mission while confronting his past and the son of his late best friend.",
    },
  },
  {
    name: "Thor (2011)",
    color: MARKET_COLORS[4],
    upToken: "0x388d554356ccfe6f414c02f70cda3dba999896b5",
    downToken: "0x9933d36b508d52899f8b3c57f5705a0c8a913834",
    underlyingToken: "0x3b3ee3bb10f1c67b07ab30a6d41f4b70a60ccae8",
    invalidToken: "0xdbed44d21941f0d99594b7380d0f0e4faf0f6b87",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x8cb5c56f7acb92b005383f73eb7f3b18caf60896",
    parentMarketOutcome: 4,
    conditionId:
      "0xe3bda46d820c58664dc1b801a8956cab65b75678c06beeb7394eb9259b5422cb",
    details: {
      imdbURL: "https://www.imdb.com/title/tt0800369/",
      posterURL:
        "https://upload.wikimedia.org/wikipedia/en/9/95/Thor_%28film%29_poster.jpg",
      summary:
        "Banished to Earth and stripped of his powers, the arrogant god Thor must learn humility while his brother Loki schemes to seize the throne of Asgard.",
    },
  },
  {
    name: "The Menu (2022)",
    color: MARKET_COLORS[5],
    upToken: "0x4b833793b98cf7fd561bc3b1bed8ff0ca89110a2",
    downToken: "0x1076e6c5043cb5eb391b2e80a219398e51b08ca5",
    underlyingToken: "0xdd488b509bd680d56e3d500c51d721bbcc8b9e9a",
    invalidToken: "0x4304a98223b658f3c2ffaa6d8d176c0aad352418",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0xfe2c4e911009c73989063cae5b55ae87a552da14",
    parentMarketOutcome: 5,
    conditionId:
      "0xf9fa567109e853a0198f7447ca4bc0a3bf30c7dc4fb765f53978d3c16a1295dd",
    details: {
      imdbURL: "https://www.imdb.com/title/tt9764362/",
      posterURL:
        "https://upload.wikimedia.org/wikipedia/en/d/db/The_Menu_%282022_film%29.jpg",
      summary:
        "A couple travels to a remote island for an exclusive dinner, where the celebrity chef serves a lavish tasting menu with horrifying surprises.",
    },
  },
  {
    name: "My Neighbor Totoro (1988)",
    color: MARKET_COLORS[6],
    upToken: "0xd61a865ac9409aa4198e1bb84d7c28ed88710c81",
    downToken: "0xe703c82b4511fb2fcece2787373350fb55c49811",
    underlyingToken: "0xc4bd2db6ef8211e57974d07361bba5d8452283cc",
    invalidToken: "0x7a7745172bc511e241b11d05b27123379eb3163e",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0xef3c87d93df2b8c373b9c21f9bf1c6c2f8b587c6",
    parentMarketOutcome: 6,
    conditionId:
      "0xf1fc4619948ef32754e6765cf0cdcade45203bda0615e2248cc38517caccadd4",
    details: {
      imdbURL: "https://www.imdb.com/title/tt0096283/",
      posterURL:
        "https://upload.wikimedia.org/wikipedia/en/0/02/My_Neighbor_Totoro_-_Tonari_no_Totoro_%28Movie_Poster%29.jpg",
      summary:
        "Two young sisters who move to the countryside discover friendly forest spirits, including the gentle giant Totoro, in postwar rural Japan.",
    },
  },
  {
    name: "The Animatrix (2003)",
    color: MARKET_COLORS[7],
    upToken: "0x6d48f3b0ae3ec4759536a3935372f94f35fd087b",
    downToken: "0x56f3eea0668400d8b225ef2433679d3d0f15f552",
    underlyingToken: "0xdb8b4a8febdb9ecdb73312d524255b6832fe3e76",
    invalidToken: "0x8cb225d3464ba7e5ec12bec1889fcfe8fa1b8185",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x8187931ab39b5c635ce4ddb2ea9bbf41e925be7b",
    parentMarketOutcome: 7,
    conditionId:
      "0x53543ebfa0679a0b1e25726b0648c09f5a333cf84d39fb3fd810d1d2e45d2050",
    details: {
      imdbURL: "https://www.imdb.com/title/tt0328832/",
      posterURL:
        "https://upload.wikimedia.org/wikipedia/en/d/d2/The-animatrix-poster.jpeg",
      summary:
        "Nine animated short films expand the Matrix universe, exploring backstories and side stories from the Wachowskis' sci-fi world.",
    },
  },
  {
    name: "Passengers (2016)",
    color: MARKET_COLORS[8],
    upToken: "0x89ea42a0fd5e6ea4634e4e58eb9a43e7408240c2",
    downToken: "0xb39db49b49ba52c758e80a6ce6df13af478a5734",
    underlyingToken: "0x6ca7fb2edb8e99713197c421ff3672c2c0baffe6",
    invalidToken: "0x9fb8f8011ab03346fee456b4b79d1dc79c13e0e9",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0xac5475709469db331a3ba2662e9545c1067e8b5f",
    parentMarketOutcome: 8,
    conditionId:
      "0x0bfac68fa16de2643a3dae50563c511f870ef314b511331134cc3cd5e5e28287",
    details: {
      imdbURL: "https://www.imdb.com/title/tt1355644/",
      posterURL:
        "https://upload.wikimedia.org/wikipedia/en/8/8e/Passengers_2016_film_poster.jpg",
      summary:
        "Two passengers on a sleeper ship to a distant colony awaken ninety years early and must decide whether they can build a life together.",
    },
  },
  {
    name: "The Killing of a Sacred Deer (2017)",
    color: MARKET_COLORS[9],
    upToken: "0x17cc453ccc96a2d5501a3fa4fb7c1052c2e1bb75",
    downToken: "0x408bbfb7546b6c5d030347cf4b60296f9cf22c21",
    underlyingToken: "0xc14918bd67e011ea538c75c84a5ee9ac6cadffbb",
    invalidToken: "0x04de943c4636a182b7c112c32a45049ee3249918",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x2798493f6d53627aa59880d83be95cb901a3a8ce",
    parentMarketOutcome: 9,
    conditionId:
      "0x8b47e5ff9491428c4d57da2416a335e616155b623a51e2b890e575abb0384573",
    details: {
      imdbURL: "https://www.imdb.com/title/tt5715874/",
      posterURL:
        "https://upload.wikimedia.org/wikipedia/en/8/8f/The_Killing_of_a_Sacred_Deer.png",
      summary:
        "A renowned surgeon befriends a teenage boy linked to his past, and when his family falls inexplicably ill, he faces an impossible moral demand.",
    },
  },
  {
    name: "Childhood's End (2015)",
    color: MARKET_COLORS[10],
    upToken: "0x754a0db2ece55985c9b044dad78261d6c105d845",
    downToken: "0x4605f461e6b4998fd70b718fb988d03faa816155",
    underlyingToken: "0x93847f29e302d1ec2f1e403083e0a5dba9e2124e",
    invalidToken: "0x34c13ec7aa59137ffc1f75451d3bd11c1b222beb",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x7ac9b38515a0573d30284459151c6b2d675a535c",
    parentMarketOutcome: 10,
    conditionId:
      "0x302e4e7b2a205ddcce662e00777a3c24612d6c91960b6794f752773caf5d0753",
    details: {
      imdbURL: "https://www.imdb.com/title/tt4146128/",
      posterURL:
        "https://upload.wikimedia.org/wikipedia/en/c/c5/Childhoods_End.jpeg",
      summary:
        "Quiet alien overlords bring decades of global peace, but as humanity merges into a greater mind, the cost of utopia becomes terrifyingly clear.",
    },
  },
  {
    name: "Starship Troopers (1997)",
    color: MARKET_COLORS[11],
    upToken: "0xbe5a3c21bb6c7693e8b90c441bbd768b4edfb8d5",
    downToken: "0x55a3cb76ef3e5be6dd1505a4804220c10df2e543",
    underlyingToken: "0x76152d5d43bdab7c334976bc55abd75eef7a8616",
    invalidToken: "0x3fae95ab95757ca28fa59263bf4786fcf36a936e",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0xa9cb10f9bbcda4c0295e3fc00e626677d56355d2",
    parentMarketOutcome: 11,
    conditionId:
      "0xe50814656d9819f66520cb6938325193298060ada3d79189fa0c08e6b3d73780",
    details: {
      imdbURL: "https://www.imdb.com/title/tt0120201/",
      posterURL:
        "https://upload.wikimedia.org/wikipedia/en/d/df/Starship_Troopers_-_movie_poster.jpg",
      summary:
        "In a militarized future, young Johnny Rico joins the Mobile Infantry to fight giant alien bugs across the galaxy in satirical sci-fi action.",
    },
  },
  {
    name: "The Abyss (1989)",
    color: MARKET_COLORS[12],
    upToken: "0x7e6f2d518b629139d61d96c9dff1209d6909e70a",
    downToken: "0x4f7768f59a232db901fd727a445cb4bc22bfc18c",
    underlyingToken: "0x1355d1ed3fac25d89b13f4dc3d8e9b5794003e6a",
    invalidToken: "0x2dbcf02936d8b6b510c2ce662b3724b45dcebe05",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0xadc0f1ddd02671db80010dddb6cf94d72c7ee933",
    parentMarketOutcome: 12,
    conditionId:
      "0x985eaff71339527c99d6221dea84478e7b660f661cd8c43fc3792af3cf297237",
    details: {
      imdbURL: "https://www.imdb.com/title/tt0096754/",
      posterURL: "https://upload.wikimedia.org/wikipedia/en/a/ad/TheAbyss.jpg",
      summary:
        "A deep-sea oil-rig crew joins a Navy salvage team to rescue a sunken nuclear sub and encounters something extraordinary on the ocean floor.",
    },
  },
  {
    name: "Ghost in the Shell (1995)",
    color: MARKET_COLORS[13],
    upToken: "0xb32a17a7fe0202b3b670137cea74358771ee46ee",
    downToken: "0x3eeacab5ec695df0b80697ab85e09a1393ce7abc",
    underlyingToken: "0x4ea57352c40d6b1797a6b6a6fefa4c83316a8979",
    invalidToken: "0x610d9136441764a580a55cf19c49455d57daefa4",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0xf5825dfa8f433f596583c157791f9d4781d159b1",
    parentMarketOutcome: 13,
    conditionId:
      "0xb96fd52ef04ddb6712643e081e1ca9c355757f0dedea1257b8e04fb354531225",
    details: {
      imdbURL: "https://www.imdb.com/title/tt0113568/",
      posterURL:
        "https://upload.wikimedia.org/wikipedia/en/c/ca/Ghostintheshellposter.jpg",
      summary:
        "In near-future Japan, cyborg Major Motoko Kusanagi hunts a hacker called the Puppet Master while questioning her own identity and humanity.",
    },
  },
  {
    name: "Heretic (2024)",
    color: MARKET_COLORS[14],
    upToken: "0xbf732107bd6fbe6e0eb088f6a97cf8abe6802055",
    downToken: "0xa0450169175379d63ce5aa1992e7bf7741457026",
    underlyingToken: "0x33d3082db08fbdf77528c93dee020e77d910e3b2",
    invalidToken: "0x9767c4d0c22c21b0c31e17d9952209c16084936b",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0xbd3c0bffb63f9bcb903c5b6b9ccc4b2a6ba3a4e5",
    parentMarketOutcome: 14,
    conditionId:
      "0x5715dc76897de91b9216b36cb0c6934556cb4078c9e7f285fdd0751aab093358",
    details: {
      imdbURL: "https://www.imdb.com/title/tt28015403/",
      posterURL:
        "https://upload.wikimedia.org/wikipedia/en/c/cb/Heretic_film_poster.jpg",
      summary:
        "Two Mormon missionaries visit the remote home of a reclusive bibliophile whose hospitality turns sinister as his true intentions emerge.",
    },
  },
  {
    name: "The Big Short (2015)",
    color: MARKET_COLORS[15],
    upToken: "0xe12748f000708f8b330395d3fa2c4b96b46fb9bc",
    downToken: "0x7d754b4ccedd1ce0061b1e053cd00724fe0392ca",
    underlyingToken: "0x4b2c273a4b9ca5d80e916afaa3d216d0d6c6412f",
    invalidToken: "0x9619aab5a7641a0575ac9dbb659d46c2f1b1ea3c",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x6fcff018e0be156e323b5f949ff4ff1568c2c3eb",
    parentMarketOutcome: 15,
    conditionId:
      "0xf8bf1d768856581923af803429bda667209d7d9863f99af983856204df98d280",
    details: {
      imdbURL: "https://www.imdb.com/title/tt1596363/",
      posterURL:
        "https://upload.wikimedia.org/wikipedia/en/1/16/The_Big_Short_%282015_film_poster%29.png",
      summary:
        "Several outsiders in finance bet against the housing market and uncover the fraud and hubris that will trigger the 2008 economic collapse.",
    },
  },
  {
    name: "Cloud Atlas (2012)",
    color: MARKET_COLORS[16],
    upToken: "0x31ea41adfa09cdcb6ee256bd28bb22c879e5ffe0",
    downToken: "0x5e3c1832ffaeeba797b01365238ca1340583d1e7",
    underlyingToken: "0x499858c3aece42822c4889ac665555c293236b01",
    invalidToken: "0x9e5e9ab95e12e1af53c4ae6483e9cad2670d7e42",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x70db29dcc22822784c5760153245440aeec6428a",
    parentMarketOutcome: 16,
    conditionId:
      "0x3c6fedb5d704fd75996b8c2b98088c6aeb074ed88d62789cf1311451b100b709",
    details: {
      imdbURL: "https://www.imdb.com/title/tt1371111/",
      posterURL:
        "https://upload.wikimedia.org/wikipedia/en/2/20/Cloud_Atlas_Poster.jpg",
      summary:
        "Six interconnected stories across centuries explore how souls and actions ripple through time, from the 1840s to a distant post-apocalyptic future.",
    },
  },
  {
    name: "Mr. Nobody (2009)",
    color: MARKET_COLORS[17],
    upToken: "0x294c63c0c8a96d06e757e03cd837e1c11ce15f02",
    downToken: "0x01cc85f5fc7d4372ae475657eb3e0d2f2cd2667c",
    underlyingToken: "0xa463a8d226258f45dbca65865b0a4fb9c33e71c4",
    invalidToken: "0xa31bc323d98818cc4fada613ebdfc87e56768f18",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x9258bd1f1d172cb84e31f92c9bc08e54e90970ce",
    parentMarketOutcome: 17,
    conditionId:
      "0xe463976810553a8bf471f9201838c400ab8de0e399b97efaf6c487f48c7c57ed",
    details: {
      imdbURL: "https://www.imdb.com/title/tt0485947/",
      posterURL:
        "https://upload.wikimedia.org/wikipedia/en/3/32/Mr._Nobody_%28film_poster%29.jpg",
      summary:
        "At 118, the last mortal on Earth recounts alternate lives he could have lived, exploring choice, love, and the paths not taken.",
    },
  },
  {
    name: "Casablanca (1942)",
    color: MARKET_COLORS[18],
    upToken: "0x1907325a493f1719d891174f7f164c4896935b37",
    downToken: "0x342013a8c79f67b85647f65ab37c0dfc9816ec71",
    underlyingToken: "0x2cc229ac490ca0d67d89d42e78bc3aa02f3d1de3",
    invalidToken: "0x4a916b61c3f129a93f842cafc9d347188e570f20",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0xbcf97dea30b95c6c9e5cc502a2f75733ccbee0b6",
    parentMarketOutcome: 18,
    conditionId:
      "0xc9c35b45bc5f2fbc567f8cc15a22affbb3ca945156f3d4fb8702fa808825a6b9",
    details: {
      imdbURL: "https://www.imdb.com/title/tt0034583/",
      posterURL:
        "https://upload.wikimedia.org/wikipedia/commons/b/b3/CasablancaPoster-Gold.jpg",
      summary:
        "In wartime Casablanca, an American cafe owner must choose between love for a woman and helping her resistance leader husband escape the Nazis.",
    },
  },
  {
    name: "The Lobster (2015)",
    color: MARKET_COLORS[19],
    upToken: "0x66ac8721f56fdfbe41c45e812ce7bb4fdc6f6063",
    downToken: "0x47c944957dcf96695644de4460e1ee897b0f550c",
    underlyingToken: "0x1f97ef03a4bb3d53f2edcaf87c22f08eebea891b",
    invalidToken: "0xf805b48613a946c0a96594d8745959e017158ebc",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x85ea4a4f3d49a5d5287a7ca3c144438e3c112d42",
    parentMarketOutcome: 19,
    conditionId:
      "0xdd7f95256c547abd09da73952d7e935fe5d23f68df2e4e041bfb8900f406cdb1",
    details: {
      imdbURL: "https://www.imdb.com/title/tt3464902/",
      posterURL:
        "https://upload.wikimedia.org/wikipedia/en/9/9d/The_Lobster_%282015%29_poster.jpg",
      summary:
        "In a hotel where singles must find a partner within 45 days or be turned into an animal, one man flees into the woods to join the resistance.",
    },
  },
];
