import { BaseError } from "viem";

interface Cause {
  data?: {
    message?: string;
  };
}

export const formatError = (error: Error | null): string | undefined => {
  if (!error) {
    return undefined;
  }

  if (error instanceof BaseError) {
    const cause = error.cause as Cause;
    if (cause?.data?.message) {
      return cause.data.message;
    }
    return error.shortMessage;
  }

  return error.message;
};
