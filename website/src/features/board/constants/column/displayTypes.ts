import { DisplayType, DisplayTypeRegistry } from "@/types/display-type";
import { ColorEnum } from "@/types/template";
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
  [DisplayType.TIME]: {
    type: DisplayType.TIME,
    label: "Time",
    icon: TomatoIconKey.Clock,
    color: ColorEnum.GREEN,
  },
  [DisplayType.DATETIME]: {
    type: DisplayType.DATETIME,
    label: "Date & time",
    icon: TomatoIconKey.CalendarClock,
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
