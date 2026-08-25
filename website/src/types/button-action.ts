export enum ButtonActionType {
  LINK = "link",
  MAIL = "mail",
  SUBMIT = "submit",
  RETURN = "return",
  RESET = "reset",
}

/** Mirrors `server/src/mail/recipient.types.ts`. */
export enum RecipientType {
  MAIL = "mail",
  USER = "user",
}

export interface Recipient {
  type: RecipientType;
  /** Email address when type is `mail`, user uuid when type is `user`. */
  value: string;
}

export interface LinkAction {
  type: ButtonActionType.LINK;
  url: string;
}

export interface MailAction {
  type: ButtonActionType.MAIL;
  recipients: Recipient[];
  subject: string;
  body: string;
}

export interface SubmitAction {
  type: ButtonActionType.SUBMIT;
  /** Explicit target session id. Unset = next session in declared order. */
  toSessionId?: string;
}

export interface ReturnAction {
  type: ButtonActionType.RETURN;
}

export interface ResetAction {
  type: ButtonActionType.RESET;
}

export type ButtonAction =
  | LinkAction
  | MailAction
  | SubmitAction
  | ReturnAction
  | ResetAction;
