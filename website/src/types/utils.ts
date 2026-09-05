import { PropsWithChildren } from "react";

export type ConstType<T> = T[keyof T];
export type Nullable<T> = T | null | undefined;
export type ComponentProps<T> = PropsWithChildren<{ className?: string } & T>;
