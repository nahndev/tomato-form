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
import type { BoardColumn } from "@/types/board";
import { DisplayType } from "@/types/display-type";
import type { TemplateVersion } from "@/types/template";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";

export interface BoardSettingColumnProps {
  column: BoardColumn;
  index: number;
  templateVersions: TemplateVersion[];
  onChangeColumn: (column: BoardColumn) => void;
  onRemoveColumn: (columnId: string) => void;
}

/** One column of the board grid: label + size editors, then a widget picker for each linked template version. */
const BoardSettingColumn: React.FC<BoardSettingColumnProps> = ({
  column,
  templateVersions,
  onChangeColumn,
  onRemoveColumn,
}) => {
  function pickWidget(templateVersionId: string, widgetId: string | null) {
    onChangeColumn(
      widgetId
        ? JsonColumn.setItem(column, templateVersionId, widgetId)
        : JsonColumn.removeItem(column, templateVersionId),
    );
  }

  const { icon } =
    DISPLAY_TYPE_REGISTRY[JsonColumn.getType(column) ?? DisplayType.UNKNOWN];
  const selectedWidgets = getSelectedColumnWidgets(column, templateVersions);

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
        {templateVersions.map((templateVersion, idx) => {
          const selectedWidgetId = JsonColumn.getItemWidgetId(
            column,
            templateVersion.id,
          );

          const otherSelectedWidgets = selectedWidgets
            .filter((w) => w.templateVersionId !== templateVersion.id)
            .map((w) => w.widget);

          return (
            <ZebraCell
              key={templateVersion.id}
              index={idx}
              className="gap-2 px-2"
            >
              <TemplateWidgetSelect
                templateVersion={templateVersion}
                allowDisplayTypes={getCommonDisplayTypes(otherSelectedWidgets)}
                value={selectedWidgetId}
                onChange={(widgetId) => pickWidget(templateVersion.id, widgetId)}
              />
            </ZebraCell>
          );
        })}
      </SessionWrapper>
    </RowWrapper>
  );
};

export default BoardSettingColumn;
