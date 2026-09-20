import { useMemo } from "react";
import { getWidgetDisplayTypes } from "@/features/board/constants/column/valueProperties";
import { getDataFieldWidgets } from "@/features/board/utils/boardColumnWidgets";
import type { DisplayType } from "@/types/display-type";
import type { Template, Widget } from "@/types/template";

/**
 * Widgets from a template that can render as one of the given DisplayTypes
 * on a board column. `displayTypes: null` means no restriction (all
 * data-field widgets); an empty array matches nothing.
 */
export function useTemplateWidgetsByDisplayTypes(
  template: Template,
  displayTypes: DisplayType[] | null,
): Widget[] {
  return useMemo(() => {
    const snapshot = template.snapshot;

    return getDataFieldWidgets(snapshot).filter(
      (widget) =>
        displayTypes === null ||
        getWidgetDisplayTypes(widget.type).some((type) =>
          displayTypes.includes(type),
        ),
    );
  }, [template, displayTypes]);
}
