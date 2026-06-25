import { WidgetPicker } from "@/features/template/components/toolbar/creation/WidgetPicker";
import StructureToolbarBox from "@/features/template/components/toolbar/structure/StructureToolbarBox";
import { ListTree, LucideIcon, TicketPlus } from "lucide-react";
import { ComponentType } from "react";

export enum ToolbarType {
  Widget = "widget",
  Structure = "structure",
}
export interface ToolbarDefinition {
  icon: LucideIcon;
  type: ToolbarType;
  label: string;
  Component: ComponentType;
}

export const TOOLBAR_REGISTRY: Record<ToolbarType, ToolbarDefinition> = {
  [ToolbarType.Widget]: {
    type: ToolbarType.Widget,
    label: "Add widget",
    icon: TicketPlus,
    Component: WidgetPicker,
  },
  [ToolbarType.Structure]: {
    type: ToolbarType.Structure,
    icon: ListTree,
    label: "Structure",
    Component: StructureToolbarBox,
  },
};
