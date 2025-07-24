"use client";
import { createContext, useContext, useState } from "react";

import { useDebounce } from "react-use";

type CardContextType = {
  activeCardId: string | null;
  debouncedActiveCardId: string | null;
  setActiveCardId: (id: string | null) => void;
};

const CardInteractionContext = createContext<CardContextType | undefined>(
  undefined,
);

export const useCardInteraction = () => {
  const context = useContext(CardInteractionContext);
  if (!context) throw new Error("Must use within CardInteractionProvider");
  return context;
};

export const CardInteractionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [debouncedActiveCardId, setDebouncedActiveCardId] = useState<
    string | null
  >(null);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  useDebounce(
    (id: string | null) => {
      setDebouncedActiveCardId(id);
    },
    150,
    [activeCardId],
  );

  return (
    <CardInteractionContext.Provider
      value={{ activeCardId, debouncedActiveCardId, setActiveCardId }}
    >
      {children}
    </CardInteractionContext.Provider>
  );
};
