import {
  Type,
  AlignLeft,
  Hash,
  Calendar,
  CalendarClock,
  Timer,
  List,
  CheckSquare,
  CircleDot,
  FileText,
  PenTool,
  MousePointerClick,
  Image as ImageIcon,
  Paperclip,
  Minus,
  Clock,
} from "lucide-react";
import type { WidgetDefinition, WidgetRegistry } from "./types";

import { Field as TextField } from "./text/Field";
import * as textDefaults from "./text/defaults";

import { Field as TextAreaField } from "./text-area/Field";
import * as textAreaDefaults from "./text-area/defaults";

import { Field as NumberField } from "./number/Field";
import * as numberDefaults from "./number/defaults";

import { Field as DateField } from "./date/Field";
import * as dateDefaults from "./date/defaults";

import { Field as DatetimeField } from "./datetime/Field";
import * as datetimeDefaults from "./datetime/defaults";

import { Field as TimeField } from "./time/Field";
import * as timeDefaults from "./time/defaults";

import { Field as SelectField } from "./select/Field";
import * as selectDefaults from "./select/defaults";

import { Field as CheckboxField } from "./checkbox/Field";
import * as checkboxDefaults from "./checkbox/defaults";

import { Field as RadioField } from "./radio/Field";
import * as radioDefaults from "./radio/defaults";

import { Field as LabelField } from "./label/Field";
import * as labelDefaults from "./label/defaults";

import { Field as SignatureField } from "./signature/Field";
import * as signatureDefaults from "./signature/defaults";

import { Field as ButtonField } from "./button/Field";
import * as buttonDefaults from "./button/defaults";

import { Field as ImageUploaderField } from "./image-uploader/Field";
import * as imageUploaderDefaults from "./image-uploader/defaults";

import { Field as FileUploaderField } from "./file-uploader/Field";
import * as fileUploaderDefaults from "./file-uploader/defaults";

import { Field as BreakField } from "./break/Field";
import * as breakDefaults from "./break/defaults";

import { Field as SessionField } from "./session/Field";
import * as sessionDefaults from "./session/defaults";

export const WIDGET_REGISTRY: WidgetRegistry = {
  text: {
    type: "text",
    label: "Text",
    icon: Type,
    description: "Single-line text",
    isDataField: true,
    Field: TextField as WidgetDefinition["Field"],
    defaultSettings: textDefaults.DEFAULT_SETTINGS,
    defaultLayout: textDefaults.DEFAULT_LAYOUT,
  },
  "text-area": {
    type: "text-area",
    label: "Text Area",
    icon: AlignLeft,
    description: "Multi-line text with auto-growing rows",
    isDataField: true,
    Field: TextAreaField as WidgetDefinition["Field"],
    defaultSettings: textAreaDefaults.DEFAULT_SETTINGS,
    defaultLayout: textAreaDefaults.DEFAULT_LAYOUT,
  },
  number: {
    type: "number",
    label: "Number",
    icon: Hash,
    description: "Numeric input",
    isDataField: true,
    Field: NumberField as WidgetDefinition["Field"],
    defaultSettings: numberDefaults.DEFAULT_SETTINGS,
    defaultLayout: numberDefaults.DEFAULT_LAYOUT,
  },
  date: {
    type: "date",
    label: "Date",
    icon: Calendar,
    description: "Date only",
    isDataField: true,
    Field: DateField as WidgetDefinition["Field"],
    defaultSettings: dateDefaults.DEFAULT_SETTINGS,
    defaultLayout: dateDefaults.DEFAULT_LAYOUT,
  },
  datetime: {
    type: "datetime",
    label: "Date & Time",
    icon: CalendarClock,
    description: "Date and time (stored as epoch ms)",
    isDataField: true,
    Field: DatetimeField as WidgetDefinition["Field"],
    defaultSettings: datetimeDefaults.DEFAULT_SETTINGS,
    defaultLayout: datetimeDefaults.DEFAULT_LAYOUT,
  },
  time: {
    type: "time",
    label: "Time",
    icon: Timer,
    description: "Time only",
    isDataField: true,
    Field: TimeField as WidgetDefinition["Field"],
    defaultSettings: timeDefaults.DEFAULT_SETTINGS,
    defaultLayout: timeDefaults.DEFAULT_LAYOUT,
  },
  select: {
    type: "select",
    label: "Select",
    icon: List,
    description: "Dropdown select",
    isDataField: true,
    Field: SelectField as WidgetDefinition["Field"],
    defaultSettings: selectDefaults.DEFAULT_SETTINGS,
    defaultLayout: selectDefaults.DEFAULT_LAYOUT,
  },
  checkbox: {
    type: "checkbox",
    label: "Checkbox",
    icon: CheckSquare,
    description: "A list of checkboxes (multi-select)",
    isDataField: true,
    Field: CheckboxField as WidgetDefinition["Field"],
    defaultSettings: checkboxDefaults.DEFAULT_SETTINGS,
    defaultLayout: checkboxDefaults.DEFAULT_LAYOUT,
  },
  radio: {
    type: "radio",
    label: "Radio",
    icon: CircleDot,
    description: "A list of radio buttons (single-select)",
    isDataField: true,
    Field: RadioField as WidgetDefinition["Field"],
    defaultSettings: radioDefaults.DEFAULT_SETTINGS,
    defaultLayout: radioDefaults.DEFAULT_LAYOUT,
  },
  label: {
    type: "label",
    label: "Label",
    icon: FileText,
    description: "Readonly display content",
    isDataField: false,
    Field: LabelField as WidgetDefinition["Field"],
    defaultSettings: labelDefaults.DEFAULT_SETTINGS,
    defaultLayout: labelDefaults.DEFAULT_LAYOUT,
  },
  signature: {
    type: "signature",
    label: "Signature",
    icon: PenTool,
    description: "Lets the person sign with their pointer",
    isDataField: true,
    Field: SignatureField as WidgetDefinition["Field"],
    defaultSettings: signatureDefaults.DEFAULT_SETTINGS,
    defaultLayout: signatureDefaults.DEFAULT_LAYOUT,
  },
  button: {
    type: "button",
    label: "Button",
    icon: MousePointerClick,
    description: "A clickable button, optionally linking to a URL",
    isDataField: false,
    Field: ButtonField as WidgetDefinition["Field"],
    defaultSettings: buttonDefaults.DEFAULT_SETTINGS,
    defaultLayout: buttonDefaults.DEFAULT_LAYOUT,
  },
  "image-uploader": {
    type: "image-uploader",
    label: "Image Upload",
    icon: ImageIcon,
    description: "Upload and preview an image",
    isDataField: true,
    Field: ImageUploaderField as WidgetDefinition["Field"],
    defaultSettings: imageUploaderDefaults.DEFAULT_SETTINGS,
    defaultLayout: imageUploaderDefaults.DEFAULT_LAYOUT,
  },
  "file-uploader": {
    type: "file-uploader",
    label: "File Upload",
    icon: Paperclip,
    description: "Upload files and show them as a list",
    isDataField: true,
    Field: FileUploaderField as WidgetDefinition["Field"],
    defaultSettings: fileUploaderDefaults.DEFAULT_SETTINGS,
    defaultLayout: fileUploaderDefaults.DEFAULT_LAYOUT,
  },
  break: {
    type: "break",
    label: "Break",
    icon: Minus,
    description: "A full-width divider line",
    isDataField: false,
    Field: BreakField as WidgetDefinition["Field"],
    defaultSettings: breakDefaults.DEFAULT_SETTINGS,
    defaultLayout: breakDefaults.DEFAULT_LAYOUT,
  },
  session: {
    type: "session",
    label: "Session",
    icon: Clock,
    description: "Full-width, fixed block",
    isDataField: false,
    Field: SessionField as WidgetDefinition["Field"],
    defaultSettings: sessionDefaults.DEFAULT_SETTINGS,
    defaultLayout: sessionDefaults.DEFAULT_LAYOUT,
  },
};

export const WIDGET_LIST: WidgetDefinition[] = Object.values(WIDGET_REGISTRY);
