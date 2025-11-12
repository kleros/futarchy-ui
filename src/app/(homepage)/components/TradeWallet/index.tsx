import { Button, Card } from "@kleros/ui-components-library";
import clsx from "clsx";
import Link from "next/link";
import { useToggle } from "react-use";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";

import { useCheckTradeExecutorCreated } from "@/hooks/tradeWallet/useCheckTradeExecutorCreated";
import { useCreateTradeExecutor } from "@/hooks/tradeWallet/useCreateTradeExecutor";
import { useTokenBalance } from "@/hooks/useTokenBalance";

import WithHelpTooltip from "@/components/WithHelpTooltip";

import ExternalArrow from "@/assets/svg/external-arrow.svg";

import { collateral } from "@/consts";

import { DepositInterface } from "./DepositInterface";
import { RedeemParentsInterface } from "./RedeemInterface";
import TradeWalletSkeleton from "./TradeWalletSkeleton";
import { WithdrawInterface } from "./WithdrawInterface";

export const TradeWallet = () => {
  const [isDepositOpen, toggleIsDepositOpen] = useToggle(false);
  const [isWithdrawOpen, toggleIsWithdrawOpen] = useToggle(false);
  const [isRedeemOpen, toggleIsRedeemOpen] = useToggle(false);

  const { address: account, chain } = useAccount();
  const { data: checkTradeExecutorResult, isLoading: isLoadingTradeWallet } =
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
      {isLoadingTradeWallet ? <TradeWalletSkeleton /> : null}
      {account &&
        !isLoadingTradeWallet &&
        !checkTradeExecutorResult?.isCreated && (
          <Card
            round
            className="border-gradient-purple-blue mt-12 h-auto w-full border-none px-4 py-6 md:px-8"
          >
            <h3 className="text-klerosUIComponentsPrimaryText mb-3 text-xl font-semibold">
              Trade Wallet
            </h3>
            <p className="text-klerosUIComponentsSecondaryText mb-6 text-sm leading-relaxed">
              Create a trade wallet to make multiple predictions and redeem
              tokens in a single transaction.
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
          className={clsx(
            "border-gradient-purple-blue mt-12 h-auto w-full border-none px-4 py-6 md:px-8",
            "flex flex-col md:flex-row md:items-center md:justify-between",
          )}
        >
          {/* Left side: title + buttons */}
          <div className="flex flex-1 flex-col gap-3">
            <div className="mb-4 flex flex-col items-start gap-2">
              <WithHelpTooltip tooltipMsg="Trade wallet allows you to make multiple predictions and related actions in a single transaction.">
                <h3 className="text-klerosUIComponentsPrimaryText text-2xl font-semibold">
                  Trade Wallet
                </h3>
              </WithHelpTooltip>

              <Link
                href={`${blockExplorerUrl}/address/${checkTradeExecutorResult?.predictedAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className={clsx(
                  "text-klerosUIComponentsSecondaryText hover:text-klerosUIComponentsPrimaryBlue text-base",
                  "inline-flex items-center break-all hover:opacity-80",
                )}
              >
                {checkTradeExecutorResult?.predictedAddress}
                <ExternalArrow className="ml-2 inline size-4" />
              </Link>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="secondary"
                small
                text="Deposit DAI"
                onPress={toggleIsDepositOpen}
              />

              <Button
                variant="secondary"
                small
                text="Withdraw DAI"
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
