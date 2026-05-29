import React, { useCallback } from "react";

import { useAtlasProvider } from "@kleros/kleros-app";
import { Button } from "@kleros/ui-components-library";
import { useAccount } from "wagmi";

import { errorToast, infoToast, successToast } from "@/utils/wrapWithToast";

interface IEnsureAuth {
  children: React.ReactElement;
  className?: string;
  text?: string;
}

const EnsureAuth: React.FC<IEnsureAuth> = ({ children, className, text }) => {
  const { address } = useAccount();
  const { isVerified, isSigningIn, authoriseUser } = useAtlasProvider();

  const handleClick = useCallback(() => {
    infoToast(`Signing in User...`);

    authoriseUser()
      .then(() => successToast("Signed In successfully!"))
      .catch((err) => {
        console.log(err);
        errorToast(`Sign-In failed: ${err?.message}`);
      });
  }, [authoriseUser]);

  return isVerified ? (
    children
  ) : (
    <Button
      text={text ?? "Sign In"}
      onClick={handleClick}
      isDisabled={isSigningIn || !address}
      isLoading={isSigningIn}
      {...{ className }}
    />
  );
};

export default EnsureAuth;
