"use client";

import { toast } from "@/components/ui/sonner";
import {
  BoardTable,
  type BoardTableColumn,
} from "@/features/board/components/display/BoardTable";
import { useUpdateBoard } from "@/features/board/hooks/useBoards";
import { useTemplates } from "@/features/template/hooks/useTemplates";
import { findLatestVersion } from "@/features/template/utils/findLatestVersion";
import type { Board, BoardColumn as BoardColumnData } from "@/types/board";
import type { Template } from "@/types/template";
import { useState } from "react";
import AddTemplateButton from "./AddTemplateButton";
import BoardColumnCell from "./BoardColumnCell";
import BoardColumnCreation from "./BoardColumnCreation";
import BoardColumnHeader from "./BoardColumnHeader";
import BoardSettingActions from "./BoardSettingActions";
import TemplateBadge from "./TemplateBadge";

export interface BoardSettingContentProps {
  board: Board;
}

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
const BoardSettingContent: React.FC<BoardSettingContentProps> = ({ board }) => {
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

  const columns: BoardTableColumn<Template>[] = draftColumns.map((column) => ({
    id: column.id,
    header: (
      <BoardColumnHeader
        column={column}
        onChange={replaceColumn}
        onRemove={() => removeColumn(column.id)}
      />
    ),
    cell: (template) => (
      <BoardColumnCell
        column={column}
        template={template}
        latestVersion={findLatestVersion(template.templateVersions ?? [])}
        onChange={replaceColumn}
      />
    ),
  }));

  return (
    <div className="flex flex-col gap-4">
      <BoardTable
        rowHeaderLabel="Templates"
        columns={columns}
        renderAddColumn={
          <BoardColumnCreation
            onAdd={(column) => setDraftColumns((prev) => [...prev, column])}
          />
        }
        rows={draftTemplates}
        getRowId={(t) => t.id}
        renderRowHeader={(t) => <TemplateBadge name={t.name} />}
        rowActions="Actions"
        renderFooter={
          <AddTemplateButton
            availableTemplates={availableTemplates}
            isLoading={isLoadingTemplates}
            onAdd={addTemplate}
          />
        }
        emptyState="No templates linked yet."
      />

      <BoardSettingActions
        onSave={handleSave}
        isPending={isPending}
        isDirty={isDirty}
      />
    </div>
  );
};

export default BoardSettingContent;
