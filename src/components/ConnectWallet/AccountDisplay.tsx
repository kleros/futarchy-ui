import React from "react";

import clsx from "clsx";
import Image from "next/image";
import Identicon from "react-jdenticon";
import { useToggle } from "react-use";
import { isAddress } from "viem";
import { normalize } from "viem/ens";
import { useAccount, useEnsAvatar, useEnsName } from "wagmi";

import { shortenAddress } from "@/utils";

import AccountDetails from "./AccountDetails";

interface IIdenticonOrAvatar {
  size?: number;
  address?: `0x${string}`;
}

export const IdenticonOrAvatar: React.FC<IIdenticonOrAvatar> = ({
  size = 16,
  address: propAddress,
}) => {
  const { address: defaultAddress } = useAccount();
  const address = propAddress || defaultAddress;

  const { data: name } = useEnsName({
    address,
    chainId: 1,
  });
  const { data: avatar } = useEnsAvatar({
    name: normalize(name ?? ""),
    chainId: 1,
  });

  return avatar ? (
    <Image
      className="items-center rounded-[50%] object-cover"
      src={avatar}
      alt="avatar"
      width={size}
      height={size}
    />
  ) : (
    <div
      className="items-center"
      style={{ width: size.toString() + "px", height: size.toString() + "px" }}
    >
      <Identicon size={size} value={address} />
    </div>
  );
};

interface IAddressOrName {
  address?: `0x${string}`;
  className?: string;
}

export const AddressOrName: React.FC<IAddressOrName> = ({
  address: propAddress,
  className,
}) => {
  const { address: defaultAddress } = useAccount();
  const address = propAddress || defaultAddress;

  const { data } = useEnsName({
    address,
    chainId: 1,
  });

  return (
    <span {...{ className }}>
      {data ?? (isAddress(address!) ? shortenAddress(address) : address)}
    </span>
  );
};

export const ChainDisplay: React.FC = () => {
  const { chain } = useAccount();

  return (
    <small
      className={clsx(
        "text-klerosUIComponentsSuccess relative ml-4 text-base",
        "before:absolute before:top-1/2 before:-left-4 before:-translate-y-1/2",
        "before:bg-klerosUIComponentsSuccess before:size-2 before:rounded-full",
      )}
    >
      {chain?.name}
    </small>
  );
};

const AccountDisplay: React.FC = () => {
  const [isOpen, toggleIsOpen] = useToggle(false);
  return (
    <>
      <div
        className={clsx(
          "bg-klerosUIComponentsLightBackground ease-ease cursor-pointer rounded-[300px] transition",
          "flex content-center items-center justify-between px-3",
        )}
        onClick={toggleIsOpen}
      >
        <div className="flex min-h-8 w-fit items-center gap-3">
          <IdenticonOrAvatar size={24} />
          <AddressOrName
            className={clsx(
              "text-klerosUIComponentsPrimaryText/80 hover:text-klerosUIComponentsPrimaryText text-sm",
              "cursor-pointer transition-colors duration-200",
            )}
          />
        </div>
      </div>
      <AccountDetails {...{ isOpen, toggleIsOpen }} />
    </>
  );
};

export default AccountDisplay;
