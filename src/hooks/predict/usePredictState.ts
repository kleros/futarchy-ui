import { useReducer } from "react";

import { Address } from "viem";

export interface PredictState {
  createdTradeWallet?: Address;
  isCreatingWallet: boolean;
  isAddingCollateral: boolean;
  isCollateralAdded: boolean;
  isProcessingMarkets: boolean;
  isLoadingQuotes: boolean;
  isPredictionSuccessful: boolean;
  error?: string;
  isSending: boolean;
}

const initialState: PredictState = {
  isCreatingWallet: false,
  isAddingCollateral: false,
  isCollateralAdded: false,
  isProcessingMarkets: false,
  isLoadingQuotes: false,
  isPredictionSuccessful: false,
  isSending: false,
  createdTradeWallet: undefined,
  error: undefined,
};

type Action =
  | {
      type: "SET_FLAG";
      key: keyof PredictState;
      value: PredictState[keyof PredictState];
    }
  | { type: "RESET" };

function reducer(state: PredictState, action: Action): PredictState {
  switch (action.type) {
    case "SET_FLAG":
      return { ...state, [action.key]: action.value };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export function usePredictState() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setFlag = <K extends keyof PredictState>(
    key: K,
    value: PredictState[K],
  ) => dispatch({ type: "SET_FLAG", key, value });

  const reset = () => dispatch({ type: "RESET" });

  return { state, setFlag, reset };
}
