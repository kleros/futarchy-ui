/** Minimal read ABI for deployed Seer `Market` clones (scalar children). */
export const seerMarketAbi = [
  {
    inputs: [],
    name: "conditionId",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "parentOutcome",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "parentWrappedOutcome",
    outputs: [
      { internalType: "contract IERC20", name: "wrapped1155", type: "address" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
    name: "wrappedOutcome",
    outputs: [
      { internalType: "contract IERC20", name: "wrapped1155", type: "address" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
