import { Button, Card } from "@kleros/ui-components-library";
import clsx from "clsx";
import Link from "next/link";
import { useToggle } from "react-use";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";

import { useCheckTradeExecutorCreated } from "@/hooks/tradeWallet/useCheckTradeExecutorCreated";
import { useCreateTradeExecutor } from "@/hooks/tradeWallet/useCreateTradeExecutor";
import { useTokenBalance } from "@/hooks/useTokenBalance";

import { collateral } from "@/consts";

import { DepositInterface } from "./DepositInterface";
import { RedeemParentsInterface } from "./RedeemInterface";
import { WithdrawInterface } from "./WithdrawInterface";

export const TradeWallet = () => {
  const [isDepositOpen, toggleIsDepositOpen] = useToggle(false);
  const [isWithdrawOpen, toggleIsWithdrawOpen] = useToggle(false);
  const [isRedeemOpen, toggleIsRedeemOpen] = useToggle(false);

  const { address: account, chain } = useAccount();
  const { data: checkTradeExecutorResult } =
    useCheckTradeExecutorCreated(account);
  const createTradeExecutorMutate = useCreateTradeExecutor();

  const { data: balanceData, isLoading: isBalanceLoading } = useTokenBalance({
    address: checkTradeExecutorResult?.predictedAddress,
    token: collateral.address,
  });
  const balance = balanceData
    ? Number(formatUnits(balanceData.value, balanceData.decimals))
    : 0;

  const blockExplorerUrl = chain?.blockExplorers?.default?.url;

  return (
    <>
      {account && !checkTradeExecutorResult?.isCreated && (
        <Card
          round
          className="border-gradient-purple-blue mt-12 h-auto w-full border-none px-4 py-6 md:px-8"
        >
          <h3 className="text-klerosUIComponentsPrimaryText mb-3 text-xl font-semibold">
            Trade Wallet
          </h3>
          <p className="text-klerosUIComponentsSecondaryText mb-6 text-sm leading-relaxed">
            Create a trade wallet to make multiple predictions and redeem tokens
            in a single transaction.
          </p>
          <Button
            onPress={() => createTradeExecutorMutate.mutate({ account })}
            isDisabled={createTradeExecutorMutate.isPending}
            isLoading={createTradeExecutorMutate.isPending}
            text="Create Wallet"
          />
        </Card>
      )}
      {account && checkTradeExecutorResult?.isCreated && (
        <Card
          round
          className="border-gradient-purple-blue mt-12 h-auto w-full border-none px-4 py-6 md:px-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            {/* Left side: title + buttons */}
            <div className="flex-1 space-y-3 p-6">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-klerosUIComponentsPrimaryText text-xl font-semibold">
                  Trade Wallet
                </h3>
                <Link
                  href={`${blockExplorerUrl}/address/${checkTradeExecutorResult?.predictedAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={clsx(
                    "text-klerosUIComponentsSecondaryText text-sm",
                    "inline-block leading-relaxed break-all hover:opacity-80",
                  )}
                >
                  {checkTradeExecutorResult?.predictedAddress}
                </Link>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  small
                  text="Deposit sDAI"
                  onPress={toggleIsDepositOpen}
                />

                <Button
                  variant="secondary"
                  small
                  text="Withdraw sDAI"
                  onPress={toggleIsWithdrawOpen}
                />

                <Button
                  onClick={() => toggleIsRedeemOpen()}
                  variant="secondary"
                  small
                  text="Redeem outcome tokens"
                />
              </div>
            </div>

            {/* Right side: balance */}
            <div className="flex flex-col items-center gap-2 border-t border-white p-6 md:border-t-0 md:border-l">
              <h3 className="text-klerosUIComponentsSecondaryText text-xl font-semibold">
                sDai Balance
              </h3>
              <h4 className="text-klerosUIComponentsPrimaryText font-semibold">
                {isBalanceLoading ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  <span>{balance.toFixed(2)}</span>
                )}
              </h4>
            </div>
          </div>
        </Card>
      )}
      <DepositInterface
        {...{
          isOpen: isDepositOpen,
          toggleIsOpen: toggleIsDepositOpen,
          // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
          tradeExecutor: checkTradeExecutorResult?.predictedAddress!,
        }}
      />
      <WithdrawInterface
        {...{
          isOpen: isWithdrawOpen,
          toggleIsOpen: toggleIsWithdrawOpen,
          // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
          tradeExecutor: checkTradeExecutorResult?.predictedAddress!,
        }}
      />
      <RedeemParentsInterface
        {...{
          isOpen: isRedeemOpen,
          toggleIsOpen: toggleIsRedeemOpen,
          // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
          tradeExecutor: checkTradeExecutorResult?.predictedAddress!,
        }}
      />
    </>
  );
};
