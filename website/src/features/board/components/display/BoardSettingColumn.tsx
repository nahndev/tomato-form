"use client";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import BoardColumnBox from "@/features/board/components/display/BoardColumnBox";
import {
  getDataFieldWidgets,
  getWidgetOptionLabel,
} from "@/features/board/utils/boardColumnWidgets";
import { WIDGET_DISPLAY_TYPE_REGISTRY } from "@/features/template/constants/widget/displayTypes";
import { findLatestVersion } from "@/features/template/utils/findLatestVersion";
import type { BoardColumn } from "@/types/board";
import { DisplayType } from "@/types/display-type";
import type { Template } from "@/types/template";
import clsx from "clsx";

const DEFAULT_COLUMN_SIZE = 150;

export interface BoardSettingColumnProps {
  column: BoardColumn;
  templates: Template[];
  onChangeColumn: (column: BoardColumn) => void;
}

/** One column of the board grid: label + size editors, then a widget picker for each linked template. */
const BoardSettingColumn: React.FC<BoardSettingColumnProps> = ({
  column,
  templates,
  onChangeColumn,
}) => {
  function pickWidget(templateId: string, widgetId: string) {
    const itemsWithoutTemplate = column.items.filter(
      (item) => item.templateId !== templateId,
    );

    if (!widgetId) {
      onChangeColumn({ ...column, items: itemsWithoutTemplate });
      return;
    }

    const template = templates.find((t) => t.id === templateId);
    const latestVersion = findLatestVersion(template?.templateVersions ?? []);
    const widget = latestVersion?.snapshot.widgets[widgetId];
    const type =
      column.type ??
      (widget ? WIDGET_DISPLAY_TYPE_REGISTRY[widget.type][0] : null);
    const size = column.size ?? DEFAULT_COLUMN_SIZE;

    onChangeColumn({
      ...column,
      type,
      size,
      items: [...itemsWithoutTemplate, { templateId, widgetId }],
    });
  }

  return (
    <div role="row" className="flex flex-col w-80">
      <div role="cell" className="h-10 flex items-center">
        <BoardColumnBox type={column.type ?? DisplayType.UNKNOWN}>
          <Input
            type="text"
            value={column.label ?? ""}
            placeholder="Label"
            onChange={(e) =>
              onChangeColumn({ ...column, label: e.target.value })
            }
            className="border-none shadow-none focus-visible:ring-0 text-xs font-semibold"
          />
        </BoardColumnBox>
      </div>

      <div role="cell" className="h-10 flex items-center">
        <Input
          type="number"
          min={1}
          value={column.size ?? ""}
          placeholder="Size"
          onChange={(e) =>
            onChangeColumn({
              ...column,
              size: e.target.value === "" ? null : Number(e.target.value),
            })
          }
          className="text-xs"
          aria-label={`Size for column ${column.label ?? column.id}`}
        />
      </div>

      {templates.map((template, idx) => {
        const latestVersion = findLatestVersion(
          template.templateVersions ?? [],
        );
        const ariaLabel = `Widget for ${template.name}`;
        const cellClassName = clsx(
          "h-10 flex items-center gap-2",
          idx % 2 === 1 && "bg-slate-100",
        );

        if (!latestVersion) {
          return (
            <div key={template.id} role="cell" className={cellClassName}>
              <Select disabled value="" aria-label={ariaLabel}>
                <option value="">No published version</option>
              </Select>
            </div>
          );
        }

        const snapshot = latestVersion.snapshot;
        const options = getDataFieldWidgets(snapshot).filter(
          (widget) =>
            column.type === null ||
            WIDGET_DISPLAY_TYPE_REGISTRY[widget.type].includes(column.type),
        );
        const selectedWidgetId =
          column.items.find((item) => item.templateId === template.id)
            ?.widgetId ?? "";

        return (
          <div key={template.id} role="cell" className={cellClassName}>
            <Select
              value={selectedWidgetId}
              onChange={(e) => pickWidget(template.id, e.target.value)}
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
          </div>
        );
      })}
    </div>
  );
};

export default BoardSettingColumn;
