"use client";

import { runLinkAction } from "@/features/actions/utils/runLinkAction";
import { ButtonActionType, type ButtonAction } from "@/types/button-action";
import { createContext } from "react";

export type RunButtonAction = (action: ButtonAction) => void | Promise<void>;

/**
 * Default (template/builder) behavior: only `LINK` is meaningful without
 * extra context, so it's handled directly here. Everything else (mail, ...)
 * needs a real "where am I" to act on and is a no-op until a feature that
 * has that context (e.g. `submission`) provides a real implementation via
 * `ButtonActionProvider`.
 */
const defaultRunButtonAction: RunButtonAction = (action) => {
  if (action.type === ButtonActionType.LINK) {
    runLinkAction(action);
    return;
  }
  console.warn(`Button action "${action.type}" isn't available in this context.`);
};

export const ButtonActionContext =
  createContext<RunButtonAction>(defaultRunButtonAction);

export const ButtonActionProvider = ButtonActionContext.Provider;
