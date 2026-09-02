"use client";

import { WIDGET_DISPLAY_TYPE_REGISTRY } from "@/features/template/constants/widget/displayTypes";
import type { BoardColumn } from "@/types/board";
import type { Template, TemplateVersion } from "@/types/template";
import WidgetSelector from "./WidgetSelector";

const DEFAULT_COLUMN_SIZE = 150;

export interface BoardColumnCellProps {
  column: BoardColumn;
  template: Template;
  latestVersion: TemplateVersion | undefined;
  onChange: (column: BoardColumn) => void;
}

/** Widget picker for a single column/template intersection cell. */
const BoardColumnCell: React.FC<BoardColumnCellProps> = ({
  column,
  template,
  latestVersion,
  onChange,
}) => {
  function pickWidget(widgetId: string) {
    const itemsWithoutTemplate = column.items.filter(
      (item) => item.templateId !== template.id,
    );

    if (!widgetId) {
      onChange({ ...column, items: itemsWithoutTemplate });
      return;
    }

    const widget = latestVersion?.snapshot.widgets[widgetId];
    const type =
      column.type ??
      (widget ? WIDGET_DISPLAY_TYPE_REGISTRY[widget.type][0] : null);
    const size = column.size ?? DEFAULT_COLUMN_SIZE;

    onChange({
      ...column,
      type,
      size,
      items: [...itemsWithoutTemplate, { templateId: template.id, widgetId }],
    });
  }

  return (
    <WidgetSelector
      column={column}
      templateId={template.id}
      templateName={template.name}
      latestVersion={latestVersion}
      onPick={pickWidget}
    />
  );
};

export default BoardColumnCell;
