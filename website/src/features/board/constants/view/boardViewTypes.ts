import { BoardViewType } from "@/types/board-view";
import { TomatoIconKey } from "@tomato/icon";

export interface BoardViewTypeDescriptor {
  type: BoardViewType;
  label: string;
  icon: TomatoIconKey;
  /** False for view types that don't have a settings UI yet (extend later, per the ticket). */
  isConfigurable: boolean;
}

export const BOARD_VIEW_TYPE_REGISTRY: Record<BoardViewType, BoardViewTypeDescriptor> = {
  [BoardViewType.CHART]: {
    type: BoardViewType.CHART,
    label: "Chart",
    icon: TomatoIconKey.BarChart,
    isConfigurable: true,
  },
  [BoardViewType.CALENDAR]: {
    type: BoardViewType.CALENDAR,
    label: "Calendar",
    icon: TomatoIconKey.Calendar,
    isConfigurable: false,
  },
  [BoardViewType.DASHBOARD]: {
    type: BoardViewType.DASHBOARD,
    label: "Dashboard",
    icon: TomatoIconKey.LayoutDashboard,
    isConfigurable: false,
  },
};

export const BOARD_VIEW_TYPE_LIST = Object.values(BOARD_VIEW_TYPE_REGISTRY);
