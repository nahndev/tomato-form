import { OpenLinkActionSetup } from "@/features/actions/components/OpenLinkActionSetup";
import { MailActionSetup } from "@/features/actions/components/MailActionSetup";
import {
  ButtonActionType,
  type ButtonAction,
  type LinkAction,
  type MailAction,
} from "@/types/button-action";
import type { ComponentType } from "react";

export interface ActionSetupProps<T extends ButtonAction> {
  action: T;
  onChange: (next: T) => void;
}

export interface ActionDefinition<T extends ButtonAction> {
  label: string;
  createDefault: () => T;
  SetupComponent: ComponentType<ActionSetupProps<T>>;
}

/**
 * Everything the property editor needs to know about a `ButtonActionType`,
 * keyed by type. Adding a new action type only requires one entry here -
 * `ActionsDescriptor` renders off this registry instead of switching on
 * `action.type` itself.
 */
export const ACTION_REGISTRY: {
  [ButtonActionType.LINK]: ActionDefinition<LinkAction>;
  [ButtonActionType.MAIL]: ActionDefinition<MailAction>;
} = {
  [ButtonActionType.LINK]: {
    label: "Open link",
    createDefault: () => ({ type: ButtonActionType.LINK, url: "" }),
    SetupComponent: OpenLinkActionSetup,
  },
  [ButtonActionType.MAIL]: {
    label: "Send mail",
    createDefault: () => ({
      type: ButtonActionType.MAIL,
      recipients: [],
      subject: "",
      body: "",
    }),
    SetupComponent: MailActionSetup,
  },
};

export function getActionDefinition<T extends ButtonAction>(
  action: T,
): ActionDefinition<T> {
  return ACTION_REGISTRY[action.type] as ActionDefinition<T>;
}
