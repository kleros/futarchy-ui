import { useMutation, useQueryClient } from "@tanstack/react-query";
import { writeContract } from "@wagmi/core";
import { Address, encodeFunctionData, erc20Abi, parseUnits } from "viem";

import { TradeExecutorAbi } from "@/contracts/abis/TradeExecutorAbi";
import { gnosisRouterAddress } from "@/generated";
import { config } from "@/wagmiConfig";

import { isUndefined } from "@/utils";
import { GetQuotesResult } from "@/utils/getQuotes";
import { waitForTransaction } from "@/utils/waitForTransaction";

import { DECIMALS, DEFAULT_CHAIN } from "@/consts";
import { IMarket } from "@/consts/markets";

import { mergeFromRouter, splitFromRouter } from "./useTradeExecutorPredict";
import { getSplitFromTradeExecutorCalls } from "./useTradeExecutorSplit";

interface MarketsData {
  marketInfo: IMarket;
  getQuotesResult: GetQuotesResult;
  // notice: amount here is not the actual balance of the trade wallet,
  // instead the amount of underlying tokens the wallet will have, in case of a split from collateral
  // example: if user provided collateral to mint/ split tokens in parent market, then we add that mintAmount in here,
  // since the txns will include a split txn that will end up giving this mintAmount to the Wallet as underlying token
  // This value is handled in utils/processMarket
  amount: bigint;
}

interface PredictAllProps {
  tradeExecutor: Address;
  marketsData: MarketsData[];
  // defined if collateral needs to minted to Parent Market
  mintAmount?: bigint;
}

const getApproveCalls = async ({
  amount,
  market,
  getQuotesResult,
}: {
  amount: bigint;
  market: IMarket;
  getQuotesResult: GetQuotesResult;
}) => {
  const { quotes, mergeAmount } = getQuotesResult;
  const { sellQuotes, buyQuotes } = quotes;

  // approve the gnosisRouter to split underlying tokens
  const splitApproveCall =
    amount > 0
      ? [
          {
            to: market.underlyingToken,
            data: encodeFunctionData({
              abi: erc20Abi,
              functionName: "approve",
              args: [gnosisRouterAddress, amount],
            }),
          },
        ]
      : [];

  // sell approve calls
  const sellApproveCalls = sellQuotes.map((quote) => ({
    to: quote.inputAmount.currency.address!,
    data: encodeFunctionData({
      abi: erc20Abi,
      functionName: "approve",
      args: [
        quote.approveAddress as Address,
        parseUnits(quote.maximumAmountIn().toExact(), DECIMALS),
      ],
    }),
  }));

  // approve gnosis router to merge UP and DOWN tokens
  const mergeApproveCalls =
    mergeAmount > 0n
      ? [
          {
            to: market.upToken,
            data: encodeFunctionData({
              abi: erc20Abi,
              functionName: "approve",
              args: [gnosisRouterAddress, mergeAmount],
            }),
          },
          {
            to: market.downToken,
            data: encodeFunctionData({
              abi: erc20Abi,
              functionName: "approve",
              args: [gnosisRouterAddress, mergeAmount],
            }),
          },
          {
            to: market.invalidToken,
            data: encodeFunctionData({
              abi: erc20Abi,
              functionName: "approve",
              args: [gnosisRouterAddress, mergeAmount],
            }),
          },
        ]
      : [];

  // buy approve calls
  const buyApproveCalls = buyQuotes.map((quote) => ({
    to: quote.inputAmount.currency.address!,
    data: encodeFunctionData({
      abi: erc20Abi,
      functionName: "approve",
      args: [
        quote.approveAddress as Address,
        parseUnits(quote.maximumAmountIn().toExact(), DECIMALS),
      ],
    }),
  }));

  return {
    splitApproveCall,
    sellApproveCalls,
    mergeApproveCalls,
    buyApproveCalls,
  };
};

async function getTradeExecutorCalls({
  tradeExecutor,
  marketsData,
  mintAmount,
}: PredictAllProps) {
  const calls = [];

  // Adds a split call if the user entered an amount to mint parent market tokens
  if (!isUndefined(mintAmount) && mintAmount > 0n) {
    const mintCalls = getSplitFromTradeExecutorCalls({ amount: mintAmount });
    calls.push(...mintCalls);
  }

  for (const market of marketsData) {
    const { marketInfo, getQuotesResult, amount } = market;
    const { quotes, mergeAmount } = getQuotesResult;
    const { sellQuotes, buyQuotes } = quotes;

    const {
      splitApproveCall,
      sellApproveCalls,
      mergeApproveCalls,
      buyApproveCalls,
    } = await getApproveCalls({
      amount,
      market: marketInfo,
      getQuotesResult,
    });

    if (amount > 0n) {
      calls.push(...splitApproveCall);
      calls.push(splitFromRouter(marketInfo.marketId, amount));
    }

    const sellSwapTransactions = (
      await Promise.all(
        sellQuotes.map((quote) =>
          quote.swapTransaction({ recipient: tradeExecutor }),
        ),
      )
    ).map((txn) => ({ to: txn.to!, data: txn.data! }));

    calls.push(...sellApproveCalls);
    calls.push(...sellSwapTransactions);

    if (mergeAmount > 0n) {
      calls.push(...mergeApproveCalls);
      calls.push(mergeFromRouter(marketInfo.marketId, mergeAmount));
    }

    const buySwapTransactions = (
      await Promise.all(
        buyQuotes.map((quote) =>
          quote.swapTransaction({ recipient: tradeExecutor }),
        ),
      )
    ).map((txn) => ({ to: txn.to!, data: txn.data! }));

    calls.push(...buyApproveCalls);
    calls.push(...buySwapTransactions);
  }

  return calls;
}

async function predictAllFromTradeExecutor({
  tradeExecutor,
  marketsData,
  mintAmount,
}: PredictAllProps) {
  const calls = await getTradeExecutorCalls({
    tradeExecutor,
    marketsData,
    mintAmount,
  });

  const writePromise = writeContract(config, {
    address: tradeExecutor,
    abi: TradeExecutorAbi,
    functionName: "batchExecute",
    args: [calls],
    value: 0n,
    chainId: DEFAULT_CHAIN.id,
  });

  const result = await waitForTransaction(() => writePromise);
  if (!result.status) {
    throw result.error;
  }
  return result;
}

export const useTradeExecutorPredictAll = (onSuccess?: () => unknown) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (props: PredictAllProps) => predictAllFromTradeExecutor(props),
    onSuccess() {
      onSuccess?.();
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ["useTokenBalance"] });
        queryClient.refetchQueries({ queryKey: ["useTokensBalances"] });
      }, 3000);
    },
  });
};
