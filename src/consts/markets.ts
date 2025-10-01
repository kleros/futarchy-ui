import { Address } from "viem";

export const projectsChosen = 2;

export const marketsParentOutcome = 4n;

export const parentMarket: Address =
  "0x582d1692198561a7594c5034e57340bc10621e86";

export const parentConditionId =
  "0x4fa791cbbddce9857e1331094273e3834a4a08df5ff4e947027ca3c5eb87751c";

export const invalidMarket: Address =
  "0xBF9696d9a921a9F79f3d6f07556Fb7E7052a0B1D";

export const endTime: number = 1755561599;

export interface IDetails {
  fullName: string;
  shortName: string;
  totalInvestment: string;
  squareFeet: string;
  propertyType: string;
  grossRentYear: string;
  netRentYear: string;
  initialLaunchDate: string;
  annualPercentageYield: string;
  coordinate: string;
  marketplaceLink: string;
  images: Array<string>;
  contract: string;
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
    name: "23750 W 7 Mile",
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
      fullName: "23750 W 7 Mile Rd, Detroit, MI 48219",
      shortName: "23750 W 7 Mile",
      totalInvestment: "944,537",
      squareFeet: "11,944",
      propertyType: "Multi Family",
      grossRentYear: "159,360",
      netRentYear: "85,986",
      initialLaunchDate: "2024-12-13",
      annualPercentageYield: "9.10%",
      coordinate: "(42.429298, -83.274959)",
      marketplaceLink:
        "https://realt.co/product/23750-w-7-mile-rd-detroit-mi-48219/",
      images: [
        "https://realt.co/wp-content/uploads/2024/12/23750-W-7-Mile-front-side-1.jpg",
        "https://realt.co/wp-content/uploads/2024/12/23750-W-7-Mile-front-side-4.jpg",
      ],
      contract: "0x0f388d7e65a969dbcbfab21bc3ab6629af78f4cf",
    },
  },
  {
    name: "18881 Mound",
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
      fullName: "18881 Mound Rd, Detroit, MI 48234",
      shortName: "18881 Mound",
      totalInvestment: "336,340",
      squareFeet: "3,732",
      propertyType: "Multi Family",
      grossRentYear: "66,600",
      netRentYear: "30,660",
      initialLaunchDate: "2024-12-13",
      annualPercentageYield: "9.12%",
      coordinate: "(42.432798, -83.044147)",
      marketplaceLink:
        "https://realt.co/product/18881-mound-rd-detroit-mi-48234/",
      images: [
        "https://realt.co/wp-content/uploads/2024/12/18881-Mound-front-side-1.jpg",
        "https://realt.co/wp-content/uploads/2024/12/18881-Mound-front-flat-1.jpg",
        "https://realt.co/wp-content/uploads/2024/12/18881-Mound-front-side-3.jpg",
      ],
      contract: "0x5c4e3fa9704d4212c6434190af6379cfbda47e13",
    },
  },
  {
    name: "14631-14633 Plymouth",
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
      fullName: "14631-14633 Plymouth Rd, Detroit, MI 48227",
      shortName: "14631-14633 Plymouth",
      totalInvestment: "1,389,025",
      squareFeet: "15,292",
      propertyType: "Multi Family",
      grossRentYear: "249,600",
      netRentYear: "126,840",
      initialLaunchDate: "2024-12-13",
      annualPercentageYield: "9.13%",
      coordinate: "(42.372607, -83.188424)",
      marketplaceLink:
        "https://realt.co/product/14631-14633-plymouth-rd-detroit-mi-48227/",
      images: [
        "https://realt.co/wp-content/uploads/2024/12/14631-14633-Plymouth-front-flat-1.jpg",
        "https://realt.co/wp-content/uploads/2024/12/14631-14633-Plymouth-front-side-1.jpg",
        "https://realt.co/wp-content/uploads/2024/12/14631-14633-Plymouth-front-side-3.jpg",
      ],
      contract: "0x854a0cfa24012937d3d15682ecc3d5b474bfa97e",
    },
  },
  {
    name: "11373 Prest",
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
      fullName: "11373 Prest St, Detroit, MI 48227",
      shortName: "11373 Prest",
      totalInvestment: "76,806",
      squareFeet: "864",
      propertyType: "Single Family",
      grossRentYear: "12,120",
      netRentYear: "6,948",
      initialLaunchDate: "2024-12-06",
      annualPercentageYield: "9.05%",
      coordinate: "(42.371296, -83.196702)",
      marketplaceLink:
        "https://realt.co/product/11373-prest-st-detroit-mi-48227/",
      images: [
        "https://realt.co/wp-content/uploads/2024/12/11373-Prest-front-side-3.jpg",
        "https://realt.co/wp-content/uploads/2024/12/11373-Prest-front-flat-1.jpg",
        "https://realt.co/wp-content/uploads/2024/12/11373-Prest-front-side-1.jpg",
      ],
      contract: "0xd8b19f31186fc7350be018651aa1383175923bb3",
    },
  },
  {
    name: "16728-16730 Woodingham",
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
      fullName: "16728-16730 Woodingham Dr, Detroit, MI 48221",
      shortName: "16728-16730 Woodingham",
      totalInvestment: "143,897",
      squareFeet: "1,868",
      propertyType: "Duplex",
      grossRentYear: "22,200",
      netRentYear: "14,460",
      initialLaunchDate: "2023-12-09",
      annualPercentageYield: "10.05%",
      coordinate: "(42.415419, -83.149859)",
      marketplaceLink:
        "https://realt.co/product/16728-16730-woodingham-dr-detroit-mi-48221/",
      images: [
        "https://realt.co/wp-content/uploads/2023/12/16728-16730-Woodingham-front-hero-fix.jpg",
        "https://realt.co/wp-content/uploads/2023/12/16728-16730-Woodingham-side-2-fix.jpg",
        "https://realt.co/wp-content/uploads/2023/12/16728-16730-Woodingham-side-1-fix.jpg",
      ],
      contract: "0xc7697f5e86a102eaf4000719a2dc477d65beea7d",
    },
  },
  {
    name: "9518 Franklin",
    color: "#008080",
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
      fullName: "9518 Franklin Dr, Mont Belvieu, TX 77523",
      shortName: "9518 Franklin",
      totalInvestment: "461,643",
      squareFeet: "3,358",
      propertyType: "Single Family",
      grossRentYear: "47,760",
      netRentYear: "31,572",
      initialLaunchDate: "2024-10-18",
      annualPercentageYield: "6.84%",
      coordinate: "(29.832396, -94.853589)",
      marketplaceLink:
        "https://realt.co/product/9518-franklin-dr-mont-belvieu-tx-77523/",
      images: [
        "https://realt.co/wp-content/uploads/2024/10/9518-franklin-front-side-1.jpg",
        "https://realt.co/wp-content/uploads/2024/10/9518-franklin-front-flat-1.jpg",
        "https://realt.co/wp-content/uploads/2024/10/9518-franklin-aereal-garage-1.jpg",
      ],
      contract: "0x4ae9d3343bbc6a894b7ee7f843c224c953f1661b",
    },
  },
  {
    name: "8034 Faith",
    color: "#FFD700",
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
      fullName: "8034 Faith Ln, Montgomery, AL 36117",
      shortName: "8034 Faith",
      totalInvestment: "327,296",
      squareFeet: "1,923",
      propertyType: "Single Family",
      grossRentYear: "30,600",
      netRentYear: "23,856",
      initialLaunchDate: "2023-08-25",
      annualPercentageYield: "7.29%",
      coordinate: "(32.352942, -86.135603)",
      marketplaceLink:
        "https://realt.co/product/8034-faith-ln-montgomery-al-36117/",
      images: [
        "https://realt.co/wp-content/uploads/2023/08/8034-Faith-Lane-front-hero.jpg",
        "https://realt.co/wp-content/uploads/2023/08/8034-Faith-Lane-garden-1.jpg",
        "https://realt.co/wp-content/uploads/2023/08/8034-Faith-Lane-garden-2.jpg",
      ],
      contract: "0x90d280b6456f8233e115e6aabb2ca89249dafd39",
    },
  },
  {
    name: "1769 Cheryl",
    color: "#0000FF",
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
      fullName: "1769 Cheryl Ave, Griffin, GA 30224",
      shortName: "1769 Cheryl",
      totalInvestment: "307,272",
      squareFeet: "1,680",
      propertyType: "Single Family",
      grossRentYear: "31,200",
      netRentYear: "22,068",
      initialLaunchDate: "2023-09-21",
      annualPercentageYield: "7.18%",
      coordinate: "(33.224176, -84.310708)",
      marketplaceLink:
        "https://realt.co/product/1769-cheryl-ave-griffin-ga-30224/",
      images: [
        "https://realt.co/wp-content/uploads/2023/09/1769-Cheryl-Ave-front-hero.jpg",
        "https://realt.co/wp-content/uploads/2023/09/1769-Cheryl-Ave-side-2.jpg",
        "https://realt.co/wp-content/uploads/2023/09/1769-Cheryl-Ave-side-1.jpg",
      ],
      contract: "0x19f824662ba9df78e368022f085b708fccc201c8",
    },
  },
  {
    name: "9311 Bedford",
    color: "#A52A2A",
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
      fullName: "9311 Bedford St, Detroit, MI 48224",
      shortName: "9311 Bedford",
      totalInvestment: "90,270",
      squareFeet: "1,170",
      propertyType: "Single Family",
      grossRentYear: "14,400",
      netRentYear: "8,220",
      initialLaunchDate: "2024-06-14",
      annualPercentageYield: "9.11%",
      coordinate: "(42.411886, -82.948675)",
      marketplaceLink:
        "https://realt.co/product/9311-bedford-st-detroit-mi-48224/",
      images: [
        "https://realt.co/wp-content/uploads/2024/06/9311-Bedford-front-flat-1.jpg",
        "https://realt.co/wp-content/uploads/2024/06/9311-Bedford-front-side-1.jpg",
        "https://realt.co/wp-content/uploads/2024/06/9311-Bedford-side-1.jpg",
      ],
      contract: "0xa83cbd26964ea953f86c741871a1ab2a256cb82d",
    },
  },
];
