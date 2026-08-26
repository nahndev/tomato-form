import { WidgetType } from "@/types/widget";
import type { WidgetComponent, WidgetComponentRegistry } from "@/types/widget";

import { BreakWidgetItem } from "./items/BreakWidgetItem";
import { ButtonWidgetItem } from "./items/ButtonWidgetItem";
import { CheckboxWidgetItem } from "./items/CheckboxWidgetItem";
import { DateWidgetItem } from "./items/DateWidgetItem";
import { DatetimeWidgetItem } from "./items/DatetimeWidgetItem";
import { FileUploaderWidgetItem } from "./items/FileUploaderWidgetItem";
import { ImageUploaderWidgetItem } from "./items/ImageUploaderWidgetItem";
import { LabelWidgetItem } from "./items/LabelWidgetItem";
import { NumberWidgetItem } from "./items/NumberWidgetItem";
import { RadioWidgetItem } from "./items/RadioWidgetItem";
import { SelectWidgetItem } from "./items/SelectWidgetItem";
import { SessionWidgetItem } from "./items/SessionWidgetItem";
import { SignatureWidgetItem } from "./items/SignatureWidgetItem";
import { SystemFieldWidgetItem } from "./items/SystemFieldWidgetItem";
import { TextAreaWidgetItem } from "./items/TextAreaWidgetItem";
import { TextWidgetItem } from "./items/TextWidgetItem";
import { TimeWidgetItem } from "./items/TimeWidgetItem";
import { UsersWidgetItem } from "./items/UsersWidgetItem";

/**
 * The React component that renders each widget type's field - the
 * rendering half of the split. See `WidgetItems` in
 * `constants/widget/widgetItems.ts` for the data half (label, icon,
 * defaults, ...).
 */
export const WidgetComponents: WidgetComponentRegistry = {
  [WidgetType.TEXT]: TextWidgetItem as WidgetComponent,
  [WidgetType.TEXT_AREA]: TextAreaWidgetItem as WidgetComponent,
  [WidgetType.NUMBER]: NumberWidgetItem as WidgetComponent,
  [WidgetType.DATE]: DateWidgetItem as WidgetComponent,
  [WidgetType.DATETIME]: DatetimeWidgetItem as WidgetComponent,
  [WidgetType.TIME]: TimeWidgetItem as WidgetComponent,
  [WidgetType.SELECT]: SelectWidgetItem as WidgetComponent,
  [WidgetType.CHECKBOX]: CheckboxWidgetItem as WidgetComponent,
  [WidgetType.RADIO]: RadioWidgetItem as WidgetComponent,
  [WidgetType.LABEL]: LabelWidgetItem as WidgetComponent,
  [WidgetType.SIGNATURE]: SignatureWidgetItem as WidgetComponent,
  [WidgetType.BUTTON]: ButtonWidgetItem as WidgetComponent,
  [WidgetType.IMAGE_UPLOADER]: ImageUploaderWidgetItem as WidgetComponent,
  [WidgetType.FILE_UPLOADER]: FileUploaderWidgetItem as WidgetComponent,
  [WidgetType.BREAK]: BreakWidgetItem as WidgetComponent,
  [WidgetType.SESSION]: SessionWidgetItem as WidgetComponent,
  [WidgetType.USERS]: UsersWidgetItem as WidgetComponent,
  [WidgetType.CREATED_AT]: SystemFieldWidgetItem as WidgetComponent,
  [WidgetType.TEMPLATE]: SystemFieldWidgetItem as WidgetComponent,
  [WidgetType.SUBMITTED_BY]: SystemFieldWidgetItem as WidgetComponent,
};
