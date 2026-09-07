"use client";

import { Button } from "@/components/ui/button";
import { FlexRow } from "@/components/ui/flex-row";
import { Input } from "@/components/ui/input";
import ColumnDisplayTypeSelect from "@/features/board/components/display/select/ColumnDisplayTypeSelect";
import ColumnSizeSelect from "@/features/board/components/display/select/ColumnSizeSelect";
import TemplateWidgetSelect from "@/features/board/components/display/select/TemplateWidgetSelect";
import { SessionWrapper } from "@/features/board/components/display/session/SessionWrapper";
import { RowWrapper } from "@/features/board/components/display/wrapper/RowWrapper";
import { ZebraCell } from "@/features/board/components/display/wrapper/ZebraCell";
import { getSelectedColumnWidgets } from "@/features/board/utils/boardColumnWidgets";
import { JsonColumn } from "@/features/board/utils/column";
import { getCommonDisplayTypes } from "@/features/board/utils/displayTypeHelper";
import { DISPLAY_TYPE_REGISTRY } from "@/features/template/constants/widget";
import type { BoardColumnDraft } from "@/types/board";
import { DisplayType } from "@/types/display-type";
import type { Template } from "@/types/template";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";

export interface BoardSettingColumnProps {
  column: BoardColumnDraft;
  index: number;
  templates: Template[];
  onChangeColumn: (column: BoardColumnDraft) => void;
  onRemoveColumn: (columnId: string) => void;
}

/** One column of the board grid: label + size editors, then a widget picker for each linked template. */
const BoardSettingColumn: React.FC<BoardSettingColumnProps> = ({
  column,
  templates,
  onChangeColumn,
  onRemoveColumn,
}) => {
  function pickWidget(templateId: string, widgetId: string | null) {
    onChangeColumn(
      widgetId
        ? JsonColumn.setItem(column, templateId, widgetId)
        : JsonColumn.removeItem(column, templateId),
    );
  }

  const { icon } =
    DISPLAY_TYPE_REGISTRY[JsonColumn.getType(column) ?? DisplayType.UNKNOWN];
  const selectedWidgets = getSelectedColumnWidgets(column, templates);

  return (
    <RowWrapper>
      <div className="h-10 px-2">
        <FlexRow className="px-2 gap-2 border-2 rounded-lg bg-slate-100">
          <TomatoIcon icon={icon} />
          <Input
            type="text"
            value={JsonColumn.getLabel(column) ?? ""}
            placeholder="Label"
            onChange={(e) =>
              onChangeColumn(JsonColumn.setLabel(column, e.target.value))
            }
            variant="ghost"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0"
            onClick={() => onRemoveColumn(JsonColumn.getId(column))}
            aria-label={`Remove column ${JsonColumn.getLabel(column) ?? JsonColumn.getId(column)}`}
          >
            <TomatoIcon icon={TomatoIconKey.Trash} className="size-3.5" />
          </Button>
        </FlexRow>
      </div>
      <SessionWrapper>
        <ZebraCell className="px-2">
          <ColumnSizeSelect
            size={JsonColumn.getSize(column)}
            onChange={(size) => onChangeColumn(JsonColumn.setSize(column, size))}
          />
        </ZebraCell>
        <ZebraCell index={1} className="px-2">
          <ColumnDisplayTypeSelect
            value={JsonColumn.getType(column)}
            allowedTypes={getCommonDisplayTypes(
              selectedWidgets.map((w) => w.widget),
            )}
            onChange={(type) => onChangeColumn(JsonColumn.setType(column, type))}
          />
        </ZebraCell>
      </SessionWrapper>

      <SessionWrapper>
        {templates.map((template, idx) => {
          const selectedWidgetId = JsonColumn.getItemWidgetId(column, template.id);

          const otherSelectedWidgets = selectedWidgets
            .filter((w) => w.templateId !== template.id)
            .map((w) => w.widget);

          return (
            <ZebraCell key={template.id} index={idx} className="gap-2 px-2">
              <TemplateWidgetSelect
                template={template}
                allowDisplayTypes={getCommonDisplayTypes(otherSelectedWidgets)}
                value={selectedWidgetId}
                onChange={(widgetId) => pickWidget(template.id, widgetId)}
              />
            </ZebraCell>
          );
        })}
      </SessionWrapper>
    </RowWrapper>
  );
};

export default BoardSettingColumn;
