"use client";

import { useHandler, useTransaction } from "@tomato/sync";
import { TemplateHandler } from "../handlers/TemplateHandler";

export interface TemplateActions {
  setName: (name: string) => void;
  requestPublish: () => void;
  settlePublish: () => void;
}

/**
 * Action-only, no exposed state - mutates the doc through `TemplateHandler`.
 * No `useCallback` here - `templateHandler` and `transact` are already
 * stable references.
 */
export function useTemplateActions(): TemplateActions {
  const templateHandler = useHandler(TemplateHandler);
  const transact = useTransaction();

  return {
    setName: (name) => transact(() => templateHandler.setName(name)),
    requestPublish: () => transact(() => templateHandler.requestPublish()),
    settlePublish: () => transact(() => templateHandler.settlePublish()),
  };
}
