import { Card } from "@kleros/ui-components-library";
import clsx from "clsx";
import { useLocalStorage } from "react-use";
import { useAccount } from "wagmi";

import { useTradeWallet } from "@/context/TradeWalletContext";
import { useFirstPredictionStatus } from "@/hooks/useFirstPredictionStatus";
import { useIsSubscribed } from "@/hooks/useIsSubscribed";

import LightButton from "@/components/LightButton";

import CloseIcon from "@/assets/svg/close-icon.svg";

const NotificationsBanner: React.FC = () => {
  const { address } = useAccount();
  const { tradeExecutor } = useTradeWallet();
  const { hasPredictedBefore } = useFirstPredictionStatus(tradeExecutor);
  const { isSubscribed, isLoading } = useIsSubscribed();
  const [isDismissed, setIsDismissed] = useLocalStorage(
    address
      ? `notificationsBannerDismissed:${address.toLowerCase()}`
      : "__noop__",
    false,
  );

  const isVisible =
    Boolean(address) &&
    hasPredictedBefore &&
    !isLoading &&
    !isSubscribed &&
    !isDismissed;

  return isVisible ? (
    <Card
      round
      className={clsx(
        "border-gradient-purple-blue mb-4 h-auto w-full rounded-xl border-none px-4 py-3 md:px-6",
        "flex items-center justify-between gap-2",
      )}
    >
      <p className="text-klerosUIComponentsSecondaryText text-sm">
        You are not subscribed to notifications. Go to Settings to subscribe.
      </p>
      <LightButton
        text=""
        className="p-1"
        icon={
          <CloseIcon className="[&_path]:stroke-klerosUIComponentsSecondaryText size-4" />
        }
        onPress={() => setIsDismissed(true)}
      />
    </Card>
  ) : null;
};

export default NotificationsBanner;
