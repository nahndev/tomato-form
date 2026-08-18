"use client";

import { ButtonActionType, type ButtonAction } from "@/types/button-action";
import { createContext, useContext } from "react";

export type RunButtonAction = (action: ButtonAction) => void | Promise<void>;

/**
 * Default (unwrapped) behavior: only `LINK` is meaningful without extra
 * context, so it's handled directly here. Everything else (mail, session
 * navigation) needs a real "where am I" to act on and is a no-op until a
 * feature that has that context (e.g. `submission`) provides a real
 * implementation via `ButtonActionProvider`.
 */
const defaultRunButtonAction: RunButtonAction = (action) => {
  if (action.type === ButtonActionType.LINK) {
    window.open(action.url, "_blank", "noopener,noreferrer");
    return;
  }
  console.warn(`Button action "${action.type}" isn't available in this context.`);
};

const ButtonActionContext = createContext<RunButtonAction>(defaultRunButtonAction);

export const ButtonActionProvider = ButtonActionContext.Provider;

export function useRunButtonAction(): RunButtonAction {
  return useContext(ButtonActionContext);
}
