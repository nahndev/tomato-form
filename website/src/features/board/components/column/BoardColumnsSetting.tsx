"use client";

import { useState } from "react";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { useBoardContext } from "@/features/board/components/provider/BoardProvider";
import { useUpdateBoard } from "@/features/board/hooks/useBoards";
import { findLatestVersion } from "@/features/template/utils/findLatestVersion";
import { WIDGET_DISPLAY_TYPE_REGISTRY } from "@/features/template/constants/widget/displayTypes";
import type { BoardColumn } from "@/types/board";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import AddColumnButton from "./AddColumnButton";
import BoardColumnHeaderCell from "./BoardColumnHeaderCell";
import BoardColumnSizeInput from "./BoardColumnSizeInput";
import BoardColumnWidgetCell from "./BoardColumnWidgetCell";

const DEFAULT_COLUMN_SIZE = 150;

function prepareColumnsForSave(
  columns: BoardColumn[],
  boardTemplateIds: Set<string>,
): BoardColumn[] | null {
  const touched = columns.filter((c) => c.items.length > 0);

  const isInvalid = touched.some(
    (c) => c.type === null || !c.size || c.size < 1,
  );
  if (isInvalid) return null;

  return touched.map((c) => ({
    ...c,
    items: c.items.filter((item) => boardTemplateIds.has(item.templateId)),
  }));
}

const BoardColumnsSetting: React.FC = () => {
  const board = useBoardContext();
  const { mutateAsync: updateBoard, isPending } = useUpdateBoard(board.id);

  const [draftColumns, setDraftColumns] = useState<BoardColumn[]>(
    board.columns,
  );

  const isDirty = JSON.stringify(draftColumns) !== JSON.stringify(board.columns);

  function updateColumn(columnId: string, patch: Partial<BoardColumn>) {
    setDraftColumns((prev) =>
      prev.map((c) => (c.id === columnId ? { ...c, ...patch } : c)),
    );
  }

  function removeColumn(columnId: string) {
    setDraftColumns((prev) => prev.filter((c) => c.id !== columnId));
  }

  function pickWidget(columnId: string, templateId: string, widgetId: string) {
    setDraftColumns((prev) =>
      prev.map((c) => {
        if (c.id !== columnId) return c;

        const itemsWithoutTemplate = c.items.filter(
          (item) => item.templateId !== templateId,
        );

        if (!widgetId) {
          return { ...c, items: itemsWithoutTemplate };
        }

        const template = board.templates.find((t) => t.id === templateId);
        const latestVersion = findLatestVersion(
          template?.templateVersions ?? [],
        );
        const widget = latestVersion?.snapshot.widgets[widgetId];

        const type =
          c.type ?? (widget ? WIDGET_DISPLAY_TYPE_REGISTRY[widget.type][0] : null);
        const size = c.size ?? DEFAULT_COLUMN_SIZE;

        return {
          ...c,
          type,
          size,
          items: [...itemsWithoutTemplate, { templateId, widgetId }],
        };
      }),
    );
  }

  async function handleSave() {
    const boardTemplateIds = new Set(board.templates.map((t) => t.id));
    const prepared = prepareColumnsForSave(draftColumns, boardTemplateIds);
    if (!prepared) {
      toast.error("Every column needs a widget and a size before saving");
      return;
    }
    try {
      await updateBoard({ columns: prepared });
      setDraftColumns(prepared);
      toast.success("Columns updated");
    } catch (err) {
      console.error("Failed to update columns:", err);
      toast.error("Failed to update columns");
    }
  }

  if (board.templates.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Link a template on the Template tab before configuring columns.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Add columns to show widget values on the board list. All widgets in a
        column must share the same display type.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-2">
          <thead>
            <tr>
              <th className="text-left text-xs font-medium text-muted-foreground">
                Template
              </th>
              {draftColumns.map((column) => (
                <th key={column.id}>
                  <BoardColumnHeaderCell
                    column={column}
                    onRemove={() => removeColumn(column.id)}
                  />
                </th>
              ))}
              <th>
                <AddColumnButton
                  onAdd={(column) =>
                    setDraftColumns((prev) => [...prev, column])
                  }
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {board.templates.map((template) => {
              const latestVersion = findLatestVersion(
                template.templateVersions ?? [],
              );
              return (
                <tr key={template.id}>
                  <td className="text-sm">{template.name}</td>
                  {draftColumns.map((column) => (
                    <td key={column.id}>
                      <BoardColumnWidgetCell
                        column={column}
                        templateId={template.id}
                        templateName={template.name}
                        latestVersion={latestVersion}
                        onPick={(widgetId) =>
                          pickWidget(column.id, template.id, widgetId)
                        }
                      />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td className="text-xs text-muted-foreground">Size</td>
              {draftColumns.map((column) => (
                <td key={column.id}>
                  <BoardColumnSizeInput
                    size={column.size}
                    onChange={(size) => updateColumn(column.id, { size })}
                  />
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isPending || !isDirty}
          aria-label="Save columns"
        >
          {isPending ? (
            <TomatoIcon icon={TomatoIconKey.Loader} className="size-4 animate-spin" />
          ) : (
            "Save"
          )}
        </Button>
      </div>
    </div>
  );
};

export default BoardColumnsSetting;
