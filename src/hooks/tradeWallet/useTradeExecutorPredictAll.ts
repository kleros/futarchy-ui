import { SwaprV3Trade } from "@swapr/sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { writeContract } from "@wagmi/core";
import { type BytesLike } from "ethers";
import { Address, encodeFunctionData, erc20Abi, parseUnits } from "viem";

import { TradeExecutorAbi } from "@/contracts/abis/TradeExecutorAbi";
import {
  creditsManagerAbi,
  creditsManagerAddress,
  gnosisRouterAbi,
  gnosisRouterAddress,
  sDaiAddress,
  wxdaiAbi,
  wxdaiAddress,
} from "@/generated";
import { config } from "@/wagmiConfig";

import { isUndefined } from "@/utils";
import { GetQuotesResult } from "@/utils/getQuotes";
import { waitForTransaction } from "@/utils/waitForTransaction";

import { DECIMALS, DEFAULT_CHAIN } from "@/consts";
import { IMarket, parentMarket } from "@/consts/markets";

import { mergeFromRouter, splitFromRouter } from "./useTradeExecutorPredict";
import { getSplitFromTradeExecutorCalls } from "./useTradeExecutorSplit";
import { getMinimumAmountOut } from "@/utils/swapr";

interface MarketsData {
  marketInfo: IMarket;
  getQuotesResult: GetQuotesResult;
  // notice: amount here is not the actual balance of the trade wallet,
  // instead the amount of underlying tokens the wallet will have, in case of a split from collateral
  // example: if user provided collateral to mint/ split tokens in parent market, then we add that mintAmount in here,
  // since the txns will include a split txn that will end up giving this mintAmount to the Wallet as underlying token
  // also factors in underlyingTokens from minting using SeerCredits
  // This value is handled in utils/processMarket
  amount: bigint;
}

interface PredictAllProps {
  tradeExecutor: Address;
  marketsData: MarketsData[];
  // defined if collateral needs to minted to Parent Market
  mintAmount?: bigint;
  seerCreditsSwapQuote?: SwaprV3Trade;
}

interface Call {
  to: Address | string;
  data: string | BytesLike;
  value?: bigint;
}

// Use the available SeerCredits in TradeWallet to Mint Parent market tokens
// swap sDAI to Wxdai => Convert Wxdai to xdai (wxdai.withdraw()) => mint tokens with xdai
async function getMintFromSeerCreditsCalls(
  tradeExecutor: Address,
  seerCreditSwapQuote: SwaprV3Trade,
): Promise<Call[]> {
  const quote = seerCreditSwapQuote;

  const approveCall = {
    to: sDaiAddress,
    data: encodeFunctionData({
      abi: erc20Abi,
      functionName: "approve",
      args: [
        quote.approveAddress as Address,
        parseUnits(quote.maximumAmountIn().toExact(), DECIMALS),
      ],
    }),
  };

  const swapTxn = await quote.swapTransaction({ recipient: tradeExecutor });
  const executeCall = {
    to: creditsManagerAddress,
    data: encodeFunctionData({
      abi: creditsManagerAbi,
      functionName: "execute",
      args: [
        swapTxn.to! as `0x${string}`,
        swapTxn.data! as `0x${string}`,
        parseUnits(quote.maximumAmountIn().toExact(), DECIMALS),
        wxdaiAddress,
      ],
    }),
  };

  const availableWxdai = await getMinimumAmountOut(quote);
  if (!availableWxdai) {
    throw new Error("Unable to fetch Wrapped xDAI balance.");
  }

  const withdrawCall = {
    to: wxdaiAddress,
    data: encodeFunctionData({
      abi: wxdaiAbi,
      functionName: "withdraw",
      args: [availableWxdai],
    }),
  };

  // splitPosition with xDAI
  const splitCall = {
    to: gnosisRouterAddress,
    data: encodeFunctionData({
      abi: gnosisRouterAbi,
      functionName: "splitFromBase",
      args: [parentMarket],
    }),
    value: availableWxdai,
  };

  return [approveCall, executeCall, withdrawCall, splitCall];
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
  seerCreditsSwapQuote,
}: PredictAllProps) {
  const calls: Call[] = [];

  // Note that mintAmount will be already be offset taking into account the available SeerCredits
  // so if the collateral amount is 10, then 7 can be SeerCredits and then mintAmount will be 3.
  if (seerCreditsSwapQuote) {
    const mintFromSeerCreditsCalls = await getMintFromSeerCreditsCalls(
      tradeExecutor,
      seerCreditsSwapQuote,
    );

    calls.push(...mintFromSeerCreditsCalls);
  }

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
  seerCreditsSwapQuote,
}: PredictAllProps) {
  const calls = await getTradeExecutorCalls({
    tradeExecutor,
    marketsData,
    mintAmount,
    seerCreditsSwapQuote,
  });

  const writePromise = writeContract(config, {
    address: tradeExecutor,
    abi: TradeExecutorAbi,
    functionName: "batchValueExecute",
    args: [calls.map((call) => ({ ...call, value: call?.value ?? 0n }))],
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
