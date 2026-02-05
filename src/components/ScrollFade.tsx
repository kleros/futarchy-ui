import React, { useEffect, useRef, useState } from "react";

import clsx from "clsx";

type ScrollFadeProps = {
  children: React.ReactNode;
  className?: string;
  fadeSize?: number; // px
};

/**
 * Self-contained scrollable wrapper with automatic top/bottom fades.
 * Manages its own overflow and shrink behavior; requires a bounded height.
 */
export const ScrollFade: React.FC<ScrollFadeProps> = ({
  children,
  className,
  fadeSize = 24,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const EPSILON = 2; // px tolerance for sub-pixel / animation noise

    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;

      const maxScrollable = scrollHeight - clientHeight;
      const hasOverflow = maxScrollable > EPSILON;

      const atTop = scrollTop <= EPSILON;
      const atBottom = scrollTop >= maxScrollable - EPSILON;

      setShowTop(hasOverflow && !atTop);
      setShowBottom(hasOverflow && !atBottom);
    };

    update();

    el.addEventListener("scroll", update);
    window.addEventListener("resize", update);

    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      className={clsx("relative min-h-0", "flex flex-1 flex-col", className)}
    >
      {/* Top fade */}
      {showTop && (
        <div
          className={clsx(
            "pointer-events-none absolute top-0 right-0 left-0 z-10",
            "from-klerosUIComponentsWhiteBackground bg-gradient-to-b to-transparent",
          )}
          style={{
            height: fadeSize,
          }}
        />
      )}

      {/* Scroll container */}
      <div
        ref={ref}
        className={clsx(
          "w-full overflow-hidden overflow-y-auto",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
      >
        {children}
      </div>

      {/* Bottom fade */}
      {showBottom && (
        <div
          className={clsx(
            "pointer-events-none absolute right-0 bottom-0 left-0 z-10",
            "from-klerosUIComponentsWhiteBackground bg-gradient-to-t to-transparent",
          )}
          style={{
            height: fadeSize,
          }}
        />
      )}
    </div>
  );
};
