// Seer market instance. Addresses vary per market, so unlike the routers it has
// no entry in the consts contract map.
export const MarketAbi = [
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
    name: "parentMarket",
    outputs: [{ internalType: "contract Market", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
