import { WidgetGroup } from "@/types/template";
import { WidgetType } from "@/types/widget";
import { TomatoIconKey } from "@tomato/icon";
import type {
  WidgetDefinition,
  WidgetRegistry,
} from "../../../../types/widget";
import { DEFAULT_LAYOUTS } from "./config/layouts";
import { DEFAULT_SETTINGS } from "./config/settings";

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

export const WIDGET_REGISTRY: WidgetRegistry = {
  [WidgetType.TEXT]: {
    type: WidgetType.TEXT,
    label: "Text",
    icon: TomatoIconKey.Type,
    description: "Single-line text",
    isDataField: true,
    group: WidgetGroup.COMMON,
    component: TextWidgetItem as WidgetDefinition["component"],
    defaultSettings: DEFAULT_SETTINGS[WidgetType.TEXT],
    defaultLayout: DEFAULT_LAYOUTS[WidgetType.TEXT],
  },
  [WidgetType.TEXT_AREA]: {
    type: WidgetType.TEXT_AREA,
    label: "Text Area",
    icon: TomatoIconKey.AlignLeft,
    description: "Multi-line text with auto-growing rows",
    isDataField: true,
    group: WidgetGroup.COMMON,
    component: TextAreaWidgetItem as WidgetDefinition["component"],
    defaultSettings: DEFAULT_SETTINGS[WidgetType.TEXT_AREA],
    defaultLayout: DEFAULT_LAYOUTS[WidgetType.TEXT_AREA],
  },
  [WidgetType.NUMBER]: {
    type: WidgetType.NUMBER,
    label: "Number",
    icon: TomatoIconKey.Hash,
    description: "Numeric input",
    isDataField: true,
    group: WidgetGroup.COMMON,
    component: NumberWidgetItem as WidgetDefinition["component"],
    defaultSettings: DEFAULT_SETTINGS[WidgetType.NUMBER],
    defaultLayout: DEFAULT_LAYOUTS[WidgetType.NUMBER],
  },
  [WidgetType.DATE]: {
    type: WidgetType.DATE,
    label: "Date",
    icon: TomatoIconKey.Calendar,
    description: "Date only",
    isDataField: true,
    group: WidgetGroup.COMMON,
    component: DateWidgetItem as WidgetDefinition["component"],
    defaultSettings: DEFAULT_SETTINGS[WidgetType.DATE],
    defaultLayout: DEFAULT_LAYOUTS[WidgetType.DATE],
  },
  [WidgetType.DATETIME]: {
    type: WidgetType.DATETIME,
    label: "Date & Time",
    icon: TomatoIconKey.CalendarClock,
    description: "Date and time (stored as epoch ms)",
    isDataField: true,
    group: WidgetGroup.COMMON,
    component: DatetimeWidgetItem as WidgetDefinition["component"],
    defaultSettings: DEFAULT_SETTINGS[WidgetType.DATETIME],
    defaultLayout: DEFAULT_LAYOUTS[WidgetType.DATETIME],
  },
  [WidgetType.TIME]: {
    type: WidgetType.TIME,
    label: "Time",
    icon: TomatoIconKey.Timer,
    description: "Time only",
    isDataField: true,
    group: WidgetGroup.COMMON,
    component: TimeWidgetItem as WidgetDefinition["component"],
    defaultSettings: DEFAULT_SETTINGS[WidgetType.TIME],
    defaultLayout: DEFAULT_LAYOUTS[WidgetType.TIME],
  },
  [WidgetType.SELECT]: {
    type: WidgetType.SELECT,
    label: "Select",
    icon: TomatoIconKey.List,
    description: "Dropdown select",
    isDataField: true,
    group: WidgetGroup.COMMON,
    component: SelectWidgetItem as WidgetDefinition["component"],
    defaultSettings: DEFAULT_SETTINGS[WidgetType.SELECT],
    defaultLayout: DEFAULT_LAYOUTS[WidgetType.SELECT],
  },
  [WidgetType.CHECKBOX]: {
    type: WidgetType.CHECKBOX,
    label: "Checkbox",
    icon: TomatoIconKey.CheckSquare,
    description: "A list of checkboxes (multi-select)",
    isDataField: true,
    group: WidgetGroup.COMMON,
    component: CheckboxWidgetItem as WidgetDefinition["component"],
    defaultSettings: DEFAULT_SETTINGS[WidgetType.CHECKBOX],
    defaultLayout: DEFAULT_LAYOUTS[WidgetType.CHECKBOX],
  },
  [WidgetType.RADIO]: {
    type: WidgetType.RADIO,
    label: "Radio",
    icon: TomatoIconKey.CircleDot,
    description: "A list of radio buttons (single-select)",
    isDataField: true,
    group: WidgetGroup.COMMON,
    component: RadioWidgetItem as WidgetDefinition["component"],
    defaultSettings: DEFAULT_SETTINGS[WidgetType.RADIO],
    defaultLayout: DEFAULT_LAYOUTS[WidgetType.RADIO],
  },
  [WidgetType.LABEL]: {
    type: WidgetType.LABEL,
    label: "Label",
    icon: TomatoIconKey.Document,
    description: "Readonly display content",
    isDataField: false,
    group: WidgetGroup.COMMON,
    component: LabelWidgetItem as WidgetDefinition["component"],
    defaultSettings: DEFAULT_SETTINGS[WidgetType.LABEL],
    defaultLayout: DEFAULT_LAYOUTS[WidgetType.LABEL],
  },
  [WidgetType.SIGNATURE]: {
    type: WidgetType.SIGNATURE,
    label: "Signature",
    icon: TomatoIconKey.PenTool,
    description: "Lets the person sign with their pointer",
    isDataField: true,
    group: WidgetGroup.ADVANCE,
    component: SignatureWidgetItem as WidgetDefinition["component"],
    defaultSettings: DEFAULT_SETTINGS[WidgetType.SIGNATURE],
    defaultLayout: DEFAULT_LAYOUTS[WidgetType.SIGNATURE],
  },
  [WidgetType.BUTTON]: {
    type: WidgetType.BUTTON,
    label: "Button",
    icon: TomatoIconKey.MousePointerClick,
    description: "A clickable button, optionally linking to a URL",
    isDataField: false,
    group: WidgetGroup.ADVANCE,
    component: ButtonWidgetItem as WidgetDefinition["component"],
    defaultSettings: DEFAULT_SETTINGS[WidgetType.BUTTON],
    defaultLayout: DEFAULT_LAYOUTS[WidgetType.BUTTON],
  },
  [WidgetType.IMAGE_UPLOADER]: {
    type: WidgetType.IMAGE_UPLOADER,
    label: "Image Upload",
    icon: TomatoIconKey.Image,
    description: "Upload and preview an image",
    isDataField: true,
    group: WidgetGroup.MEDIA,
    component: ImageUploaderWidgetItem as WidgetDefinition["component"],
    defaultSettings: DEFAULT_SETTINGS[WidgetType.IMAGE_UPLOADER],
    defaultLayout: DEFAULT_LAYOUTS[WidgetType.IMAGE_UPLOADER],
  },
  [WidgetType.FILE_UPLOADER]: {
    type: WidgetType.FILE_UPLOADER,
    label: "File Upload",
    icon: TomatoIconKey.Paperclip,
    description: "Upload files and show them as a list",
    isDataField: true,
    group: WidgetGroup.MEDIA,
    component: FileUploaderWidgetItem as WidgetDefinition["component"],
    defaultSettings: DEFAULT_SETTINGS[WidgetType.FILE_UPLOADER],
    defaultLayout: DEFAULT_LAYOUTS[WidgetType.FILE_UPLOADER],
  },
  [WidgetType.BREAK]: {
    type: WidgetType.BREAK,
    label: "Break",
    icon: TomatoIconKey.Minus,
    description: "A full-width divider line",
    isDataField: false,
    group: WidgetGroup.ADVANCE,
    component: BreakWidgetItem as WidgetDefinition["component"],
    defaultSettings: DEFAULT_SETTINGS[WidgetType.BREAK],
    defaultLayout: DEFAULT_LAYOUTS[WidgetType.BREAK],
  },
  [WidgetType.SESSION]: {
    type: WidgetType.SESSION,
    label: "Session",
    icon: TomatoIconKey.Clock,
    description: "Full-width, fixed block",
    isDataField: false,
    group: WidgetGroup.ADVANCE,
    component: SessionWidgetItem as WidgetDefinition["component"],
    defaultSettings: DEFAULT_SETTINGS[WidgetType.SESSION],
    defaultLayout: DEFAULT_LAYOUTS[WidgetType.SESSION],
  },
  [WidgetType.USERS]: {
    type: WidgetType.USERS,
    label: "Users",
    icon: TomatoIconKey.Users,
    description: "Select a user from the workspace",
    isDataField: true,
    group: WidgetGroup.SYSTEM,
    component: UsersWidgetItem as WidgetDefinition["component"],
    defaultSettings: DEFAULT_SETTINGS[WidgetType.USERS],
    defaultLayout: DEFAULT_LAYOUTS[WidgetType.USERS],
  },
  [WidgetType.CREATED_AT]: {
    type: WidgetType.CREATED_AT,
    label: "Created At",
    icon: TomatoIconKey.History,
    description: "When the submission was created",
    isDataField: false,
    group: WidgetGroup.SYSTEM,
    component: SystemFieldWidgetItem as WidgetDefinition["component"],
    defaultSettings: DEFAULT_SETTINGS[WidgetType.CREATED_AT],
    defaultLayout: DEFAULT_LAYOUTS[WidgetType.CREATED_AT],
  },
  [WidgetType.TEMPLATE]: {
    type: WidgetType.TEMPLATE,
    label: "Template",
    icon: TomatoIconKey.ClipboardList,
    description: "The template the submission was filled from",
    isDataField: false,
    group: WidgetGroup.SYSTEM,
    component: SystemFieldWidgetItem as WidgetDefinition["component"],
    defaultSettings: DEFAULT_SETTINGS[WidgetType.TEMPLATE],
    defaultLayout: DEFAULT_LAYOUTS[WidgetType.TEMPLATE],
  },
  [WidgetType.SUBMITTED_BY]: {
    type: WidgetType.SUBMITTED_BY,
    label: "By",
    icon: TomatoIconKey.UserRound,
    description: "Who submitted the entry",
    isDataField: false,
    group: WidgetGroup.SYSTEM,
    component: SystemFieldWidgetItem as WidgetDefinition["component"],
    defaultSettings: DEFAULT_SETTINGS[WidgetType.SUBMITTED_BY],
    defaultLayout: DEFAULT_LAYOUTS[WidgetType.SUBMITTED_BY],
  },
};

export const WIDGET_LIST: WidgetDefinition[] = Object.values(WIDGET_REGISTRY);
