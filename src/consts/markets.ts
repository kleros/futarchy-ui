import { Address } from "viem";

// TODO: update to latest
export const projectsChosen = 6;

export const parentMarket: Address =
  "0x6f7ae2815e7e13c14a6560f4b382ae78e7b1493e";

export const parentConditionId =
  "0x0d6c99d7eb9fa657236905b6cf464eaa938371ae5ce8cf153af450321377241d";

export const invalidMarket: Address =
  "0x45F2d1Bfa638E0A5f04dFacAAdbDbd0c2044eae8";

export const endTime: number = 1757776813;

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

export const metadata = {
  name: "Session 1 - Movies Experiment",
  question: "If watched, what score will Clément give to the movie?",
  questionDescription:
    "Which movies will Clément watch as part of the “Distilled Clément’s Judgement experiment”? \nAnd for each movie, what rating will he give to that movie?",
};

export const markets: Array<IMarket> = [
  {
    name: "Judge Dredd (1995)",
    color: "#E6194B",
    upToken: "0x0ee25eb2e22c01fa832dd5fea5637fba4cd5e870",
    downToken: "0x4abea4bf9e35f4e957695374c388cee9f83ca1d0",
    underlyingToken: "0xb72a1271caa3d84d3fbbbcbb0f63ee358b94f96a",
    invalidToken: "0x11463F43181eB643bA8a584756CCB27a9B8f7B98",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x105d957043ee12f7705efa072af11e718f8c5b83",
    parentMarketOutcome: 0,
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
    invalidToken: "0x971bd2446cc32dFa26410Cc46978AA0c371Bc48e",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x68af0afe82dda5c9c26e6a458a143caad35708d6",
    parentMarketOutcome: 1,
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
  {
    name: "The Hitchhiker's Guide to the Galaxy (2005)",
    color: "#FFD93D",
    upToken: "0xad2248b8eaa3e3a405c1ba79dd436947f8b427df",
    downToken: "0xdd510abc6a848662371c3455717949035cc24019",
    underlyingToken: "0xfb06c25e59302d8a0318d6df41a2f29deeea1c8a",
    invalidToken: "0x43D6E82de1E64531b5E47891b186227edA566344",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0xfdd8af90af2722d5fe39adf1002fbd069b8a76c0",
    parentMarketOutcome: 2,
    conditionId:
      "0xe97f19928d4143377d3cb97043c90408ccb9c51788447f42d2df9d65694c8171",
    details: {
      imdbURL:
        "https://www.imdb.com/title/tt0371724/?ref_=nv_sr_srsg_0_tt_7_nm_1_in_0_q_the%2520hitch",
      posterURL:
        "https://resizing.flixster.com/otfSVWc26cetfV0acq5Z5-E9A60=/206x305/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p35755_p_v8_am.jpg",
      summary: `Mere seconds before the Earth is to be demolished by an alien construction crew, journeyman Arthur Dent is swept off the planet by his friend Ford Prefect, a researcher penning a new edition of "The Hitchhiker's Guide to the Galaxy."`,
    },
  },
  {
    name: "Everything, Everywhere, All At Once (2022)",
    color: "#6BCB77",
    upToken: "0xfa020fcd05e0b91dae83a2a08c5b5533edf8c851",
    downToken: "0x372d0798ffe8c3aa982a15258c0fea22c6a768df",
    underlyingToken: "0xe85d556d1aaae2f6027336e468e9c981251a4bef",
    invalidToken: "0x3Aa738505C22e670a074e60566bD7264e7D682B1",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x1f2e76d66047e7f8e0deea373a0c04ffecab31df",
    parentMarketOutcome: 3,
    conditionId:
      "0xdc8f8277da182ee2d5293c754a1cfb8d3761720259cf17a65df61b7cb6983721",
    details: {
      imdbURL: "https://www.imdb.com/title/tt6710474/?ref_=fn_all_ttl_1",
      posterURL:
        "https://resizing.flixster.com/I2Z0zDTKJdvO7Akh819HROIhZQ4=/206x305/v2/https://resizing.flixster.com/mx-agGjjsUK1QMyuv3AJhHI3hgo=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzLzA3ZjU2MGU1LWMxODItNDlkMC1hYzJhLTY2YzMwOGZkMDhiZi5qcGc=",
      summary:
        "A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence by exploring other universes and connecting with the lives she could have led.",
    },
  },
  {
    name: "12 angry men (1957)",
    color: "#4D96FF",
    upToken: "0x7ee3806d16dc6a76bef2b11880b70cc70f74fa1a",
    downToken: "0x34f8572eab463606a014c37ff68b78ac9361cacc",
    underlyingToken: "0xb3933fd994af5db7ae985a0d62ed2dda918a839b",
    invalidToken: "0x12c91f543a48F58e3E54c398f19BEc4b62aFD617",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x2338ca7d59b7e15bd03dd81cf5f5bb59b6c6c6d4",
    parentMarketOutcome: 4,
    conditionId:
      "0xf857ab39ef39d99f00d38ab07a5676406dfd5382f6d2177c44642e147d8dd0ad",
    details: {
      imdbURL:
        "https://www.imdb.com/title/tt0050083/?ref_=nv_sr_srsg_0_tt_8_nm_0_in_0_q_12%2520angry",
      posterURL:
        "https://resizing.flixster.com/FDNKxkwCqhqdzh-IvaGBfzqRb74=/206x305/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p2084_p_v8_ar.jpg",
      summary:
        "The jury in a New York City murder trial is frustrated by a single member whose skeptical caution forces them to more carefully consider the evidence before jumping to a hasty verdict.",
    },
  },
  {
    name: "Alien (1979)",
    color: "#845EC2",
    upToken: "0x37e70bae5e87327feece73a7c227446571f92137",
    downToken: "0x31e3d82a613e5aeea7c3a65c3d657cacaaaf2674",
    underlyingToken: "0x6d0407b5ae419fdd92ffdc64abf04c5f28950e02",
    invalidToken: "0xe54422171C40aA14B0fc935DEA7AFb85BE15357d",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x9a274ea86665d872fc58c8f26fd97a18b844c6ac",
    parentMarketOutcome: 5,
    conditionId:
      "0x8054990ae8221c8a08581381a0d2e3e5f23144a4d18a2398858be52dd94cc8c9",
    details: {
      imdbURL:
        "https://www.imdb.com/title/tt0078748/?ref_=nv_sr_srsg_3_tt_8_nm_0_in_0_q_alien",
      posterURL:
        "https://resizing.flixster.com/5R4bkJZC-W_K-YjmIMKAXCbts5Y=/206x305/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p2571_p_v8_aw.jpg",
      summary:
        "After investigating a mysterious transmission of unknown origin, the crew of a commercial spacecraft encounters a deadly lifeform.",
    },
  },
  {
    name: "Demolition Man (1993)",
    color: "#FF9671",
    upToken: "0x53a9011c5570bfb8148954c4f49a6625dc44077b",
    downToken: "0x64974d3bf944fafec6fa19a900f3679a716b3a86",
    underlyingToken: "0x20025021e440edd39d486f3c6a1d7adb9c269faf",
    invalidToken: "0x406B8Ee2DF07c644414E852542dAB98BdDf39234",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0xc25af7d4a5cb36bb3ce9faf652a5f7f989a1d57a",
    parentMarketOutcome: 6,
    conditionId:
      "0xe35db6fb9992ab689e21751f036ccc9a8548b71dec3089874cf4a19a13cd34bb",
    details: {
      imdbURL:
        "https://www.imdb.com/title/tt0106697/?ref_=nv_sr_srsg_0_tt_8_nm_0_in_0_q_demolition%2520man",
      posterURL:
        "https://resizing.flixster.com/e3iHOpnnUZKRPz_xHJVoLz8TkGM=/206x305/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p15098_p_v10_ab.jpg",
      summary:
        "A police officer is brought out of suspended animation in prison to pursue an old ultra-violent nemesis who is loose in a non-violent future society.",
    },
  },
  {
    name: "Barbie (2023)",
    color: "#0081CF",
    upToken: "0xaed0fad91e7149ec84bb4d0a2a77be819169275f",
    downToken: "0x044e1b6d8aacbda5699423578bd200484f7473c3",
    underlyingToken: "0x67d0f938ea12e7e30b8ccc24dd031d656cc3927d",
    invalidToken: "0xA9099Baa3b74c1d602aCe8CeaC5933a16A0456C5",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0xd31d05158722f64b6a49e25bccc47d3203eecbe9",
    parentMarketOutcome: 7,
    conditionId:
      "0x3c102db4f274983b648bd27a4092866e1b81dbc08b8738a5c694a8d8c3948a81",
    details: {
      imdbURL:
        "https://www.imdb.com/title/tt1517268/?ref_=nv_sr_srsg_1_tt_6_nm_1_in_0_q_barbie",
      posterURL:
        "https://resizing.flixster.com/r409CsU-O1gEcAP0VtU6tDD9sKI=/206x305/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p13472534_p_v8_am.jpg",
      summary:
        "Barbie and Ken are having the time of their lives in the seemingly perfect world of Barbie Land. However, when they get a chance to go to the outside world, they soon discover the joys and perils of living among regular humans.",
    },
  },
  {
    name: "Eduardo e Mônica (2020)",
    color: "#FFC75F",
    upToken: "0x9d64a3e7e55880f3c8f9c584ed32397bb6f0b9f6",
    downToken: "0xe9d025d3cbd783d6a92626b650a32f7cbaca0e7d",
    underlyingToken: "0x58ce7a53abeca1db90cec0e6b7dcbe3a36d986c4",
    invalidToken: "0xcA4c82fd178aaf4b72ECe35774ce04B7Aa2E5361",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x13d48a73811c01f574e1bfa4c58b7d95d2f590e4",
    parentMarketOutcome: 8,
    conditionId:
      "0x2dcf754f36437ea0c298e5d27a0f3904dc2335a6e239b15a104f3ca7787c5926",
    details: {
      imdbURL:
        "https://www.imdb.com/title/tt8747460/?ref_=nv_sr_srsg_0_tt_2_nm_0_in_0_q_Eduardo%2520e%2520M%25C3%25B4nica%2520(2020)",
      posterURL:
        "https://resizing.flixster.com/IaXbRF4gIPh9jireK_4VCPNfdKc=/200x0/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p18824656_k_v8_aa.jpg",
      summary:
        "On an unusual day, a series of coincidences lead Eduardo to meet Monica at a party. Curiosity is aroused between the two and, despite not being alike, they fall madly in love. This love needs to mature and learn to overcome differences.",
    },
  },
  {
    name: "Thor: The Dark World (2013)",
    color: "#00C9A7",
    upToken: "0x0c569fbc021119b778ea160efd718a5d592ef46c",
    downToken: "0xd8d2dfe1912239451b5a4a0462006e95393f2151",
    underlyingToken: "0x72ec9aade867b5b41705c6a83f66bc56485669b5",
    invalidToken: "0xFa2e53b2E33309CEE9255b440f143308F92BbA83",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x878a332b5efc0a4bf983036beece050352baa73d",
    parentMarketOutcome: 9,
    conditionId:
      "0xb223aad8405c321b761e3cba872e556c1de3a8b552a38249d626bc5aff7c6ba2",
    details: {
      imdbURL:
        "https://www.imdb.com/title/tt1981115/?ref_=nv_sr_srsg_0_tt_8_nm_0_in_0_q_thor%2520the%2520dark",
      posterURL:
        "https://resizing.flixster.com/HtozfP_2NYit3_l7s-cbtsiuWps=/206x305/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p9530219_p_v13_aa.jpg",
      summary:
        "When the Dark Elves attempt to plunge the universe into darkness, Thor must embark on a perilous and personal journey that will reunite him with doctor Jane Foster.",
    },
  },
  {
    name: "Talk to me (2022)",
    color: "#C34A36",
    upToken: "0xf3c17e909bd1f9367ecdc786d137465d7ee96b6a",
    downToken: "0xf99be182b6b0e6d994509ecdced281b94100435f",
    underlyingToken: "0x2b3a8ac53ba42da13f542a867d2859642fb1db44",
    invalidToken: "0x94b6580034e1FFf008Ac8370dF69E180740469b0",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0xee4a77447069f32f555f3d75aaba18a4acb54ac4",
    parentMarketOutcome: 10,
    conditionId:
      "0x715f9e8ccc373f85e2f9ec02bba8d23c5f87090b729750ca8adac5b0f969213e",
    details: {
      imdbURL:
        "https://www.imdb.com/title/tt10638522/?ref_=nv_sr_srsg_0_tt_8_nm_0_in_0_q_talk%2520to%2520me",
      posterURL:
        "https://resizing.flixster.com/ejS3S8JOBfvZr_fQ_--6SyKKJpQ=/206x305/v2/https://resizing.flixster.com/9WxKriao1BmRamIaqig2k8hd5uM=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2YyZDQwYTM2LWZmYzEtNGUwMC05NzRkLTA3ODM0NThiNDE4Ny5qcGc=",
      summary:
        "When a group of friends discover how to conjure spirits using an embalmed hand, they become hooked on the new thrill, until one of them goes too far and unleashes terrifying supernatural forces.",
    },
  },
  {
    name: "Fast & Furious 6 (2013)",
    color: "#9B51E0",
    upToken: "0x850d2ffa4475296cfbbd76247894a773e3b1be6c",
    downToken: "0xb28c716f63b0dd272f62e25765a914baeebab8c2",
    underlyingToken: "0x71c3df5edcab48cfb6a1a99255eff063f33b6265",
    invalidToken: "0xb3cE80d6b30DcC4d605B290f4dC1Fc3B8C2bcC3b",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x38a2923cc391b9cd926e5a2d07462dc7d189c407",
    parentMarketOutcome: 11,
    conditionId:
      "0x27f341cdecacbd7ff0e4bb7b28add74ddaa388ff9f16bc749e2828a71fe6a5f6",
    details: {
      imdbURL:
        "https://www.imdb.com/title/tt1905041/?ref_=nv_sr_srsg_0_tt_8_nm_0_in_0_q_fast%2520%2526%2520furious%25206",
      posterURL:
        "https://resizing.flixster.com/dJUU6CNK8IBSjsImW4nXCxxUVwU=/206x305/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p9573130_p_v7_ab.jpg",
      summary:
        "Hobbs has Dominic and Brian reassemble their crew to take down a team of mercenaries, but Dominic unexpectedly gets sidetracked with facing his presumed deceased girlfriend, Letty.",
    },
  },
  {
    name: "Elysium (2013)",
    color: "#2D4059",
    upToken: "0xe9427a7a32daad2d29db2aad809b2a44060d8fc8",
    downToken: "0x75b5cd86828f7c9009e30619a83b1b2da67f1342",
    underlyingToken: "0xf52e0e144b73a0d5748bc53667efe3ba62fe5695",
    invalidToken: "0x69641B6664a493ecF467D4D9aAB595A8b9Cc4a66",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0xc0dab34c6c2008391bdc742cec0bd0afb60d4d59",
    parentMarketOutcome: 12,
    conditionId:
      "0x2d2ee6e67d4ffa2c2a14898a29d0afe3d3cdd8ad362811aad64770a90553cb3a",
    details: {
      imdbURL:
        "https://www.imdb.com/title/tt1535108/?ref_=nv_sr_srsg_0_tt_8_nm_0_in_0_q_elysium",
      posterURL:
        "https://resizing.flixster.com/WlkdhZWddtMIv8U2Tmlb74rmBZ4=/206x305/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p9360879_p_v10_ar.jpg",
      summary:
        "In the year 2154, the very wealthy live on a man-made space station while the rest of the population resides on a ruined Earth. A man takes on a mission that could bring equality to the polarized worlds.",
    },
  },
  {
    name: "Session 9 (2001)",
    color: "#F9F871",
    upToken: "0xe080c03ad6bc9f8fd5b45b5d3bf14ebcfa1ec0b5",
    downToken: "0x76cce8491785789c2c5542f043ec6c35b12cd909",
    underlyingToken: "0x1086a95c224dd586809a7f4d875b4f09d2ac9290",
    invalidToken: "0x4F2b7EC3aAC8Bb0Ffb272a4B27B758D2FFC31bc6",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0xa7cf69c4c93d2f6811a394e92320979c3cf86b37",
    parentMarketOutcome: 13,
    conditionId:
      "0x6bc6c6fd532a02ec128e7c8dfe3e496295f677c861405a88b7da503f1882eef8",
    details: {
      imdbURL:
        "https://www.imdb.com/title/tt0261983/?ref_=nv_sr_srsg_0_tt_8_nm_0_in_0_q_session%25209",
      posterURL:
        "https://resizing.flixster.com/pMiw8blJew0YXddZivo7mtYlUDg=/206x305/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p28177_p_v13_ac.jpg",
      summary:
        "Tensions rise within an asbestos cleaning crew as they work in an abandoned mental hospital with a horrific past that seems to be coming back.",
    },
  },
  {
    name: "Mamma Mia! (2008)",
    color: "#B0A8B9",
    upToken: "0xfa82984fc8ddeb71fdb2e6e471f30995178ad5f0",
    downToken: "0x5d528dbec7e37927d8af41bfb1b54e7641dd3ccb",
    underlyingToken: "0x11ed86c399f455819f495cda1256e9b52afd0971",
    invalidToken: "0x756de0795875f925AC95ba37472D26bC4375c6a4",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x96638d67ac5bc5f8223f9e2d60e92f4d8dcf3147",
    parentMarketOutcome: 14,
    conditionId:
      "0x6e5b27306498d2917cdde6a3ea4791cd5a6fe8d8bf33d491c97524c431eda325",
    details: {
      imdbURL:
        "https://www.imdb.com/title/tt0795421/?ref_=nv_sr_srsg_0_tt_7_nm_1_in_0_q_mamma%2520mia",
      posterURL:
        "https://resizing.flixster.com/sD29k0EMFXDWY0DPiFoQsaxqDNU=/206x305/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p176344_p_v8_al.jpg",
      summary:
        "Donna, an independent hotelier, is preparing for her daughter's wedding with the help of two old friends. Meanwhile Sophie, the spirited bride, has a plan. She invites three men from her mother's past in hope of meeting her real father.",
    },
  },
  {
    name: "Ethereum (2022)",
    color: "#FF8066",
    upToken: "0xf8313845248f2392a39bdcd50be0781c7cf497c1",
    downToken: "0x3befdfbd7c2a7139acafc3005369d30ff2cd8f9a",
    underlyingToken: "0x78c2edb5639af0ed4351f001c728c9026820887e",
    invalidToken: "0x8eB59F4590fF6a0037a159ea1601D9d309aEa598",
    minValue: 0,
    maxValue: 100,
    precision: 100,
    marketId: "0x002c70343ddef063d0ad8da91104934318800d30",
    parentMarketOutcome: 15,
    conditionId:
      "0x2b9e73d1da8dc051ffe4972114f59e61ad1bfd65fda93d88bcfb6644ffb07f4b",
    details: {
      imdbURL:
        "https://www.imdb.com/title/tt22069858/?ref_=nv_sr_srsg_2_tt_8_nm_0_in_0_q_ethereum",
      posterURL:
        "https://play-lh.googleusercontent.com/ARlYF4lUWeSFL9CgcKmHIesZwjsRjB0qkCKyIcLYckxYdrAkmvz1RKLQ_RFPRQuedofL8xOeCBtz-MIStG8=w240-h480-rw",
      summary:
        "Learn About the hottest cryptocurrency around, Ethereum. This amazing documentary explores the history of Ethereum, a decentralized, open-source blockchain with smart contract functionality.",
    },
  },
];
