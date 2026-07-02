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
import { DEFAULT_SETTINGS } from "./settings";
import { DEFAULT_LAYOUTS } from "./layouts";

import { Field as TextField } from "./items/text";
import { Field as TextAreaField } from "./items/text-area";
import { Field as NumberField } from "./items/number";
import { Field as DateField } from "./items/date";
import { Field as DatetimeField } from "./items/datetime";
import { Field as TimeField } from "./items/time";
import { Field as SelectField } from "./items/select";
import { Field as CheckboxField } from "./items/checkbox";
import { Field as RadioField } from "./items/radio";
import { Field as LabelField } from "./items/label";
import { Field as SignatureField } from "./items/signature";
import { Field as ButtonField } from "./items/button";
import { Field as ImageUploaderField } from "./items/image-uploader";
import { Field as FileUploaderField } from "./items/file-uploader";
import { Field as BreakField } from "./items/break";
import { Field as SessionField } from "./items/session";

export const WIDGET_REGISTRY: WidgetRegistry = {
  text: {
    type: "text",
    label: "Text",
    icon: Type,
    description: "Single-line text",
    isDataField: true,
    Field: TextField as WidgetDefinition["Field"],
    defaultSettings: DEFAULT_SETTINGS.text,
    defaultLayout: DEFAULT_LAYOUTS.text,
  },
  "text-area": {
    type: "text-area",
    label: "Text Area",
    icon: AlignLeft,
    description: "Multi-line text with auto-growing rows",
    isDataField: true,
    Field: TextAreaField as WidgetDefinition["Field"],
    defaultSettings: DEFAULT_SETTINGS["text-area"],
    defaultLayout: DEFAULT_LAYOUTS["text-area"],
  },
  number: {
    type: "number",
    label: "Number",
    icon: Hash,
    description: "Numeric input",
    isDataField: true,
    Field: NumberField as WidgetDefinition["Field"],
    defaultSettings: DEFAULT_SETTINGS.number,
    defaultLayout: DEFAULT_LAYOUTS.number,
  },
  date: {
    type: "date",
    label: "Date",
    icon: Calendar,
    description: "Date only",
    isDataField: true,
    Field: DateField as WidgetDefinition["Field"],
    defaultSettings: DEFAULT_SETTINGS.date,
    defaultLayout: DEFAULT_LAYOUTS.date,
  },
  datetime: {
    type: "datetime",
    label: "Date & Time",
    icon: CalendarClock,
    description: "Date and time (stored as epoch ms)",
    isDataField: true,
    Field: DatetimeField as WidgetDefinition["Field"],
    defaultSettings: DEFAULT_SETTINGS.datetime,
    defaultLayout: DEFAULT_LAYOUTS.datetime,
  },
  time: {
    type: "time",
    label: "Time",
    icon: Timer,
    description: "Time only",
    isDataField: true,
    Field: TimeField as WidgetDefinition["Field"],
    defaultSettings: DEFAULT_SETTINGS.time,
    defaultLayout: DEFAULT_LAYOUTS.time,
  },
  select: {
    type: "select",
    label: "Select",
    icon: List,
    description: "Dropdown select",
    isDataField: true,
    Field: SelectField as WidgetDefinition["Field"],
    defaultSettings: DEFAULT_SETTINGS.select,
    defaultLayout: DEFAULT_LAYOUTS.select,
  },
  checkbox: {
    type: "checkbox",
    label: "Checkbox",
    icon: CheckSquare,
    description: "A list of checkboxes (multi-select)",
    isDataField: true,
    Field: CheckboxField as WidgetDefinition["Field"],
    defaultSettings: DEFAULT_SETTINGS.checkbox,
    defaultLayout: DEFAULT_LAYOUTS.checkbox,
  },
  radio: {
    type: "radio",
    label: "Radio",
    icon: CircleDot,
    description: "A list of radio buttons (single-select)",
    isDataField: true,
    Field: RadioField as WidgetDefinition["Field"],
    defaultSettings: DEFAULT_SETTINGS.radio,
    defaultLayout: DEFAULT_LAYOUTS.radio,
  },
  label: {
    type: "label",
    label: "Label",
    icon: FileText,
    description: "Readonly display content",
    isDataField: false,
    Field: LabelField as WidgetDefinition["Field"],
    defaultSettings: DEFAULT_SETTINGS.label,
    defaultLayout: DEFAULT_LAYOUTS.label,
  },
  signature: {
    type: "signature",
    label: "Signature",
    icon: PenTool,
    description: "Lets the person sign with their pointer",
    isDataField: true,
    Field: SignatureField as WidgetDefinition["Field"],
    defaultSettings: DEFAULT_SETTINGS.signature,
    defaultLayout: DEFAULT_LAYOUTS.signature,
  },
  button: {
    type: "button",
    label: "Button",
    icon: MousePointerClick,
    description: "A clickable button, optionally linking to a URL",
    isDataField: false,
    Field: ButtonField as WidgetDefinition["Field"],
    defaultSettings: DEFAULT_SETTINGS.button,
    defaultLayout: DEFAULT_LAYOUTS.button,
  },
  "image-uploader": {
    type: "image-uploader",
    label: "Image Upload",
    icon: ImageIcon,
    description: "Upload and preview an image",
    isDataField: true,
    Field: ImageUploaderField as WidgetDefinition["Field"],
    defaultSettings: DEFAULT_SETTINGS["image-uploader"],
    defaultLayout: DEFAULT_LAYOUTS["image-uploader"],
  },
  "file-uploader": {
    type: "file-uploader",
    label: "File Upload",
    icon: Paperclip,
    description: "Upload files and show them as a list",
    isDataField: true,
    Field: FileUploaderField as WidgetDefinition["Field"],
    defaultSettings: DEFAULT_SETTINGS["file-uploader"],
    defaultLayout: DEFAULT_LAYOUTS["file-uploader"],
  },
  break: {
    type: "break",
    label: "Break",
    icon: Minus,
    description: "A full-width divider line",
    isDataField: false,
    Field: BreakField as WidgetDefinition["Field"],
    defaultSettings: DEFAULT_SETTINGS.break,
    defaultLayout: DEFAULT_LAYOUTS.break,
  },
  session: {
    type: "session",
    label: "Session",
    icon: Clock,
    description: "Full-width, fixed block",
    isDataField: false,
    Field: SessionField as WidgetDefinition["Field"],
    defaultSettings: DEFAULT_SETTINGS.session,
    defaultLayout: DEFAULT_LAYOUTS.session,
  },
};

export const WIDGET_LIST: WidgetDefinition[] = Object.values(WIDGET_REGISTRY);
