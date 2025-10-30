import { SwaprV3Trade, TradeType } from "@swapr/sdk";
import { Token } from "@uniswap/sdk-core";
import {
  encodeAbiParameters,
  getCreate2Address,
  keccak256,
  type Address,
} from "viem";
import { gnosis } from "viem/chains";

import { getTradeArgs } from "./trade";
import { getTradeExactOutArgs } from "./tradeExactOut";

type GetQuoteArgs = {
  address?: Address;
  chain?: number;
  amount?: string;
  outcomeToken: string;
  collateralToken: string;
};

export const getSwaprQuote = async ({
  address,
  chain = gnosis.id,
  outcomeToken,
  collateralToken,
  amount = "1",
}: GetQuoteArgs) => {
  const args = getTradeArgs(
    chain,
    amount,
    outcomeToken,
    collateralToken,
    "buy",
  );

  return await SwaprV3Trade.getQuote(
    {
      amount: args.currencyAmountIn,
      quoteCurrency: args.currencyOut,
      recipient: address,
      tradeType: TradeType.EXACT_INPUT,
      maximumSlippage: args.maximumSlippage,
    },
    undefined,
    false,
  );
};

export const getSwaprQuoteExactOut = async ({
  address,
  chain = gnosis.id,
  outcomeToken,
  collateralToken,
  amount = "1",
}: GetQuoteArgs) => {
  const args = getTradeExactOutArgs(
    chain,
    amount,
    outcomeToken,
    collateralToken,
    "buy",
  );

  return await SwaprV3Trade.getQuote(
    {
      amount: args.currencyAmountOut,
      quoteCurrency: args.currencyIn,
      recipient: address,
      tradeType: TradeType.EXACT_OUTPUT,
      maximumSlippage: args.maximumSlippage,
    },
    undefined,
    false,
  );
};

const POOL_DEPLOYER_ADDRESS = "0xC1b576AC6Ec749d5Ace1787bF9Ec6340908ddB47";
export const SWAPR_QUOTER_ADDRESS =
  "0xcBaD9FDf0D2814659Eb26f600EFDeAF005Eda0F7";
const POOL_INIT_CODE_HASH =
  "0xbce37a54eab2fcd71913a0d40723e04238970e7fc1159bfd58ad5b79531697e7";

export function computePoolAddress({
  tokenA,
  tokenB,
}: {
  tokenA: Token;
  tokenB: Token;
}): { address: Address; token0: Token; token1: Token } {
  const [token0, token1] = tokenA.sortsBefore(tokenB)
    ? [tokenA, tokenB]
    : [tokenB, tokenA];

  const encoded = encodeAbiParameters(
    [{ type: "address" }, { type: "address" }],
    [token0.address as Address, token1.address as Address],
  );

  const salt = keccak256(encoded);

  const address = getCreate2Address({
    from: POOL_DEPLOYER_ADDRESS,
    salt,
    bytecodeHash: POOL_INIT_CODE_HASH,
  });

  return {
    address,
    token0,
    token1,
  };
}
