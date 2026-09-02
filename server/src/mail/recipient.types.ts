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
