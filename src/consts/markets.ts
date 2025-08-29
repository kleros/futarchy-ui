import { Address } from "viem";

export const projectsChosen = 2;

export const marketsParentOutcome = 4n;

export const parentMarket: Address =
  "0x582d1692198561a7594c5034e57340bc10621e86";

export const invalidMarket: Address =
  "0xBF9696d9a921a9F79f3d6f07556Fb7E7052a0B1D";

export const endTime: number = 1755561599;

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
  minValue: number;
  maxValue: number;
  precision: number;
  marketId: Address;
  details: IDetails;
  conditionId: `0x${string}`;
}

export const markets: Array<IMarket> = [
  {
    name: "Armenian lentil soup by chef Carl and Sharfy",
    color: "#E6194B",
    upToken: "0x4d14D2c9cfa9Fbad1a2c37e861613B39811b5930",
    downToken: "0x1e28C4aA38b58075995303AB65f43351381F44e5",
    underlyingToken: "0xA208E85696Cd7723e7FFBf7394977929ecb848eE",
    minValue: 0,
    maxValue: 10,
    precision: 1,
    marketId: "0x966A88Fb357FAc86004beB9618Fb76B39aaD146d",
    conditionId:
      "0x1998e68781b600d412d5e7dc5f5600a1fe061020cb08b793391faf08cd4551d3",
    details: {
      summary: "Meal prepared by chef Carl and Sharfy on Tuesday 28th of July.",
    },
  },
  {
    name: "Rests by chef Nidhi",
    color: "#3CB44B",
    upToken: "0xAc0d139040CA273348b87fA7cE5a29313e71DdC3",
    downToken: "0x6f3d0aF35C1593659db3f53D51399D58B8729f43",
    underlyingToken: "0x9D92FD3E34b05110988F7e69ee1C8980016aA6C4",
    minValue: 0,
    maxValue: 10,
    precision: 1,
    marketId: "0xbD77A9454f4dBB99a22eEa1FEbd4a0380f9Ff5B7",
    conditionId:
      "0xe164ff8c0eb2ce35e7577c834450b0f7c5a400384bbaac608614f0b6234b5d7f",
    details: {
      summary: "Meal prepared by chef Nidhi on Thursday 29th of July.",
    },
  },
  {
    name: "Crêpes by chef Clément",
    color: "#FFA500",
    upToken: "0xa12B6c17068BbeD4D67898FbC9630B5A32e02319",
    downToken: "0x34802E9d1C06b846d4B6b3e56FfA2Bde4259E582",
    underlyingToken: "0x73ADB9f2907839833A96721b41AEAE4Ba37BfC09",
    minValue: 0,
    maxValue: 10,
    precision: 1,
    marketId: "0xF681F411466bdBDA81384Da94C9FFD4D53e807e4",
    conditionId:
      "0xa656847808341964a1223418a18b519df76566b48ee32c65d0a30897284f41cf",
    details: {
      summary: "Meal prepared by chef Clément on Friday 30th of July.",
    },
  },
  {
    name: "Takeout Sandwiches",
    color: "#911EB4",
    upToken: "0x808000c9001BE6665F9Aa2Ac608C908830DFD0bC",
    downToken: "0xC418B2885925Dfe063BdAa0ad801104788a5105F",
    underlyingToken: "0x7cf8005B84ea5413f339Cdc711F918a834A52110",
    minValue: 0,
    maxValue: 10,
    precision: 1,
    marketId: "0x93D5F295f714f4b425E3E74523eD6FDF75754B1a",
    conditionId:
      "0xeed90eb06cd31126b544abb589b320107b4aae29fc19562b01764ba6a056add2",
    details: {
      summary: "Takeout sandwiches on Monday 4th of August.",
    },
  },
  {
    name: "Indian-Spanish fusion by Nidhi/Carlos/David.",
    color: "#46F0F0",
    upToken: "0x2D14505D0551F58236469c09945d9114aFF22bdc",
    downToken: "0x4A82570C62f57C25228D694a1616C17B1e2fd894",
    underlyingToken: "0x81b1d03fD5Ca06A801ECa2259446D2c9b2237d1C",
    minValue: 0,
    maxValue: 10,
    precision: 1,
    marketId: "0xe93b7cE7911B16f5E72C2Bb347fBcE8f81BAc69F",
    conditionId:
      "0xaffd86c9d68bf40f00a54e97709f37d2cb937ae3e406553911be1779174fec71",
    details: {
      summary: "Meal prepared by Nidhi/Carlos/David on Tuesday 5th of August.",
    },
  },
];
