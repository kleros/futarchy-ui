import { useState } from "react";

import { Button } from "@kleros/ui-components-library";
import { waitForTransactionReceipt } from "@wagmi/core";
import { Address } from "viem";
import { useConfig } from "wagmi";

import { useSimulateErc20Approve, useWriteErc20Approve } from "@/generated";

import { isUndefined } from "@/utils";

interface IApproveButton {
  name: string;
  amount: bigint;
  token: Address;
  spender: Address;
  callback?: () => void;
}

const ApproveButton: React.FC<IApproveButton> = ({
  name,
  amount,
  token,
  spender,
  callback,
}) => {
  const wagmiConfig = useConfig();
  const [isSending, setIsSending] = useState(false);

  const {
    data: approveConfig,
    isLoading: isSimulating,
    isError: isSimulationError,
  } = useSimulateErc20Approve({
    address: token,
    args: [spender, amount],
  });

  const { writeContractAsync: approve } = useWriteErc20Approve();

  const handleApprove = async () => {
    if (isUndefined(approveConfig)) return;
    setIsSending(true);

    const hash = await approve(approveConfig.request);
    await waitForTransactionReceipt(wagmiConfig, {
      hash,
      confirmations: 2,
    });

    setIsSending(false);
    callback?.();
  };

  return (
    <Button
      onPress={handleApprove}
      text={`Approve ${name}`}
      isLoading={isSending || isSimulating}
      isDisabled={isSending || isSimulating || isSimulationError}
    />
  );
};

export default ApproveButton;
