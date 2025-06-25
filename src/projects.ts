import { sDaiAddress } from "@/generated";

interface IProject {
  name: string;
  details: string;
  color: string;
  upToken: string;
  downToken: string;
  underlyingToken: `0x${number}`;
  minValue: number;
  maxValue: number;
  precision: number;
  marketId: string;
}

export const projects: Array<IProject> = [
  {
    name: "Project 1",
    details: "aaaaaa",
    color: "red",
    upToken: "0x330797721e4F9773c02Ab6165292777E879E43f8",
    downToken: "0x8932198b384F8cb090bBE825cF0a1061f436F053",
    underlyingToken: sDaiAddress as `0x${number}`,
    minValue: 0,
    maxValue: 4,
    precision: 10,
    marketId: "0xa77dd0d6988f0f79b056d3196fa67f2488370909",
  },
  {
    name: "Project 2",
    details: "aaaaaa",
    color: "blue",
    upToken: "0x330797721e4F9773c02Ab6165292777E879E43f8",
    downToken: "0x8932198b384F8cb090bBE825cF0a1061f436F053",
    underlyingToken: sDaiAddress as `0x${number}`,
    minValue: 0,
    maxValue: 4,
    precision: 10,
    marketId: "0x19AEAa9495d865FdbB7699C595F6ECc4575a4dcd",
  },
  {
    name: "Project 3",
    details: "aaaaaa",
    color: "green",
    upToken: "0x330797721e4F9773c02Ab6165292777E879E43f8",
    downToken: "0x8932198b384F8cb090bBE825cF0a1061f436F053",
    underlyingToken: sDaiAddress as `0x${number}`,
    minValue: 0,
    maxValue: 4,
    precision: 10,
    marketId: "0xa77dd0d6988f0f79b056d3196fa67f2488370909",
  },
  {
    name: "Project 4",
    details: "aaaaaa",
    color: "orange",
    upToken: "0x330797721e4F9773c02Ab6165292777E879E43f8",
    downToken: "0x8932198b384F8cb090bBE825cF0a1061f436F053",
    underlyingToken: sDaiAddress as `0x${number}`,
    minValue: 0,
    maxValue: 4,
    precision: 10,
    marketId: "0xa77dd0d6988f0f79b056d3196fa67f2488370909",
  },
];
