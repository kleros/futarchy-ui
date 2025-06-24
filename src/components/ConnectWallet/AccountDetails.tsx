import { Button, Copiable, Modal } from "@kleros/ui-components-library";
import clsx from "clsx";
import Link from "next/link";
import { useAccount, useDisconnect } from "wagmi";

import {
  AddressOrName,
  ChainDisplay,
  IdenticonOrAvatar,
} from "./AccountDisplay";

interface IAccountDetails {
  isOpen?: boolean;
  toggleIsOpen: () => void;
}
const AccountDetails: React.FC<IAccountDetails> = ({
  isOpen,
  toggleIsOpen,
}) => {
  const { disconnect } = useDisconnect();

  return (
    <Modal
      isDismissable
      className={clsx(
        "absolute top-0 right-2 left-auto h-auto w-75.5",
        "mt-18 flex flex-col items-center justify-center gap-4 px-4 py-8",
        "shadow-default rounded-base border-klerosUIComponentsStroke bg-klerosUIComponentsWhiteBackground border",
        "animate-slide-in-left z-40",
      )}
      isOpen={isOpen}
      onOpenChange={toggleIsOpen}
    >
      <IdenticonOrAvatar size={56} />
      <CopiableAddressDisplay />
      <ChainDisplay />
      <Button
        variant="secondary"
        small
        text="Disconnect"
        onPress={() => disconnect()}
      />
    </Modal>
  );
};

export const CopiableAddressDisplay: React.FC = () => {
  const { address, chain } = useAccount();

  const explorerUrl = `${chain?.blockExplorers?.default.url}/address/${address}`;
  return (
    <Copiable copiableContent={address ?? ""} tooltipProps={{ small: true }}>
      <Link href={explorerUrl} target="_blank" rel="noopener noreferrer">
        <AddressOrName
          className={clsx(
            "text-klerosUIComponentsPrimaryText hover:text-klerosUIComponentsPrimaryBlue hover:underline",
            "cursor-pointer",
          )}
        />
      </Link>
    </Copiable>
  );
};
export default AccountDetails;
