import { useMutation, useQueryClient } from "@tanstack/react-query";
import { writeContract } from "@wagmi/core";
import { Address, encodeFunctionData, erc20Abi, parseUnits } from "viem";

import { TradeExecutorAbi } from "@/contracts/abis/TradeExecutorAbi";
import { gnosisRouterAbi, gnosisRouterAddress } from "@/generated";
import { config } from "@/wagmiConfig";

import { GetQuotesResult } from "@/utils/getQuotes";
import { waitForTransaction } from "@/utils/waitForTransaction";

import { collateral, DECIMALS, DEFAULT_CHAIN } from "@/consts";
import { IMarket } from "@/consts/markets";

interface PredictProps {
  tradeExecutor: Address;
  amount: bigint;
  market: IMarket;
  getQuotesResult: GetQuotesResult;
}

function splitFromRouter(marketId: Address, amount: bigint) {
  return {
    to: gnosisRouterAddress,
    value: 0n,
    data: encodeFunctionData({
      abi: gnosisRouterAbi,
      functionName: "splitPosition",
      args: [collateral.address, marketId, amount],
    }),
  };
}

function mergeFromRouter(marketId: Address, amount: bigint) {
  return {
    to: gnosisRouterAddress,
    value: 0n,
    data: encodeFunctionData({
      abi: gnosisRouterAbi,
      functionName: "mergePositions",
      args: [collateral.address, marketId, amount],
    }),
  };
}

const getApproveCalls = async ({
  amount,
  market,
  getQuotesResult,
}: Omit<PredictProps, "tradeExecutor">) => {
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
  market,
  amount,
  getQuotesResult,
}: PredictProps) {
  const { quotes, mergeAmount } = getQuotesResult;
  const { sellQuotes, buyQuotes } = quotes;
  const calls = [];

  const {
    splitApproveCall,
    sellApproveCalls,
    mergeApproveCalls,
    buyApproveCalls,
  } = await getApproveCalls({
    amount,
    market,
    getQuotesResult,
  });

  if (amount > 0n) {
    calls.push(...splitApproveCall);
    calls.push(splitFromRouter(market.marketId, amount));
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
    calls.push(mergeFromRouter(market.marketId, mergeAmount));
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

  return calls;
}

async function predictFromTradeExecutor({
  tradeExecutor,
  amount,
  market,
  getQuotesResult,
}: PredictProps) {
  const calls = await getTradeExecutorCalls({
    tradeExecutor,
    amount,
    market,
    getQuotesResult,
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

export const useTradeExecutorPredict = (onSuccess?: () => unknown) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (props: PredictProps) => predictFromTradeExecutor(props),
    onSuccess() {
      onSuccess?.();
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ["useTokenBalance"] });
        queryClient.refetchQueries({ queryKey: ["useTokensBalances"] });
        queryClient.invalidateQueries({ queryKey: ["useGetQuotes"] });
      }, 3000);
    },
  });
};
