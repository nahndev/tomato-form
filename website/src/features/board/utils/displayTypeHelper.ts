import { WIDGET_DISPLAY_TYPE_REGISTRY } from "@/features/template/constants/widget/displayTypes";
import type { DisplayType } from "@/types/display-type";
import type { Widget } from "@/types/template";

/**
 * DisplayTypes shared by every widget in the list. No widgets means no
 * constraint yet, so callers should treat `null` as unrestricted; widgets
 * whose types share nothing return an empty array (matches nothing further).
 */
export function getCommonDisplayTypes(widgets: Widget[]): DisplayType[] | null {
  if (widgets.length === 0) return null;

  return widgets
    .map((widget) => WIDGET_DISPLAY_TYPE_REGISTRY[widget.type])
    .reduce((common, types) => common.filter((type) => types.includes(type)));
}
