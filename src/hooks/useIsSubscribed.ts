import { useAtlasProvider } from "@kleros/kleros-app";
import { useQuery } from "@tanstack/react-query";
import type { Address } from "viem";
import { useAccount } from "wagmi";

export const isSubscribedQueryKey = (address?: Address) => [
  "isSubscribed",
  address?.toLowerCase(),
];

/**
 * Checks if the connected address is subscribed to notifications,
 * without requiring the user to sign in.
 * @remarks `checkIsSubscribed` is rate-limited to 5 calls per minute per IP,
 * so the result is cached for the session. Subscribe/unsubscribe flows keep
 * the cache in sync via `setQueryData` with {@link isSubscribedQueryKey}.
 */
export const useIsSubscribed = () => {
  const { address } = useAccount();
  const { checkIsSubscribed, userExists } = useAtlasProvider();

  const { data, isLoading } = useQuery({
    enabled: Boolean(address),
    queryKey: isSubscribedQueryKey(address),
    staleTime: Infinity,
    queryFn: () => checkIsSubscribed(address!),
  });

  return { isSubscribed: userExists || (data ?? false), isLoading };
};
