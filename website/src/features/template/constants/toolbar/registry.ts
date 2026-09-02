import { WidgetPicker } from "@/features/template/components/toolbar/creation/WidgetPicker";
import { WidgetPropertyBox } from "@/features/template/components/toolbar/property/WidgetPropertyBox";
import StructureToolbarBox from "@/features/template/components/toolbar/structure/StructureToolbarBox";
import VersionSetting from "@/features/template/components/toolbar/version/VersionSetting";
import { TomatoIconKey } from "@tomato/icon";
import { ComponentType } from "react";

export enum ToolbarType {
  Widget = "widget",
  Structure = "structure",
  Property = "property",
  Version = "version",
}
export interface ToolbarDefinition {
  icon: TomatoIconKey;
  type: ToolbarType;
  label: string;
  Component: ComponentType;
}

export const TOOLBAR_REGISTRY: Record<ToolbarType, ToolbarDefinition> = {
  [ToolbarType.Widget]: {
    type: ToolbarType.Widget,
    label: "Add widget",
    icon: TomatoIconKey.TicketPlus,
    Component: WidgetPicker,
  },
  [ToolbarType.Structure]: {
    type: ToolbarType.Structure,
    icon: TomatoIconKey.ListTree,
    label: "Structure",
    Component: StructureToolbarBox,
  },
  [ToolbarType.Property]: {
    type: ToolbarType.Property,
    icon: TomatoIconKey.Settings2,
    label: "Properties",
    Component: WidgetPropertyBox,
  },
  [ToolbarType.Version]: {
    type: ToolbarType.Version,
    icon: TomatoIconKey.History,
    label: "Versions",
    Component: VersionSetting,
  },
};
