import { useMemo } from "react";
import { getDataFieldWidgets } from "@/features/board/utils/boardColumnWidgets";
import { WIDGET_DISPLAY_TYPE_REGISTRY } from "@/features/template/constants/widget/displayTypes";
import { findLatestVersion } from "@/features/template/utils/findLatestVersion";
import type { DisplayType } from "@/types/display-type";
import type { Template, Widget } from "@/types/template";

/**
 * Widgets from a template's latest published version that can render as one
 * of the given DisplayTypes on a board column. `displayTypes: null` means no
 * restriction (all data-field widgets); an empty array matches nothing.
 */
export function useTemplateWidgetsByDisplayTypes(
  template: Template,
  displayTypes: DisplayType[] | null,
): Widget[] {
  return useMemo(() => {
    const latestVersion = findLatestVersion(template.templateVersions ?? []);
    if (!latestVersion) return [];

    const snapshot = latestVersion.snapshot;

    return getDataFieldWidgets(snapshot).filter(
      (widget) =>
        displayTypes === null ||
        WIDGET_DISPLAY_TYPE_REGISTRY[widget.type].some((type) =>
          displayTypes.includes(type),
        ),
    );
  }, [template, displayTypes]);
}
