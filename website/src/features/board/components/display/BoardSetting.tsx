"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { useBoardContext } from "@/features/board/components/provider/BoardProvider";
import { useUpdateBoard } from "@/features/board/hooks/useBoards";
import { getColumnSizeStyle } from "@/features/board/utils/boardColumnWidgets";
import { JsonColumn } from "@/features/board/utils/column";
import { useTemplates } from "@/features/template/hooks/useTemplates";
import { findLatestVersion } from "@/features/template/utils/findLatestVersion";
import type { BoardColumn as BoardColumnData } from "@/types/board";
import type { TemplateVersion } from "@/types/template";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import clsx from "clsx";
import { useState } from "react";
import { useList } from "react-use";
import BoardSettingColumn from "./BoardSettingColumn";
import BoardSettingLabel from "./BoardSettingLabel";
import BoardSettingToolbar from "./BoardSettingToolbar";

function prepareColumnsForSave(
  columns: BoardColumnData[],
  boardTemplateVersionIds: Set<string>,
): BoardColumnData[] | null {
  const touched = columns.filter((c) => JsonColumn.hasItems(c));

  const isInvalid = touched.some((c) => !JsonColumn.isReadyToSave(c));
  if (isInvalid) return null;

  return touched.map((c) =>
    JsonColumn.filterItemsByTemplateVersionIds(c, boardTemplateVersionIds),
  );
}

/** Column grid for a board, including linking/unlinking templates from the same screen. */
const BoardSetting: React.FC = () => {
  const board = useBoardContext();
  const { mutateAsync: updateBoard, isPending } = useUpdateBoard(board.id);
  const { data: allTemplates = [] } = useTemplates();

  const [draftColumns, draftColumnActions] = useList<BoardColumnData>(
    board.columns,
  );
  const [draftTemplateVersionIds, setDraftTemplateVersionIds] = useState<
    string[]
  >(board.templateVersions.map((tv) => tv.id));

  const linkedTemplateVersionsById = new Map(
    board.templateVersions.map((tv) => [tv.id, tv]),
  );
  const allTemplateVersionsById = new Map(
    allTemplates.flatMap((t) =>
      (t.templateVersions ?? []).map((tv): [string, TemplateVersion] => [
        tv.id,
        { ...tv, template: { id: t.id, name: t.name } },
      ]),
    ),
  );
  const draftTemplateVersions = draftTemplateVersionIds
    .map(
      (id) => linkedTemplateVersionsById.get(id) ?? allTemplateVersionsById.get(id),
    )
    .filter((tv): tv is TemplateVersion => Boolean(tv));

  const isDirty =
    JSON.stringify(draftColumns) !== JSON.stringify(board.columns) ||
    JSON.stringify(draftTemplateVersionIds) !==
      JSON.stringify(board.templateVersions.map((tv) => tv.id));

  function addTemplate(templateId: string) {
    const template = allTemplates.find((t) => t.id === templateId);
    const latestVersion = findLatestVersion(template?.templateVersions ?? []);
    if (!latestVersion) {
      toast.error("This template has no published version yet");
      return;
    }
    setDraftTemplateVersionIds((prev) => [...prev, latestVersion.id]);
  }

  async function handleSave() {
    const boardTemplateVersionIds = new Set(draftTemplateVersionIds);
    const prepared = prepareColumnsForSave(
      draftColumns,
      boardTemplateVersionIds,
    );
    if (!prepared) {
      toast.error(
        "Every column needs a widget, a size, and a type before saving",
      );
      return;
    }
    try {
      await updateBoard({
        columns: prepared,
        templateVersionIds: draftTemplateVersionIds,
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
          <BoardSettingLabel
            templateVersions={draftTemplateVersions}
            onAdd={addTemplate}
          />
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
                    templateVersions={draftTemplateVersions}
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

        {draftTemplateVersions.length === 0 && (
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
