import { useMemo } from "react";

import { Button, Card, DropdownSelect } from "@kleros/ui-components-library";
import clsx from "clsx";
import Link from "next/link";
import { useToggle } from "react-use";
import { useAccount } from "wagmi";

import { useTradeWallet } from "@/context/TradeWalletContext";
import { useGetWinningOutcomes } from "@/hooks/useGetWinningOutcomes";
import { useTokenBalance } from "@/hooks/useTokenBalance";

import WithHelpTooltip from "@/components/WithHelpTooltip";

import ExternalArrow from "@/assets/svg/external-arrow.svg";
import WalletIcon from "@/assets/svg/wallet.svg";

import { formatValue, isUndefined, shortenAddress } from "@/utils";

import { collateral } from "@/consts";
import { parentConditionId } from "@/consts/markets";

import { DepositInterface } from "./DepositInterface";
import MergeInterface from "./MergeInterface";
import MintInterface from "./MintInterface";
import ProjectBalances from "./ProjectBalances";
import { RedeemParentsInterface } from "./RedeemInterface";
import TradeWalletSkeleton from "./TradeWalletSkeleton";
import { WithdrawInterface } from "./WithdrawInterface";

export const TradeWallet = () => {
  const [isDepositOpen, toggleIsDepositOpen] = useToggle(false);
  const [isWithdrawOpen, toggleIsWithdrawOpen] = useToggle(false);
  const [isRedeemOpen, toggleIsRedeemOpen] = useToggle(false);
  const [isMintOpen, toggleIsMintOpen] = useToggle(false);
  const [isMergeOpen, toggleIsMergeOpen] = useToggle(false);

  const { tradeExecutor, isLoadingTradeWallet } = useTradeWallet();
  const { address: account, chain } = useAccount();

  const { data: balanceData, isLoading: isBalanceLoading } = useTokenBalance({
    address: tradeExecutor,
    token: collateral.address,
  });

  const blockExplorerUrl = chain?.blockExplorers?.default?.url;

  const { data: parentWinningOutcomes } =
    useGetWinningOutcomes(parentConditionId);
  const isParentResolved = useMemo(
    () =>
      isUndefined(parentWinningOutcomes)
        ? false
        : parentWinningOutcomes.some((val) => val === true),
    [parentWinningOutcomes],
  );

  return (
    <>
      {isLoadingTradeWallet ? <TradeWalletSkeleton /> : null}
      {account && tradeExecutor && (
        <Card
          round
          className={clsx(
            "border-gradient-purple-blue h-auto w-full rounded-xl border-none px-4 py-6 md:px-8",
            "flex flex-col gap-4",
          )}
        >
          <div className="flex flex-col max-md:gap-4 md:flex-row md:items-center md:justify-between">
            {/* Left side: title + buttons */}
            <div className="flex flex-1 flex-col gap-4">
              <div className="flex flex-col items-start gap-1.5">
                <div className="flex items-center gap-2">
                  <WalletIcon className="" />
                  <WithHelpTooltip
                    tooltipMsg={`Trade wallet allows you to make multiple predictions 
                                and related actions in a single transaction.`}
                  >
                    <h3 className="text-klerosUIComponentsPrimaryText text-base font-semibold">
                      Trade Wallet
                    </h3>
                  </WithHelpTooltip>
                </div>

                <Link
                  href={`${blockExplorerUrl}/address/${tradeExecutor}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={clsx(
                    "text-klerosUIComponentsSecondaryText hover:text-klerosUIComponentsPrimaryBlue text-sm",
                    "inline-flex items-center break-all hover:opacity-80",
                  )}
                >
                  {shortenAddress(tradeExecutor)}
                  <ExternalArrow className="[&_path]:fill-klerosUIComponentsPrimaryBlue ml-2 inline size-4" />
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="secondary"
                  small
                  text="Deposit"
                  onPress={toggleIsDepositOpen}
                />

                <Button
                  variant="secondary"
                  small
                  text="Withdraw"
                  onPress={toggleIsWithdrawOpen}
                />

                {isParentResolved ? (
                  <Button
                    onClick={() => toggleIsRedeemOpen()}
                    variant="secondary"
                    small
                    text="Redeem outcome tokens"
                  />
                ) : null}
                <DropdownSelect
                  simpleButton
                  placeholder="Advanced Options"
                  smallButton
                  selectedKey={0}
                  className="focus:shadow-none!"
                  items={[
                    { id: 1, text: "Mint", itemValue: 1 },
                    { id: 2, text: "Merge", itemValue: 2 },
                  ]}
                  callback={(selected) => {
                    switch (selected.id) {
                      case 1:
                        toggleIsMintOpen();
                        break;
                      case 2:
                      default:
                        toggleIsMergeOpen();
                        break;
                    }
                  }}
                />
              </div>
            </div>

            {/* Right side: balance */}
            <div
              className={clsx(
                "flex h-full flex-col items-start p-6 max-md:pl-0",
                "border-klerosUIComponentsStroke border-t md:border-t-0 md:border-l",
              )}
            >
              <h3 className="text-klerosUIComponentsSecondaryText text-sm">
                sDai Balance
              </h3>
              <h4 className="text-klerosUIComponentsPrimaryText text-2xl font-semibold">
                {isBalanceLoading ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  <span>{formatValue(balanceData?.value ?? 0n)}</span>
                )}
              </h4>
            </div>
          </div>
          <ProjectBalances />
        </Card>
      )}
      {isDepositOpen ? (
        <DepositInterface
          {...{
            isOpen: isDepositOpen,
            toggleIsOpen: toggleIsDepositOpen,
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            tradeExecutor: tradeExecutor!,
          }}
        />
      ) : null}
      {isWithdrawOpen ? (
        <WithdrawInterface
          {...{
            isOpen: isWithdrawOpen,
            toggleIsOpen: toggleIsWithdrawOpen,
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            tradeExecutor: tradeExecutor!,
          }}
        />
      ) : null}
      {isRedeemOpen ? (
        <RedeemParentsInterface
          {...{
            isOpen: isRedeemOpen,
            toggleIsOpen: toggleIsRedeemOpen,
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            tradeExecutor: tradeExecutor!,
          }}
        />
      ) : null}
      {isMintOpen ? (
        <MintInterface
          {...{
            isOpen: isMintOpen,
            toggleIsOpen: toggleIsMintOpen,
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            tradeExecutor: tradeExecutor!,
          }}
        />
      ) : null}
      {isMergeOpen ? (
        <MergeInterface
          {...{
            isOpen: isMergeOpen,
            toggleIsOpen: toggleIsMergeOpen,
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            tradeExecutor: tradeExecutor!,
          }}
        />
      ) : null}
    </>
  );
};
