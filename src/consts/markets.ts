import { Address } from "viem";

export const projectsChosen = 1;

export const marketsParentOutcome = 1n;

export const parentMarket: Address =
  "0x6f7ae2815e7e13c14a6560f4b382ae78e7b1493e";

export const parentConditionId =
  "0x0d6c99d7eb9fa657236905b6cf464eaa938371ae5ce8cf153af450321377241d";

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
    name: "Judge Dredd (1995)",
    color: "#E6194B",
    upToken: "0x0ee25eb2e22c01fa832dd5fea5637fba4cd5e870",
    downToken: "0x4abea4bf9e35f4e957695374c388cee9f83ca1d0",
    underlyingToken: "0xb72a1271caa3d84d3fbbbcbb0f63ee358b94f96a",
    minValue: 0,
    maxValue: 100,
    precision: 1,
    marketId: "0x105d957043ee12f7705efa072af11e718f8c5b83",
    conditionId:
      "0x3d963acd72df546f58bf4ea76fda6957c830e6e3f8965517c396fc76dc2c08a3",
    details: {
      imdbURL:
        "https://www.imdb.com/title/tt0113492/?ref_=nv_sr_srsg_0_tt_8_nm_0_in_0_q_judge%2520dredd",
      posterURL:
        "https://resizing.flixster.com/BsX7kI5BwBsc9xSQPEt5ddA3PI4=/206x305/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p16918_p_v8_ae.jpg",
      summary:
        "In a dystopian future, Joseph Dredd, the most famous Judge (a police officer with instant field judiciary powers), is convicted for a crime he did not commit and must face his murderous counterpart.",
    },
  },
  {
    name: "Bacurau (2019)",
    color: "#3CB44B",
    upToken: "0x028ec9938471bbad5167c2e5281144a94d1acbe9",
    downToken: "0x53f82c3f6836dcba9d35450d906286a6ea089a26",
    underlyingToken: "0xcb1f243baaf93199742e09dc98b16fc8b714b67c",
    minValue: 0,
    maxValue: 100,
    precision: 1,
    marketId: "0x68af0afe82dda5c9c26e6a458a143caad35708d6",
    conditionId:
      "0xa4cc97a4e4f6e02c546a5b3bb49e2c411dcb4c6dcd478cef9cd0c86605c59878",
    details: {
      imdbURL:
        "https://www.imdb.com/title/tt2762506/?ref_=nv_sr_srsg_0_tt_7_nm_1_in_0_q_bacura",
      posterURL:
        "https://resizing.flixster.com/MUNwK1o6mdxwkgj-2v86bWf6xXM=/206x305/v2/https://resizing.flixster.com/-cGVSNCtYaLQDwteIiI9LUMoqJ0=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2Y3NWE5YWNjLTRlNzktNGEzYi05NTg5LWNhOTBiYTJlODM1OC53ZWJw",
      summary:
        "After the death of her grandmother, Teresa comes home to her matriarchal village in a near-future Brazil to find a succession of sinister events that mobilizes all of its residents.",
    },
  },
];
