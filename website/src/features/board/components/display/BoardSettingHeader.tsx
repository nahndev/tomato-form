"use client";

import {
  BoardActionHeader,
  BoardColumnHeader,
  BoardHeader,
} from "@/components/board-table";
import { Input } from "@/components/ui/input";
import { DISPLAY_TYPE_REGISTRY } from "@/features/template/constants/widget/displayTypes";
import { DisplayType } from "@/types/display-type";
import type { BoardColumn } from "@/types/board";
import type { Template } from "@/types/template";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import AddColumnButton from "./AddColumnButton";

export interface BoardSettingHeaderProps {
  onChangeColumn: (column: BoardColumn) => void;
  onRemoveColumn: (columnId: string) => void;
  onAddColumn: (column: BoardColumn) => void;
}

const BoardSettingHeader: React.FC<BoardSettingHeaderProps> = ({
  onChangeColumn,
  onRemoveColumn,
  onAddColumn,
}) => {
  return (
    <BoardHeader<Template, BoardColumn>>
      {(columns) => (
        <>
          <div
            role="columnheader"
            className="flex items-center text-left text-xs font-medium text-muted-foreground"
          >
            Templates
          </div>

          {columns.map((column) => {
            const typeDefinition =
              DISPLAY_TYPE_REGISTRY[column.type ?? DisplayType.UNKNOWN];

            return (
              <BoardColumnHeader key={column.id} column={column}>
                <div className="flex flex-col gap-1 rounded-md border p-2">
                  <div className="flex flex-row items-center gap-2">
                    <Input
                      type="text"
                      value={column.label ?? ""}
                      placeholder="Label"
                      aria-label="Column label"
                      onChange={(e) =>
                        onChangeColumn({ ...column, label: e.target.value })
                      }
                      className="min-w-[150px]"
                    />
                    <span
                      className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium"
                      style={{
                        borderColor: typeDefinition.color,
                        color: typeDefinition.color,
                      }}
                    >
                      <TomatoIcon
                        icon={typeDefinition.icon}
                        className="size-3.5"
                      />
                      {typeDefinition.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemoveColumn(column.id)}
                      aria-label="Remove column"
                      className="shrink-0 rounded p-0.5 text-muted-foreground hover:text-destructive"
                    >
                      <TomatoIcon icon={TomatoIconKey.Close} className="size-3.5" />
                    </button>
                  </div>
                </div>
              </BoardColumnHeader>
            );
          })}

          <BoardActionHeader>
            <AddColumnButton onAdd={onAddColumn} />
          </BoardActionHeader>
        </>
      )}
    </BoardHeader>
  );
};

export default BoardSettingHeader;
