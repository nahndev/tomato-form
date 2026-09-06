import DateValue from "@/features/board/components/submission/display/DateValue";
import NumberValue from "@/features/board/components/submission/display/NumberValue";
import TextValue from "@/features/board/components/submission/display/TextValue";
import type { DisplayValueProps } from "@/features/board/components/submission/display/types";
import UnknownValue from "@/features/board/components/submission/display/UnknownValue";
import { DisplayType } from "@/types/display-type";

/** One `DisplayComponent` per `DisplayType`, formatting a widget's `SubmissionDisplayValue` for board columns. */
export const DISPLAY_VALUE_REGISTRY: Record<
  DisplayType,
  React.ComponentType<DisplayValueProps>
> = {
  [DisplayType.TEXT]: TextValue,
  [DisplayType.DATE]: DateValue,
  [DisplayType.NUMBER]: NumberValue,
  [DisplayType.UNKNOWN]: UnknownValue,
};
