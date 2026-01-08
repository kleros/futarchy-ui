import React from "react";

import { CustomAccordion } from "@kleros/ui-components-library";
import clsx from "clsx";

import { useTradeWallet } from "@/context/TradeWalletContext";
import { useTokensBalances } from "@/hooks/useTokenBalances";

import HomeIcon from "@/assets/svg/homes.svg";

import { markets } from "@/consts/markets";

import ProjectAmount from "./ProjectAmount";

const ProjectBalances: React.FC = () => {
  const { tradeExecutor } = useTradeWallet();

  const { data: marketBalances } = useTokensBalances(
    tradeExecutor,
    markets.map(({ underlyingToken }) => underlyingToken),
  );
  return (
    <CustomAccordion
      className="w-full max-w-full [&_#body-wrapper]:px-0 [&_#expand-button]:px-4!"
      items={[
        {
          title: (
            <div className="flex items-center gap-2">
              <HomeIcon className="size-6" />
              <label className="text-klerosUIComponentsPrimaryText text-sm">
                Property tokens
              </label>
            </div>
          ),
          body: (
            <div
              className={clsx(
                "grid w-full grid-cols-[repeat(auto-fit,minmax(200px,260px))] place-content-center gap-4",
              )}
            >
              {markets.map(({ name, color }, i) => (
                <ProjectAmount
                  key={name}
                  {...{ name, color }}
                  balance={marketBalances?.[i]}
                />
              ))}
            </div>
          ),
        },
      ]}
    />
  );
};

export default ProjectBalances;
