import {
  AlignLeft,
  Calendar,
  CalendarClock,
  CheckSquare,
  CircleDot,
  Clock,
  FileText,
  Hash,
  Image as ImageIcon,
  List,
  Minus,
  MousePointerClick,
  Paperclip,
  PenTool,
  Timer,
  Type,
} from "lucide-react";
import { WidgetType } from "@/types/template";
import { DEFAULT_LAYOUTS } from "./config/layouts";
import { DEFAULT_SETTINGS } from "./config/settings";
import type { WidgetDefinition, WidgetRegistry } from "./types";

import { BreakField } from "./items/BreakField";
import { ButtonField } from "./items/ButtonField";
import { CheckboxField } from "./items/CheckboxField";
import { DateField } from "./items/DateField";
import { DatetimeField } from "./items/DatetimeField";
import { FileUploaderField } from "./items/FileUploaderField";
import { ImageUploaderField } from "./items/ImageUploaderField";
import { LabelField } from "./items/LabelField";
import { NumberField } from "./items/NumberField";
import { RadioField } from "./items/RadioField";
import { SelectField } from "./items/SelectField";
import { SessionField } from "./items/SessionField";
import { SignatureField } from "./items/SignatureField";
import { TextField } from "./items/TextField";
import { TextAreaField } from "./items/TextAreaField";
import { TimeField } from "./items/TimeField";

export const WIDGET_REGISTRY: WidgetRegistry = {
  [WidgetType.TEXT]: {
    type: WidgetType.TEXT,
    label: "Text",
    icon: Type,
    description: "Single-line text",
    isDataField: true,
    Field: TextField as WidgetDefinition["Field"],
    defaultSettings: DEFAULT_SETTINGS[WidgetType.TEXT],
    defaultLayout: DEFAULT_LAYOUTS[WidgetType.TEXT],
  },
  [WidgetType.TEXT_AREA]: {
    type: WidgetType.TEXT_AREA,
    label: "Text Area",
    icon: AlignLeft,
    description: "Multi-line text with auto-growing rows",
    isDataField: true,
    Field: TextAreaField as WidgetDefinition["Field"],
    defaultSettings: DEFAULT_SETTINGS[WidgetType.TEXT_AREA],
    defaultLayout: DEFAULT_LAYOUTS[WidgetType.TEXT_AREA],
  },
  [WidgetType.NUMBER]: {
    type: WidgetType.NUMBER,
    label: "Number",
    icon: Hash,
    description: "Numeric input",
    isDataField: true,
    Field: NumberField as WidgetDefinition["Field"],
    defaultSettings: DEFAULT_SETTINGS[WidgetType.NUMBER],
    defaultLayout: DEFAULT_LAYOUTS[WidgetType.NUMBER],
  },
  [WidgetType.DATE]: {
    type: WidgetType.DATE,
    label: "Date",
    icon: Calendar,
    description: "Date only",
    isDataField: true,
    Field: DateField as WidgetDefinition["Field"],
    defaultSettings: DEFAULT_SETTINGS[WidgetType.DATE],
    defaultLayout: DEFAULT_LAYOUTS[WidgetType.DATE],
  },
  [WidgetType.DATETIME]: {
    type: WidgetType.DATETIME,
    label: "Date & Time",
    icon: CalendarClock,
    description: "Date and time (stored as epoch ms)",
    isDataField: true,
    Field: DatetimeField as WidgetDefinition["Field"],
    defaultSettings: DEFAULT_SETTINGS[WidgetType.DATETIME],
    defaultLayout: DEFAULT_LAYOUTS[WidgetType.DATETIME],
  },
  [WidgetType.TIME]: {
    type: WidgetType.TIME,
    label: "Time",
    icon: Timer,
    description: "Time only",
    isDataField: true,
    Field: TimeField as WidgetDefinition["Field"],
    defaultSettings: DEFAULT_SETTINGS[WidgetType.TIME],
    defaultLayout: DEFAULT_LAYOUTS[WidgetType.TIME],
  },
  [WidgetType.SELECT]: {
    type: WidgetType.SELECT,
    label: "Select",
    icon: List,
    description: "Dropdown select",
    isDataField: true,
    Field: SelectField as WidgetDefinition["Field"],
    defaultSettings: DEFAULT_SETTINGS[WidgetType.SELECT],
    defaultLayout: DEFAULT_LAYOUTS[WidgetType.SELECT],
  },
  [WidgetType.CHECKBOX]: {
    type: WidgetType.CHECKBOX,
    label: "Checkbox",
    icon: CheckSquare,
    description: "A list of checkboxes (multi-select)",
    isDataField: true,
    Field: CheckboxField as WidgetDefinition["Field"],
    defaultSettings: DEFAULT_SETTINGS[WidgetType.CHECKBOX],
    defaultLayout: DEFAULT_LAYOUTS[WidgetType.CHECKBOX],
  },
  [WidgetType.RADIO]: {
    type: WidgetType.RADIO,
    label: "Radio",
    icon: CircleDot,
    description: "A list of radio buttons (single-select)",
    isDataField: true,
    Field: RadioField as WidgetDefinition["Field"],
    defaultSettings: DEFAULT_SETTINGS[WidgetType.RADIO],
    defaultLayout: DEFAULT_LAYOUTS[WidgetType.RADIO],
  },
  [WidgetType.LABEL]: {
    type: WidgetType.LABEL,
    label: "Label",
    icon: FileText,
    description: "Readonly display content",
    isDataField: false,
    Field: LabelField as WidgetDefinition["Field"],
    defaultSettings: DEFAULT_SETTINGS[WidgetType.LABEL],
    defaultLayout: DEFAULT_LAYOUTS[WidgetType.LABEL],
  },
  [WidgetType.SIGNATURE]: {
    type: WidgetType.SIGNATURE,
    label: "Signature",
    icon: PenTool,
    description: "Lets the person sign with their pointer",
    isDataField: true,
    Field: SignatureField as WidgetDefinition["Field"],
    defaultSettings: DEFAULT_SETTINGS[WidgetType.SIGNATURE],
    defaultLayout: DEFAULT_LAYOUTS[WidgetType.SIGNATURE],
  },
  [WidgetType.BUTTON]: {
    type: WidgetType.BUTTON,
    label: "Button",
    icon: MousePointerClick,
    description: "A clickable button, optionally linking to a URL",
    isDataField: false,
    Field: ButtonField as WidgetDefinition["Field"],
    defaultSettings: DEFAULT_SETTINGS[WidgetType.BUTTON],
    defaultLayout: DEFAULT_LAYOUTS[WidgetType.BUTTON],
  },
  [WidgetType.IMAGE_UPLOADER]: {
    type: WidgetType.IMAGE_UPLOADER,
    label: "Image Upload",
    icon: ImageIcon,
    description: "Upload and preview an image",
    isDataField: true,
    Field: ImageUploaderField as WidgetDefinition["Field"],
    defaultSettings: DEFAULT_SETTINGS[WidgetType.IMAGE_UPLOADER],
    defaultLayout: DEFAULT_LAYOUTS[WidgetType.IMAGE_UPLOADER],
  },
  [WidgetType.FILE_UPLOADER]: {
    type: WidgetType.FILE_UPLOADER,
    label: "File Upload",
    icon: Paperclip,
    description: "Upload files and show them as a list",
    isDataField: true,
    Field: FileUploaderField as WidgetDefinition["Field"],
    defaultSettings: DEFAULT_SETTINGS[WidgetType.FILE_UPLOADER],
    defaultLayout: DEFAULT_LAYOUTS[WidgetType.FILE_UPLOADER],
  },
  [WidgetType.BREAK]: {
    type: WidgetType.BREAK,
    label: "Break",
    icon: Minus,
    description: "A full-width divider line",
    isDataField: false,
    Field: BreakField as WidgetDefinition["Field"],
    defaultSettings: DEFAULT_SETTINGS[WidgetType.BREAK],
    defaultLayout: DEFAULT_LAYOUTS[WidgetType.BREAK],
  },
  [WidgetType.SESSION]: {
    type: WidgetType.SESSION,
    label: "Session",
    icon: Clock,
    description: "Full-width, fixed block",
    isDataField: false,
    Field: SessionField as WidgetDefinition["Field"],
    defaultSettings: DEFAULT_SETTINGS[WidgetType.SESSION],
    defaultLayout: DEFAULT_LAYOUTS[WidgetType.SESSION],
  },
};

export const WIDGET_LIST: WidgetDefinition[] = Object.values(WIDGET_REGISTRY);
