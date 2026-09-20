export type UUID = string;

export interface SubjectInterface {
  uuid: UUID;
  name: string;
  avatar: string;
}

export interface EventInterface {
  uuid: UUID;
  start: number;
  end: number;
  subject: UUID;
  title: string;
  color: string;
}

export const TimelineDndType = {
  EVENT: "@timeline/event",
} as const;
export type TimelineDndType =
  (typeof TimelineDndType)[keyof typeof TimelineDndType];
