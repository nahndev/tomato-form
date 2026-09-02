"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { useUpdateBoard } from "@/features/board/hooks/useBoards";
import { useTemplates } from "@/features/template/hooks/useTemplates";
import { findLatestVersion } from "@/features/template/utils/findLatestVersion";
import type { Board, BoardColumn as BoardColumnData } from "@/types/board";
import type { Template } from "@/types/template";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import { useState } from "react";
import BoardColumnCell from "./BoardColumnCell";
import BoardColumnCreation from "./BoardColumnCreation";
import BoardColumnFooter from "./BoardColumnFooter";
import BoardColumnHeader from "./BoardColumnHeader";
import BoardTemplate from "./BoardTemplate";

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

/** Column table for a board, including linking/unlinking templates from the same screen. */
const BoardSettingContent: React.FC<BoardSettingContentProps> = ({
  board,
}) => {
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

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-2">
          <thead>
            <tr>
              <th className="text-left text-xs font-medium text-muted-foreground">
                Column
              </th>
              {draftColumns.map((column) => (
                <th key={column.id}>
                  <BoardColumnHeader
                    column={column}
                    onChange={replaceColumn}
                    onRemove={() => removeColumn(column.id)}
                  />
                </th>
              ))}
              <th>
                <BoardColumnCreation
                  onAdd={(column) =>
                    setDraftColumns((prev) => [...prev, column])
                  }
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {draftTemplates.length === 0 && (
              <tr>
                <td
                  colSpan={draftColumns.length + 1}
                  className="py-4 text-center text-sm text-muted-foreground"
                >
                  No templates linked yet.
                </td>
              </tr>
            )}
            {draftTemplates.map((template) => {
              const latestVersion = findLatestVersion(
                template.templateVersions ?? [],
              );
              return (
                <tr key={template.id}>
                  <td>
                    <BoardTemplate part={{ kind: "badge", name: template.name }} />
                  </td>
                  {draftColumns.map((column) => (
                    <td key={column.id}>
                      <BoardColumnCell
                        column={column}
                        template={template}
                        latestVersion={latestVersion}
                        onChange={replaceColumn}
                      />
                    </td>
                  ))}
                </tr>
              );
            })}
            <tr>
              <td>
                <BoardTemplate
                  part={{
                    kind: "creation",
                    availableTemplates,
                    isLoading: isLoadingTemplates,
                    onAdd: addTemplate,
                  }}
                />
              </td>
              {draftColumns.map((column) => (
                <td key={column.id} />
              ))}
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td className="text-xs text-muted-foreground">Size</td>
              {draftColumns.map((column) => (
                <td key={column.id}>
                  <BoardColumnFooter column={column} />
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

export default BoardSettingContent;
