import { AbsoluteLayout } from "@/features/template/libs/grid-layout/types";
import { Session } from "@/types/template";

export function useMoving(session: Session | null) {
  return [null as AbsoluteLayout | null] as const;
}
