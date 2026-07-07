import type { KeyboardEvent, PointerEvent } from "react";

function isActivationKey(key: string) {
  return key === "Enter" || key === " ";
}

function mountOnInteractionCapture(
  mount: () => void,
  event: PointerEvent<HTMLElement> | KeyboardEvent<HTMLElement>,
) {
  if (
    event.type === "keydown" &&
    !isActivationKey((event as KeyboardEvent).key)
  ) {
    return;
  }
  mount();
}

export function getMountOnInteractionCaptureProps(mount: () => void) {
  const handler = (
    event: PointerEvent<HTMLElement> | KeyboardEvent<HTMLElement>,
  ) => mountOnInteractionCapture(mount, event);

  return {
    onPointerDownCapture: handler,
    onKeyDownCapture: handler,
  };
}
