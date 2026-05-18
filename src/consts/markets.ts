import { Address } from "viem";

import { deriveMarketRangeFromInvestment } from "@/utils/marketRange";

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

// TODO: update to latest
export const projectsChosen = 1;

export const parentMarket: Address =
  "0x81759938fa04b056665101e1310d8e952278cfea";

export const parentConditionId =
  "0x99620cbd56c47f85faebea20eb0c8942265d40c5078ff6503b09b6bd9f377afd";

export const invalidMarket: Address =
  "0x78E1CEd3131d34242F375781a608459F5d125bBD";

// in unix timestamp, seconds
export const startTime: number = 1779121721;
export const endTime: number = 1781721000;
export const endDate: string = "Wednesday 17th June 00:00 UTC";

export interface IMarket {
  name: string;
  color: string;
  upToken: Address;
  downToken: Address;
  underlyingToken: Address;
  invalidToken: Address;
  marketId: Address;
  parentMarketOutcome: number;
  realtContract: Address;
  conditionId: `0x${string}`;
  initialInvestmentUsd: number;
  minValue: number;
  maxValue: number;
  precision: number;
}

export const marketMetadata = {
  name: "RealT Properties Predictions",
  question: "If evaluated, what is the current price of the property?",
  questionDescription:
    "Which property will be selected for evaluation as a part of “RealT Properties Predictions”? \nAnd for the selected property, what price will that property be appraised at?",
};

export const markets: IMarket[] = [
  {
    name: "23750 W 7 Mile",
    color: "#E6194B",
    upToken: "0xe454cd972be39d35e66859d5e17fad62d2e89c2d",
    downToken: "0x3014cc3a9d0f75df628a4fcede81913bf3245146",
    underlyingToken: "0xf627c1ab254c501b50af998ff445bf46160ed028",
    invalidToken: "0x54f75c5c2f86142048c52f147f48c9502acc1bed",
    marketId: "0x5e2740e18d4aa1902985930b1cbc84bc4c6f7bc6",
    parentMarketOutcome: 0,
    conditionId:
      "0xcc89d5865421ce1994c456dd52b6492d11d49b2d585a51dc3effd05bc28903d6",
    realtContract: "0x0f388d7e65a969dbcbfab21bc3ab6629af78f4cf",
    initialInvestmentUsd: 944_537,
    precision: 1,
    ...deriveMarketRangeFromInvestment(944_537),
  },
  {
    name: "18881 Mound",
    color: "#3CB44B",
    upToken: "0xb3ce7989e21db61981d22459a1a3c0c796abf1d1",
    downToken: "0x8965553deabcc18e12f399b4a96ddf91a164e01c",
    underlyingToken: "0x430ac881c8939db9972e7c2db22f6f2f84e6d24f",
    invalidToken: "0xc72904116695779b66fb1a597f9217535055be3e",
    marketId: "0x65a993a2e1f5fb0e74bf8457d22594da80acd6d7",
    parentMarketOutcome: 1,
    conditionId:
      "0xc213303d3ee24e33984273b92d571dc546a47312608601a72382b7f3265d7d4b",
    realtContract: "0x5c4e3fa9704d4212c6434190af6379cfbda47e13",
    initialInvestmentUsd: 336_340,
    precision: 1,
    ...deriveMarketRangeFromInvestment(336_340),
  },
  {
    name: "14631-14633 Plymouth",
    color: "#FFD93D",
    upToken: "0x9fd2e6608b53e0e505b1c344ca548a17f64ad99c",
    downToken: "0xf0f389404e319fdaedb5c4c97f75976a6b3ee55c",
    underlyingToken: "0xeb7a7b1874deb358556042fd5fa0d58cdf040b13",
    invalidToken: "0xc932da176714cd99d11b24285c2b0af8f8d180d0",
    marketId: "0x9567de50523c1a45d96d8f08d8eb89c436aef9ee",
    parentMarketOutcome: 2,
    conditionId:
      "0x32b55332f1dc7447068de66a8bce47cfba81b384cc5e698d7481fa9f98cbd876",
    realtContract: "0x854a0cfa24012937d3d15682ecc3d5b474bfa97e",
    initialInvestmentUsd: 1_389_025,
    precision: 1,
    ...deriveMarketRangeFromInvestment(1_389_025),
  },
  {
    name: "11373 Prest",
    color: "#6BCB77",
    upToken: "0x194a4c7c4733f1c2339e3bb417409e80cb7c6771",
    downToken: "0x91ad49fecc87fb1872527374abbac3f99478ebdf",
    underlyingToken: "0x502c3696909002f81f835de44fd4cdc7963c7ba4",
    invalidToken: "0xae24a579d44ecf6e446d7443c781c416d8369326",
    marketId: "0xf2062f251087d9fcb94d906c585bc9cf246d7e13",
    parentMarketOutcome: 3,
    conditionId:
      "0xc63d6def0dc3ebf07f05230a88aa0860a3a495f0571a5deec998725ddb5a6f38",
    realtContract: "0xd8b19f31186fc7350be018651aa1383175923bb3",
    initialInvestmentUsd: 76_806,
    precision: 1,
    ...deriveMarketRangeFromInvestment(76_806),
  },
  {
    name: "16728-16730 Woodingham",
    color: "#4D96FF",
    upToken: "0x93f654c9075b5e511d8c2def0c12837041ed7668",
    downToken: "0xa6dda6de987092d000e57a1b0d61a6bbc81cc2c1",
    underlyingToken: "0x68410953112ea147492b3172636be14aed130e2a",
    invalidToken: "0x0db78ba293f18346ca56844a96b1ed987399f167",
    marketId: "0x79d73cf4b48028f5642c174847fab5765c6ca4f7",
    parentMarketOutcome: 4,
    conditionId:
      "0x3cf23a4969d8982e1f53705012b399c7ad3e4d893d1d9145b1a18d8e2c927535",
    realtContract: "0xc7697f5e86a102eaf4000719a2dc477d65beea7d",
    initialInvestmentUsd: 143_897,
    precision: 1,
    ...deriveMarketRangeFromInvestment(143_897),
  },
  {
    name: "9518 Franklin",
    color: "#845EC2",
    upToken: "0x9ff9b462c422802b3d7576d07ca749e484624532",
    downToken: "0x0d671d7a398f92c356587761f2fe05ad90d57022",
    underlyingToken: "0xfde72fd1930d2fe58b885899c8ef6700c1531207",
    invalidToken: "0x3c41d4d6bf3eaa64eee71a3182d43af32179e6fd",
    marketId: "0xa0be79657446c1e999aed43240f4e51ab5f57b43",
    parentMarketOutcome: 5,
    conditionId:
      "0x9a81564c2aeaf1c9bf0435ef6ddc204b7d61618f2e0228b163e5b82c9f00d956",
    realtContract: "0x4ae9d3343bbc6a894b7ee7f843c224c953f1661b",
    initialInvestmentUsd: 461_643,
    precision: 1,
    ...deriveMarketRangeFromInvestment(461_643),
  },
  {
    name: "8034 Faith",
    color: "#FF9671",
    upToken: "0x9d56ba8c10fc54634ebd98704aaa14d0aaa5f696",
    downToken: "0x9bac576d365a761c86ac8bb9520233b79540295c",
    underlyingToken: "0x334db733779bfeeb6c55016e7cdd2ab4d2410c81",
    invalidToken: "0xc854f228b785f61109622bbabdb21261125c061b",
    marketId: "0x705b3a807a5292de13caa74653aed08bf28da925",
    parentMarketOutcome: 6,
    conditionId:
      "0x3a9eb779e8c1f55ae4fbe39f1a685632e0a533bbc3e20c053725d4c4f34a1a1d",
    realtContract: "0x90d280b6456f8233e115e6aabb2ca89249dafd39",
    initialInvestmentUsd: 327_296,
    precision: 1,
    ...deriveMarketRangeFromInvestment(327_296),
  },
  {
    name: "1769 Cheryl",
    color: "#0081CF",
    upToken: "0xe76380508f562b02227d9142cb8e0817ebf8c5eb",
    downToken: "0xca877b196d3c3678382a9b1a4b39dc5f796c2ba7",
    underlyingToken: "0xffd48b89e73bb5c1ff71c9c1e19fe7c3da34649a",
    invalidToken: "0xe7289a855f7fd0e03855ab784df448f4b573071f",
    marketId: "0x4e9ad039f4660deee317d278dfb18e5f0826db11",
    parentMarketOutcome: 7,
    conditionId:
      "0xbb581276e52669477ed3c4939089f865d4922c4c0dff64af27d84e71d157db9e",
    realtContract: "0x19f824662ba9df78e368022f085b708fccc201c8",
    initialInvestmentUsd: 307_272,
    precision: 1,
    ...deriveMarketRangeFromInvestment(307_272),
  },
  {
    name: "9311 Bedford",
    color: "#FFC75F",
    upToken: "0x992811ff3f617f8a873479bd26eace30c68bae1e",
    downToken: "0xbf83818f00d320d21f2c0778e84442fdcfaed02c",
    underlyingToken: "0xdd3cc8529ef123f0335ef7b797ac0ff982005457",
    invalidToken: "0x0d44b4ae8f66a163b996aa2d2a7c96018f1dc786",
    marketId: "0x884b265f85f2b735b9648ffe560a672ba297ca45",
    parentMarketOutcome: 8,
    conditionId:
      "0xc879850a56ad17be855eb5bc3cddf55b4c8095b2fadb82e63de35ccb8ea2bc84",
    realtContract: "0xa83cbd26964ea953f86c741871a1ab2a256cb82d",
    initialInvestmentUsd: 90_270,
    precision: 1,
    ...deriveMarketRangeFromInvestment(90_270),
  },
];
