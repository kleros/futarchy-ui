export const FutarchyFactoryAbi = [
  {
    inputs: [
      {
        internalType: "contract ISeerMarketFactory",
        name: "_factory",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "ChildBatchExceedsExpected",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidConfig",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidSession",
    type: "error",
  },
  {
    inputs: [],
    name: "NotSessionDeployer",
    type: "error",
  },
  {
    inputs: [],
    name: "SessionAlreadyComplete",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroSeerMarket",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "sessionId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "parentOutcomeIndex",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "childMarket",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "parentMarket",
        type: "address",
      },
    ],
    name: "ChildMarketDeployed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "sessionId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "deployer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "parentMarket",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "outcomeCount",
        type: "uint256",
      },
    ],
    name: "ParentMarketDeployed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "sessionId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "parentOutcomeIndex",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "marketName",
            type: "string",
          },
          {
            internalType: "string",
            name: "outcomeLabelLow",
            type: "string",
          },
          {
            internalType: "string",
            name: "outcomeLabelHigh",
            type: "string",
          },
          {
            internalType: "string",
            name: "tokenNameLow",
            type: "string",
          },
          {
            internalType: "string",
            name: "tokenNameHigh",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "lowerBound",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "upperBound",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "minBond",
            type: "uint256",
          },
          {
            internalType: "uint32",
            name: "openingTime",
            type: "uint32",
          },
          {
            internalType: "string",
            name: "category",
            type: "string",
          },
          {
            internalType: "string",
            name: "lang",
            type: "string",
          },
        ],
        indexed: false,
        internalType: "struct FutarchyFactory.ChildScalarConfig[]",
        name: "children",
        type: "tuple[]",
      },
    ],
    name: "PhasedSessionChildConfigPublished",
    type: "event",
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "string",
                name: "marketName",
                type: "string",
              },
              {
                internalType: "string[]",
                name: "outcomes",
                type: "string[]",
              },
              {
                internalType: "string[]",
                name: "tokenNames",
                type: "string[]",
              },
              {
                internalType: "string",
                name: "category",
                type: "string",
              },
              {
                internalType: "string",
                name: "lang",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "minBond",
                type: "uint256",
              },
              {
                internalType: "uint32",
                name: "openingTime",
                type: "uint32",
              },
            ],
            internalType: "struct FutarchyFactory.ParentCategoricalConfig",
            name: "parent",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "parentOutcomeIndex",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "marketName",
                type: "string",
              },
              {
                internalType: "string",
                name: "outcomeLabelLow",
                type: "string",
              },
              {
                internalType: "string",
                name: "outcomeLabelHigh",
                type: "string",
              },
              {
                internalType: "string",
                name: "tokenNameLow",
                type: "string",
              },
              {
                internalType: "string",
                name: "tokenNameHigh",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "lowerBound",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "upperBound",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "minBond",
                type: "uint256",
              },
              {
                internalType: "uint32",
                name: "openingTime",
                type: "uint32",
              },
              {
                internalType: "string",
                name: "category",
                type: "string",
              },
              {
                internalType: "string",
                name: "lang",
                type: "string",
              },
            ],
            internalType: "struct FutarchyFactory.ChildScalarConfig[]",
            name: "children",
            type: "tuple[]",
          },
        ],
        internalType: "struct FutarchyFactory.DeployFutarchySessionParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "deployFutarchySession",
    outputs: [
      {
        internalType: "uint256",
        name: "sessionId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "parentAddress",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "childMarkets",
        type: "address[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "sessionId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "parentOutcomeIndex",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "marketName",
            type: "string",
          },
          {
            internalType: "string",
            name: "outcomeLabelLow",
            type: "string",
          },
          {
            internalType: "string",
            name: "outcomeLabelHigh",
            type: "string",
          },
          {
            internalType: "string",
            name: "tokenNameLow",
            type: "string",
          },
          {
            internalType: "string",
            name: "tokenNameHigh",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "lowerBound",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "upperBound",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "minBond",
            type: "uint256",
          },
          {
            internalType: "uint32",
            name: "openingTime",
            type: "uint32",
          },
          {
            internalType: "string",
            name: "category",
            type: "string",
          },
          {
            internalType: "string",
            name: "lang",
            type: "string",
          },
        ],
        internalType: "struct FutarchyFactory.ChildScalarConfig[]",
        name: "childBatch",
        type: "tuple[]",
      },
    ],
    name: "deploySessionChildBatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "sessionId",
        type: "uint256",
      },
    ],
    name: "getSession",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "deployer",
            type: "address",
          },
          {
            internalType: "address",
            name: "parentMarket",
            type: "address",
          },
          {
            internalType: "address[]",
            name: "childMarkets",
            type: "address[]",
          },
          {
            internalType: "uint64",
            name: "openedAt",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "completedAt",
            type: "uint64",
          },
          {
            internalType: "uint256",
            name: "expectedChildCount",
            type: "uint256",
          },
        ],
        internalType: "struct FutarchyFactory.Session",
        name: "session",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "string",
                name: "marketName",
                type: "string",
              },
              {
                internalType: "string[]",
                name: "outcomes",
                type: "string[]",
              },
              {
                internalType: "string[]",
                name: "tokenNames",
                type: "string[]",
              },
              {
                internalType: "string",
                name: "category",
                type: "string",
              },
              {
                internalType: "string",
                name: "lang",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "minBond",
                type: "uint256",
              },
              {
                internalType: "uint32",
                name: "openingTime",
                type: "uint32",
              },
            ],
            internalType: "struct FutarchyFactory.ParentCategoricalConfig",
            name: "parent",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "parentOutcomeIndex",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "marketName",
                type: "string",
              },
              {
                internalType: "string",
                name: "outcomeLabelLow",
                type: "string",
              },
              {
                internalType: "string",
                name: "outcomeLabelHigh",
                type: "string",
              },
              {
                internalType: "string",
                name: "tokenNameLow",
                type: "string",
              },
              {
                internalType: "string",
                name: "tokenNameHigh",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "lowerBound",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "upperBound",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "minBond",
                type: "uint256",
              },
              {
                internalType: "uint32",
                name: "openingTime",
                type: "uint32",
              },
              {
                internalType: "string",
                name: "category",
                type: "string",
              },
              {
                internalType: "string",
                name: "lang",
                type: "string",
              },
            ],
            internalType: "struct FutarchyFactory.ChildScalarConfig[]",
            name: "children",
            type: "tuple[]",
          },
        ],
        internalType: "struct FutarchyFactory.DeployFutarchySessionParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "openPhasedFutarchySession",
    outputs: [
      {
        internalType: "uint256",
        name: "sessionId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "parentAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "seerMarketFactory",
    outputs: [
      {
        internalType: "contract ISeerMarketFactory",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "sessionCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "sessionId",
        type: "uint256",
      },
    ],
    name: "sessions",
    outputs: [
      {
        internalType: "address",
        name: "deployer",
        type: "address",
      },
      {
        internalType: "address",
        name: "parentMarket",
        type: "address",
      },
      {
        internalType: "uint64",
        name: "openedAt",
        type: "uint64",
      },
      {
        internalType: "uint64",
        name: "completedAt",
        type: "uint64",
      },
      {
        internalType: "uint256",
        name: "expectedChildCount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
