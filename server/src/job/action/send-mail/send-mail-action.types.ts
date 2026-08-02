export enum RecipientType {
  MAIL = "mail",
  USER = "user",
}

export interface Recipient {
  type: RecipientType;
  // Email address when type is `mail`, user uuid when type is `user`.
  value: string;
}

export interface MailContent {
  subject: string;
  body: string;
}

export interface SendMailPayload {
  recipients: Recipient[];
  content: MailContent;
}
