"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { useBoardContext } from "@/features/board/components/provider/BoardProvider";
import { useUpdateBoard } from "@/features/board/hooks/useBoards";
import { getColumnSizeStyle } from "@/features/board/utils/boardColumnWidgets";
import { JsonColumn } from "@/features/board/utils/column";
import { useTemplates } from "@/features/template/hooks/useTemplates";
import type { BoardColumn, BoardColumnDraft } from "@/types/board";
import type { Template } from "@/types/template";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import clsx from "clsx";
import { useState } from "react";
import { useList } from "react-use";
import BoardSettingColumn from "./BoardSettingColumn";
import BoardSettingLabel from "./BoardSettingLabel";
import BoardSettingToolbar from "./BoardSettingToolbar";

function prepareColumnsForSave(
  columns: BoardColumnDraft[],
  boardTemplateIds: Set<string>,
): BoardColumn[] | null {
  const touched = columns.filter((c) => JsonColumn.hasItems(c));

  if (!touched.every((c): c is BoardColumn => JsonColumn.isReadyToSave(c))) {
    return null;
  }

  return touched.map((c) => JsonColumn.filterItemsByTemplateIds(c, boardTemplateIds));
}

/** Column grid for a board, including linking/unlinking templates from the same screen. */
const BoardSetting: React.FC = () => {
  const board = useBoardContext();
  const { mutateAsync: updateBoard, isPending } = useUpdateBoard(board.id);
  const { data: allTemplates = [] } = useTemplates();

  const [draftColumns, draftColumnActions] = useList<BoardColumnDraft>(
    board.columns,
  );
  const [draftTemplateIds, setDraftTemplateIds] = useState<string[]>(
    board.templates.map((t) => t.id),
  );

  const linkedTemplatesById = new Map(board.templates.map((t) => [t.id, t]));
  const allTemplatesById = new Map(allTemplates.map((t): [string, Template] => [t.id, t]));
  const draftTemplates = draftTemplateIds
    .map((id) => linkedTemplatesById.get(id) ?? allTemplatesById.get(id))
    .filter((t): t is Template => Boolean(t));

  const isDirty =
    JSON.stringify(draftColumns) !== JSON.stringify(board.columns) ||
    JSON.stringify(draftTemplateIds) !==
      JSON.stringify(board.templates.map((t) => t.id));

  function addTemplate(templateId: string) {
    setDraftTemplateIds((prev) => [...prev, templateId]);
  }

  async function handleSave() {
    const boardTemplateIds = new Set(draftTemplateIds);
    const prepared = prepareColumnsForSave(draftColumns, boardTemplateIds);
    if (!prepared) {
      toast.error(
        "Every column needs a widget, a size, and a type before saving",
      );
      return;
    }
    try {
      await updateBoard({
        columns: prepared,
        templateIds: draftTemplateIds,
      });
      draftColumnActions.set(prepared);
      toast.success("Columns updated");
    } catch (err) {
      console.error("Failed to update columns:", err);
      toast.error("Failed to update columns");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground relative">
        Link templates and add columns to show widget values on the board list.
        All widgets in a column must share the same display type.
      </p>
      <BoardSettingToolbar onAddColumn={draftColumnActions.push} />
      <div className={clsx("size-full relative")}>
        <div className="">
          <BoardSettingLabel templates={draftTemplates} onAdd={addTemplate} />
          <div className="absolute top-0 left-40 w-[calc(100%-var(--spacing)*40)] h-full">
            <div className="flex flex-row gap-2">
              {draftColumns.map((column, index) => (
                <div
                  key={JsonColumn.getId(column)}
                  style={getColumnSizeStyle(JsonColumn.getSize(column))}
                >
                  <BoardSettingColumn
                    column={column}
                    index={index}
                    templates={draftTemplates}
                    onChangeColumn={(updated) =>
                      draftColumnActions.update(
                        (c) => JsonColumn.getId(c) === JsonColumn.getId(updated),
                        updated,
                      )
                    }
                    onRemoveColumn={(columnId) =>
                      draftColumnActions.filter(
                        (c) => JsonColumn.getId(c) !== columnId,
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {draftTemplates.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No templates linked yet.
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isPending || !isDirty}
          aria-label="Save columns"
        >
          {isPending ? (
            <TomatoIcon
              icon={TomatoIconKey.Loader}
              className="size-4 animate-spin"
            />
          ) : (
            "Save"
          )}
        </Button>
      </div>
    </div>
  );
};

export default BoardSetting;
