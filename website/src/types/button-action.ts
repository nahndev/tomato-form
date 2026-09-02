export const ButtonActionType = {
  LINK: "link",
  MAIL: "mail",
} as const;
export type ButtonActionType = (typeof ButtonActionType)[keyof typeof ButtonActionType];

/** Mirrors `server/src/mail/recipient.types.ts`. */
export const RecipientType = {
  MAIL: "mail",
  USER: "user",
} as const;
export type RecipientType = (typeof RecipientType)[keyof typeof RecipientType];

export interface Recipient {
  type: RecipientType;
  /** Email address when type is `mail`, user uuid when type is `user`. */
  value: string;
}

export interface LinkAction {
  type: typeof ButtonActionType.LINK;
  url: string;
}

export interface MailAction {
  type: typeof ButtonActionType.MAIL;
  recipients: Recipient[];
  subject: string;
  body: string;
}

export type ButtonAction = LinkAction | MailAction;
