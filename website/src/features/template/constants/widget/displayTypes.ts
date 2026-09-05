import { DisplayType, DisplayTypeRegistry } from "@/types/display-type";
import { ColorEnum } from "@/types/template";
import { WidgetType } from "@/types/widget";
import { TomatoIconKey } from "@tomato/icon";

export const DISPLAY_TYPE_REGISTRY: DisplayTypeRegistry = {
  [DisplayType.TEXT]: {
    type: DisplayType.TEXT,
    label: "Text",
    icon: TomatoIconKey.Type,
    color: ColorEnum.BLUE,
  },
  [DisplayType.DATE]: {
    type: DisplayType.DATE,
    label: "Date",
    icon: TomatoIconKey.Calendar,
    color: ColorEnum.GREEN,
  },
  [DisplayType.NUMBER]: {
    type: DisplayType.NUMBER,
    label: "Number",
    icon: TomatoIconKey.Hash,
    color: ColorEnum.PURPLE,
  },
  [DisplayType.UNKNOWN]: {
    type: DisplayType.UNKNOWN,
    label: "Unknown",
    icon: TomatoIconKey.Minus,
    color: ColorEnum.GRAY,
  },
};

export const DISPLAY_TYPE_LIST = Object.values(DISPLAY_TYPE_REGISTRY);

/**
 * Which DisplayTypes a widget type can be rendered as on a board column.
 * Index 0 is what a column auto-adopts when this widget is the first one
 * picked into an empty column. Empty array = not selectable as a column source.
 */
export const WIDGET_DISPLAY_TYPE_REGISTRY: Record<WidgetType, DisplayType[]> = {
  [WidgetType.TEXT]: [DisplayType.TEXT],
  [WidgetType.TEXT_AREA]: [DisplayType.TEXT],
  [WidgetType.NUMBER]: [DisplayType.NUMBER, DisplayType.TEXT],
  [WidgetType.DATE]: [DisplayType.DATE, DisplayType.TEXT, DisplayType.NUMBER],
  [WidgetType.DATETIME]: [
    DisplayType.DATE,
    DisplayType.TEXT,
    DisplayType.NUMBER,
  ],
  [WidgetType.TIME]: [DisplayType.DATE, DisplayType.TEXT],
  [WidgetType.SELECT]: [DisplayType.TEXT],
  [WidgetType.CHECKBOX]: [DisplayType.TEXT],
  [WidgetType.RADIO]: [DisplayType.TEXT],
  [WidgetType.LABEL]: [],
  [WidgetType.SIGNATURE]: [DisplayType.TEXT],
  [WidgetType.BUTTON]: [],
  [WidgetType.IMAGE_UPLOADER]: [DisplayType.TEXT],
  [WidgetType.FILE_UPLOADER]: [DisplayType.TEXT],
  [WidgetType.BREAK]: [],
  [WidgetType.SESSION]: [],
  [WidgetType.USERS]: [DisplayType.TEXT],
  [WidgetType.CREATED_AT]: [DisplayType.DATE, DisplayType.TEXT],
  [WidgetType.TEMPLATE]: [],
  [WidgetType.SUBMITTED_BY]: [DisplayType.TEXT],
  [WidgetType.BOARD]: [],
};
