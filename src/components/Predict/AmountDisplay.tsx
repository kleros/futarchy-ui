import { BigNumberField } from "@kleros/ui-components-library";
import { formatUnits } from "viem";

import InfoIcon from "@/assets/svg/info.svg";
import MovieIcon from "@/assets/svg/movie.svg";

import { formatValue, isUndefined } from "@/utils";

import { DECIMALS } from "@/consts";

interface IAmountDisplay {
  value?: bigint;
  underlyingBalance?: bigint;
}
const AmountDisplay: React.FC<IAmountDisplay> = ({
  value,
  underlyingBalance,
}) => {
  return (
    <div className="flex w-full flex-col">
      <span className="text-klerosUIComponentsSecondaryText mb-1 text-sm">
        You get
      </span>
      <div className="bg-klerosUIComponentsMediumBlue rounded-base flex h-min items-center">
        <BigNumberField
          className="mr-4 w-24 flex-1 [&_input]:rounded-r-none [&_input]:border-r-0"
          inputProps={{ className: "text-klerosUIComponentsSecondaryText" }}
          isReadOnly
          placeholder="Movie tokens"
          aria-label="Movie token amount"
          value={formatUnits(value ?? 0n, DECIMALS)}
        />
        <div className="flex items-center gap-2 pr-3">
          <MovieIcon className="size-6" />
          <label className="text-klerosUIComponentsPrimaryText text-sm">
            Movie tokens
          </label>
        </div>
      </div>
      {!isUndefined(underlyingBalance) ? (
        <span className="text-klerosUIComponentsPrimaryText mt-1 text-xs">
          {`Available: ${formatValue(underlyingBalance)}`}
        </span>
      ) : null}

      {!isUndefined(value) ? (
        <div className="mt-8 flex w-full items-center justify-center gap-2">
          <InfoIcon className="size-4" />
          <p className="text-klerosUIComponentsSecondaryText text-sm">
            {`With ${formatValue(value)} sDAI you get ${formatValue(value)} movie tokens in each movie.`}
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default AmountDisplay;
