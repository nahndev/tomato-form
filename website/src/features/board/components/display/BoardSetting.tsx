"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { useBoardContext } from "@/features/board/components/provider/BoardProvider";
import { useUpdateBoard } from "@/features/board/hooks/useBoards";
import { useTemplates } from "@/features/template/hooks/useTemplates";
import type { BoardColumn as BoardColumnData } from "@/types/board";
import type { Template } from "@/types/template";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import clsx from "clsx";
import { useState } from "react";
import AddTemplateButton from "./AddTemplateButton";
import BoardSettingColumn from "./BoardSettingColumn";
import BoardSettingRowActions from "./BoardSettingRowActions";
import BoardSettingTemplateNames from "./BoardSettingTemplateNames";
import BoardSettingToolbar from "./BoardSettingToolbar";

function prepareColumnsForSave(
  columns: BoardColumnData[],
  boardTemplateIds: Set<string>,
): BoardColumnData[] | null {
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

/** Column grid for a board, including linking/unlinking templates from the same screen. */
const BoardSetting: React.FC = () => {
  const board = useBoardContext();
  const { mutateAsync: updateBoard, isPending } = useUpdateBoard(board.id);
  const { data: allTemplates = [], isLoading: isLoadingTemplates } =
    useTemplates();

  const [draftColumns, setDraftColumns] = useState<BoardColumnData[]>(
    board.columns,
  );
  const [draftTemplateIds, setDraftTemplateIds] = useState<string[]>(
    board.templates.map((t) => t.id),
  );

  const linkedTemplatesById = new Map(board.templates.map((t) => [t.id, t]));
  const allTemplatesById = new Map(allTemplates.map((t) => [t.id, t]));
  const draftTemplates = draftTemplateIds
    .map((id) => linkedTemplatesById.get(id) ?? allTemplatesById.get(id))
    .filter((t): t is Template => Boolean(t));
  const availableTemplates = allTemplates.filter(
    (t) => !draftTemplateIds.includes(t.id),
  );

  const isDirty =
    JSON.stringify(draftColumns) !== JSON.stringify(board.columns) ||
    JSON.stringify(draftTemplateIds) !==
      JSON.stringify(board.templates.map((t) => t.id));

  function replaceColumn(updated: BoardColumnData) {
    setDraftColumns((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c)),
    );
  }

  function removeColumn(columnId: string) {
    setDraftColumns((prev) => prev.filter((c) => c.id !== columnId));
  }

  function addTemplate(templateId: string) {
    setDraftTemplateIds((prev) => [...prev, templateId]);
  }

  function removeTemplate(templateId: string) {
    setDraftTemplateIds((prev) => prev.filter((id) => id !== templateId));
    setDraftColumns((prev) =>
      prev.map((c) => ({
        ...c,
        items: c.items.filter((item) => item.templateId !== templateId),
      })),
    );
  }

  async function handleSave() {
    const boardTemplateIds = new Set(draftTemplateIds);
    const prepared = prepareColumnsForSave(draftColumns, boardTemplateIds);
    if (!prepared) {
      toast.error("Every column needs a widget and a size before saving");
      return;
    }
    try {
      await updateBoard({
        columns: prepared,
        templateIds: draftTemplateIds,
      });
      setDraftColumns(prepared);
      toast.success("Columns updated");
    } catch (err) {
      console.error("Failed to update columns:", err);
      toast.error("Failed to update columns");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Link templates and add columns to show widget values on the board list.
        All widgets in a column must share the same display type.
      </p>

      <div className={clsx("flex flex-col size-full gap-2 text-sm")}>
        <BoardSettingToolbar
          onAddColumn={(column) => setDraftColumns((prev) => [...prev, column])}
        />
        <div className="flex flex-row">
          <BoardSettingTemplateNames templates={draftTemplates} />
          <div className="flex-1 flex flex-row">
            {draftColumns.map((column) => (
              <BoardSettingColumn
                key={column.id}
                column={column}
                templates={draftTemplates}
                onChangeColumn={replaceColumn}
                onRemoveColumn={removeColumn}
              />
            ))}
          </div>
          <BoardSettingRowActions
            templates={draftTemplates}
            onRemoveTemplate={removeTemplate}
          />
        </div>

        {draftTemplates.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No templates linked yet.
          </p>
        )}
      </div>

      <AddTemplateButton
        availableTemplates={availableTemplates}
        isLoading={isLoadingTemplates}
        onAdd={addTemplate}
      />

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
