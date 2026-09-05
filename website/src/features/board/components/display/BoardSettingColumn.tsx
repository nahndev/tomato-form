"use client";

import { Button } from "@/components/ui/button";
import { FlexRow } from "@/components/ui/flex-row";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SessionWrapper } from "@/features/board/components/display/session/SessionWrapper";
import { RowWrapper } from "@/features/board/components/display/wrapper/RowWrapper";
import { ZebraCell } from "@/features/board/components/display/wrapper/ZebraCell";
import {
  COLUMN_SIZE_OPTIONS,
  decodeColumnSize,
  encodeColumnSize,
} from "@/features/board/constants/column/sizeOptions";
import {
  getDataFieldWidgets,
  getWidgetOptionLabel,
} from "@/features/board/utils/boardColumnWidgets";
import { DISPLAY_TYPE_REGISTRY } from "@/features/template/constants/widget";
import { WIDGET_DISPLAY_TYPE_REGISTRY } from "@/features/template/constants/widget/displayTypes";
import { findLatestVersion } from "@/features/template/utils/findLatestVersion";
import type { BoardColumn, ColumnSize } from "@/types/board";
import { DisplayType } from "@/types/display-type";
import type { Template } from "@/types/template";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";

const DEFAULT_COLUMN_SIZE: ColumnSize = { width: 100 };
/** Radix Select.Item forbids an empty-string value, so a sentinel stands in for "no widget picked". */
const UNSELECTED_WIDGET = "__unselected__";

export interface BoardSettingColumnProps {
  column: BoardColumn;
  index: number;
  templates: Template[];
  onChangeColumn: (column: BoardColumn) => void;
  onRemoveColumn: (columnId: string) => void;
}

/** One column of the board grid: label + size editors, then a widget picker for each linked template. */
const BoardSettingColumn: React.FC<BoardSettingColumnProps> = ({
  column,
  templates,
  onChangeColumn,
  onRemoveColumn,
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

  const { icon } = DISPLAY_TYPE_REGISTRY[column.type ?? DisplayType.UNKNOWN];

  return (
    <RowWrapper>
      <div className="h-10 px-2">
        <FlexRow className="px-2 gap-2 border-2 rounded-lg bg-slate-100">
          <TomatoIcon icon={icon} />
          <Input
            type="text"
            value={column.label ?? ""}
            placeholder="Label"
            onChange={(e) =>
              onChangeColumn({ ...column, label: e.target.value })
            }
            variant="ghost"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0"
            onClick={() => onRemoveColumn(column.id)}
            aria-label={`Remove column ${column.label ?? column.id}`}
          >
            <TomatoIcon icon={TomatoIconKey.Trash} className="size-3.5" />
          </Button>
        </FlexRow>
      </div>
      <SessionWrapper>
        <ZebraCell className="px-2">
          <Select
            value={column.size ? encodeColumnSize(column.size) : ""}
            onValueChange={(value) =>
              onChangeColumn({ ...column, size: decodeColumnSize(value) })
            }
          >
            <SelectTrigger aria-label="Column size" className="text-xs">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              {COLUMN_SIZE_OPTIONS.map((option) => {
                const value = encodeColumnSize(option.size);
                return (
                  <SelectItem key={value} value={value}>
                    {option.label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </ZebraCell>
      </SessionWrapper>

      <SessionWrapper>
        {templates.map((template, idx) => {
          const latestVersion = findLatestVersion(
            template.templateVersions ?? [],
          );
          const ariaLabel = `Widget for ${template.name}`;

          if (!latestVersion) {
            return (
              <ZebraCell key={template.id} index={idx} className="gap-2 px-2">
                <Select disabled>
                  <SelectTrigger aria-label={ariaLabel}>
                    <SelectValue placeholder="No published version" />
                  </SelectTrigger>
                  <SelectContent />
                </Select>
              </ZebraCell>
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
              ?.widgetId ?? UNSELECTED_WIDGET;

          return (
            <ZebraCell key={template.id} index={idx} className="gap-2 px-2">
              <Select
                value={selectedWidgetId}
                onValueChange={(value) =>
                  pickWidget(
                    template.id,
                    value === UNSELECTED_WIDGET ? "" : value,
                  )
                }
                disabled={options.length === 0}
              >
                <SelectTrigger aria-label={ariaLabel}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UNSELECTED_WIDGET}>
                    {options.length === 0
                      ? "No matching widget"
                      : "Select widget"}
                  </SelectItem>
                  {options.map((widget) => (
                    <SelectItem key={widget.id} value={widget.id}>
                      {getWidgetOptionLabel(snapshot, widget.id)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </ZebraCell>
          );
        })}
      </SessionWrapper>
    </RowWrapper>
  );
};

export default BoardSettingColumn;
