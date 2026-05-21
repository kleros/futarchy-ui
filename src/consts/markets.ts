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

export const seerMarketLink =
  "https://app.seer.pm/markets/100/which-property-will-be-selected-for-evaluation-as-part-of-the-realt-prediction-e-3";

// TODO: update to latest
export const projectsChosen = 1;

export const parentMarket: Address =
  "0x9446c7cd29be9b0f5b7f05bfdc8a81cf83341a17";

export const parentConditionId =
  "0x0737c9d5f79d0be9a628f4f2741bc8ab8bc44677246d71526575fd8282830443";

export const invalidMarket: Address =
  "0x769FF74Ab52cA375dA2B47C10116376421A8A64c";

// in unix timestamp, seconds
export const startTime: number = 1779327180;
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
    upToken: "0xbe2513792354e1b968e978b28ba533e670b10d7a",
    downToken: "0xa31847efee83119d31ddc8d531ff96ec78528a26",
    underlyingToken: "0x643e6708becd02164ff6e8ecdab518de5e8ea65c",
    invalidToken: "0x8760c4f85092d0db379c37ede98c7ded8a402028",
    marketId: "0x7acd59be3b18a94c91b9dddcae53d62f1410240b",
    parentMarketOutcome: 0,
    conditionId:
      "0x82226df23ab46ca8ac26a677cc548c92012294cceaad8fa5b8be002bb4081737",
    realtContract: "0x0f388d7e65a969dbcbfab21bc3ab6629af78f4cf",
    initialInvestmentUsd: 944_537,
    precision: 1,
    ...deriveMarketRangeFromInvestment(944_537),
  },
  {
    name: "18881 Mound",
    color: "#3CB44B",
    upToken: "0xf6d130eaf7cb156d4af691b4e35181db2fe84a70",
    downToken: "0x7e0c7fa477a82cfffa7367dd02aea96b82dc3263",
    underlyingToken: "0x64c5fc69aaea54eedfefb1270af7cc893801e448",
    invalidToken: "0xb7e7164e1de9154af1027bd20b7aa4de3438f767",
    marketId: "0x1adc7298acb34cb59385ba007a542f59392ea9d5",
    parentMarketOutcome: 1,
    conditionId:
      "0x40935a2f9046721322018d6709b74094042a8eee7fc2db5fd0e0db8935544a16",
    realtContract: "0x5c4e3fa9704d4212c6434190af6379cfbda47e13",
    initialInvestmentUsd: 336_340,
    precision: 1,
    ...deriveMarketRangeFromInvestment(336_340),
  },
  {
    name: "14631-14633 Plymouth",
    color: "#FFD93D",
    upToken: "0xb8bc865f8a7990ae37cee6e51260c015880ed7cc",
    downToken: "0x18ed32e2aad7d445c8c72e3afee35e8357f5babd",
    underlyingToken: "0x733f14dc8c1592f46df5073651513268791014b4",
    invalidToken: "0x4beb629a302e65bac5f8e39fba7f924942424fb6",
    marketId: "0x7dfa1ea4b31f5096e5674e4e17604ebd7c6fa947",
    parentMarketOutcome: 2,
    conditionId:
      "0xfa1bdea018d1f7735354aadb531a8fbfd6cc7d2562c4950559406f5b481ccdf0",
    realtContract: "0x854a0cfa24012937d3d15682ecc3d5b474bfa97e",
    initialInvestmentUsd: 1_389_025,
    precision: 1,
    ...deriveMarketRangeFromInvestment(1_389_025),
  },
  {
    name: "11373 Prest",
    color: "#6BCB77",
    upToken: "0xcd4c6f4c2ca01a99b541c26cb6a9ff0fe6abea69",
    downToken: "0x439d40c9addf88993e8b45ea7b9587cc7160cde9",
    underlyingToken: "0x51ef0c299a67acdb28dd3e1ac71c81dcee91079d",
    invalidToken: "0x0f2662a1d632748ea5462415ced47769e4426fb2",
    marketId: "0xfdc2902d8562133073669624bc54320fc0ac975e",
    parentMarketOutcome: 3,
    conditionId:
      "0xcc70777895ce8e0e6dc979509798021a1fb143d5b1c08f23e3f438464f648f0f",
    realtContract: "0xd8b19f31186fc7350be018651aa1383175923bb3",
    initialInvestmentUsd: 76_806,
    precision: 1,
    ...deriveMarketRangeFromInvestment(76_806),
  },
  {
    name: "16728-16730 Woodingham",
    color: "#4D96FF",
    upToken: "0xab3fb717c036390fc199e19092100cc2d1f42d8e",
    downToken: "0xebd2c06c341f617818d81344c96c8e11c27597e3",
    underlyingToken: "0xab0b68be4638dad16f4e8c4493607438b99a73b0",
    invalidToken: "0x82d044d344de4bf5b3e380e0f43ab1ad23fd092b",
    marketId: "0xacfdbce48f1d217e9eaeeeb613bc69e59d1b8174",
    parentMarketOutcome: 4,
    conditionId:
      "0x9101e472cce97d8f6d47c8abe51b9346c57e90eeefb3a6b7d0d893538d771d14",
    realtContract: "0xc7697f5e86a102eaf4000719a2dc477d65beea7d",
    initialInvestmentUsd: 143_897,
    precision: 1,
    ...deriveMarketRangeFromInvestment(143_897),
  },
  {
    name: "9518 Franklin",
    color: "#845EC2",
    upToken: "0x37181ffbd521a3e062a5fa833d5bea83e35050e3",
    downToken: "0xb3125c6e54ba7fdfb2dd30e89e52eb71fa294f90",
    underlyingToken: "0x55a43c4cec7664a6515df0b7df410a56938b49f2",
    invalidToken: "0xf8b59a97bc632653187fa0fc93e2e14d2006b002",
    marketId: "0x911e310bda048be01b2ed2b6c856b8f10ee4647a",
    parentMarketOutcome: 5,
    conditionId:
      "0xa54a9d0ae7150d3f5fb637cce9ab2dc94a31d72d3acaf3814731b95c9135ed1d",
    realtContract: "0x4ae9d3343bbc6a894b7ee7f843c224c953f1661b",
    initialInvestmentUsd: 461_643,
    precision: 1,
    ...deriveMarketRangeFromInvestment(461_643),
  },
  {
    name: "8034 Faith",
    color: "#FF9671",
    upToken: "0xa867ab33e8f982f980ed0c7d11c32da71fe2c393",
    downToken: "0x1710bb5b7216481c37b0882ed447ffad5454be99",
    underlyingToken: "0xdc0f60e48eb73eea5eb6cb163033f82dd928667c",
    invalidToken: "0xbe0d50317118f413606c3bb8d3e4a43a4ad743f9",
    marketId: "0x1db74195286b284ed6bdc7ed9ec0092fa7b90bd7",
    parentMarketOutcome: 6,
    conditionId:
      "0xa30d5f5f3ffd2d23ec1ffb08878f1b76052bef8ee6d9b19eaff0cbb0c35a67cf",
    realtContract: "0x90d280b6456f8233e115e6aabb2ca89249dafd39",
    initialInvestmentUsd: 327_296,
    precision: 1,
    ...deriveMarketRangeFromInvestment(327_296),
  },
  {
    name: "1769 Cheryl",
    color: "#0081CF",
    upToken: "0x2ed11278a5da5f442b9de24ec1d2c798a6c12fb7",
    downToken: "0x85450e10ddd065cc75343fffa9b658ebaac06123",
    underlyingToken: "0xde8a6e7ebb1950ec1b5957bcc03675f2f42a607b",
    invalidToken: "0xcace59ad51b6e3b13629333796c1d756a077b9d8",
    marketId: "0x9e9aee3dc35a5d4fd9fac1f9b918aacfe9229cf7",
    parentMarketOutcome: 7,
    conditionId:
      "0x643bec3e8e883942e309f07b74a72a25129bf4530cd1c734c5510254641d8419",
    realtContract: "0x19f824662ba9df78e368022f085b708fccc201c8",
    initialInvestmentUsd: 307_272,
    precision: 1,
    ...deriveMarketRangeFromInvestment(307_272),
  },
  {
    name: "9311 Bedford",
    color: "#FFC75F",
    upToken: "0x15014f3c758a851ff57adeabff53639723ce0e85",
    downToken: "0xef3922eb753e41c4e24a7877928c280e0bebd0bd",
    underlyingToken: "0x8f20773ec4ba5f2e547282d043895680431cabf8",
    invalidToken: "0x610b3028fbd70717db25ab666d965f177356198a",
    marketId: "0x987226cc83d5d3baae096197f9708f3142c16691",
    parentMarketOutcome: 8,
    conditionId:
      "0xee5437a6e77919789498fe0b50a89da4b999ad551ab9c325b884713ea73f69f2",
    realtContract: "0xa83cbd26964ea953f86c741871a1ab2a256cb82d",
    initialInvestmentUsd: 90_270,
    precision: 1,
    ...deriveMarketRangeFromInvestment(90_270),
  },
];
