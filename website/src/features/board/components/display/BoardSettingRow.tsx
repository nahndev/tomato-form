"use client";

import {
  BoardRow,
  BoardRowAction,
  BoardRowContent,
  BoardRowHeader,
} from "@/components/board-table";
import { Select } from "@/components/ui/select";
import {
  getDataFieldWidgets,
  getWidgetOptionLabel,
} from "@/features/board/utils/boardColumnWidgets";
import { WIDGET_DISPLAY_TYPE_REGISTRY } from "@/features/template/constants/widget/displayTypes";
import { findLatestVersion } from "@/features/template/utils/findLatestVersion";
import type { BoardColumn } from "@/types/board";
import type { Template } from "@/types/template";

const DEFAULT_COLUMN_SIZE = 150;

export interface BoardSettingRowProps {
  template: Template;
  onChangeColumn: (column: BoardColumn) => void;
}

const BoardSettingRow: React.FC<BoardSettingRowProps> = ({
  template,
  onChangeColumn,
}) => {
  const latestVersion = findLatestVersion(template.templateVersions ?? []);

  function pickWidget(column: BoardColumn, widgetId: string) {
    const itemsWithoutTemplate = column.items.filter(
      (item) => item.templateId !== template.id,
    );

    if (!widgetId) {
      onChangeColumn({ ...column, items: itemsWithoutTemplate });
      return;
    }

    const widget = latestVersion?.snapshot.widgets[widgetId];
    const type =
      column.type ??
      (widget ? WIDGET_DISPLAY_TYPE_REGISTRY[widget.type][0] : null);
    const size = column.size ?? DEFAULT_COLUMN_SIZE;

    onChangeColumn({
      ...column,
      type,
      size,
      items: [...itemsWithoutTemplate, { templateId: template.id, widgetId }],
    });
  }

  return (
    <BoardRow<Template, BoardColumn> row={template}>
      {(row, columns) => (
        <>
          <BoardRowHeader row={row}>
            <span className="text-sm">{row.name}</span>
          </BoardRowHeader>

          {columns.map((column) => {
            const ariaLabel = `Widget for ${row.name}`;

            if (!latestVersion) {
              return (
                <BoardRowContent key={column.id} row={row} column={column}>
                  <Select disabled value="" aria-label={ariaLabel}>
                    <option value="">No published version</option>
                  </Select>
                </BoardRowContent>
              );
            }

            const snapshot = latestVersion.snapshot;
            const options = getDataFieldWidgets(snapshot).filter(
              (widget) =>
                column.type === null ||
                WIDGET_DISPLAY_TYPE_REGISTRY[widget.type].includes(
                  column.type,
                ),
            );
            const selectedWidgetId =
              column.items.find((item) => item.templateId === row.id)
                ?.widgetId ?? "";

            return (
              <BoardRowContent key={column.id} row={row} column={column}>
                <Select
                  value={selectedWidgetId}
                  onChange={(e) => pickWidget(column, e.target.value)}
                  disabled={options.length === 0}
                  aria-label={ariaLabel}
                >
                  <option value="">
                    {options.length === 0
                      ? "No matching widget"
                      : "Select widget"}
                  </option>
                  {options.map((widget) => (
                    <option key={widget.id} value={widget.id}>
                      {getWidgetOptionLabel(snapshot, widget.id)}
                    </option>
                  ))}
                </Select>
              </BoardRowContent>
            );
          })}

          <BoardRowAction>
            <div>action</div>
          </BoardRowAction>
        </>
      )}
    </BoardRow>
  );
};

export default BoardSettingRow;
