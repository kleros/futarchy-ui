import { Address } from "viem";

import { sDaiAddress } from "@/generated";

export interface IMarket {
  name: string;
  details: string;
  color: string;
  upToken: Address;
  downToken: Address;
  underlyingToken: Address;
  minValue: number;
  maxValue: number;
  precision: number;
  marketId: Address;
}

export const markets: Array<IMarket> = [
  {
    name: "Movie A",
    details: "aaaaaa",
    color: "#D14EFF",
    upToken: "0x330797721e4F9773c02Ab6165292777E879E43f8",
    downToken: "0x8932198b384F8cb090bBE825cF0a1061f436F053",
    underlyingToken: sDaiAddress as `0x${number}`,
    minValue: 0,
    maxValue: 100,
    precision: 1,
    marketId: "0xa77dd0d6988f0f79b056d3196fa67f2488370909",
  },
  {
    name: "Movie B",
    details: "aaaaaa",
    color: "#FF9900",
    upToken: "0xf120b61ecbebf0f33ec95b0169c326f2c4bf78cc",
    downToken: "0xa2e01c7fac0ed1e06aca4a612a533b6d63070216",
    underlyingToken: sDaiAddress as `0x${number}`,
    minValue: 0,
    maxValue: 100,
    precision: 1,
    marketId: "0x19AEAa9495d865FdbB7699C595F6ECc4575a4dcd",
  },
];
