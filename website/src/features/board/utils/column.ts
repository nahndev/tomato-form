import { DEFAULT_COLUMN_SIZE } from "@/features/board/components/display/constants/size";
import type { BoardColumn, BoardColumnDraft, ColumnSize } from "@/types/board";
import type { DisplayType } from "@/types/display-type";
import { v4 } from "uuid";

/**
 * Single point of access for the BoardColumn json shape: creating a column
 * and every read/write of its fields goes through here, so a future shape
 * change (like items array -> map) only touches this file.
 */
export class JsonColumn {
  static create(): BoardColumnDraft {
    return {
      id: v4(),
      size: DEFAULT_COLUMN_SIZE,
      items: {},
    };
  }

  static getId(column: BoardColumnDraft): string {
    return column.id ?? "";
  }

  static getType(column: BoardColumnDraft): DisplayType | null {
    return column.type ?? null;
  }

  static setType(column: BoardColumnDraft, type: DisplayType): BoardColumnDraft {
    return { ...column, type };
  }

  static getSize(column: BoardColumnDraft): ColumnSize | null {
    return column.size ?? null;
  }

  static setSize(column: BoardColumnDraft, size: ColumnSize): BoardColumnDraft {
    return { ...column, size };
  }

  static getLabel(column: BoardColumnDraft): string | null {
    return column.label ?? null;
  }

  static setLabel(column: BoardColumnDraft, label: string): BoardColumnDraft {
    return { ...column, label };
  }

  static getItems(column: BoardColumnDraft): Record<string, string> {
    return column.items ?? {};
  }

  static getItemWidgetId(
    column: BoardColumnDraft,
    templateVersionId: string,
  ): string | null {
    return JsonColumn.getItems(column)[templateVersionId] ?? null;
  }

  static setItem(
    column: BoardColumnDraft,
    templateVersionId: string,
    widgetId: string,
  ): BoardColumnDraft {
    return {
      ...column,
      size: column.size ?? DEFAULT_COLUMN_SIZE,
      items: { ...JsonColumn.getItems(column), [templateVersionId]: widgetId },
    };
  }

  static removeItem(
    column: BoardColumnDraft,
    templateVersionId: string,
  ): BoardColumnDraft {
    const items = { ...JsonColumn.getItems(column) };
    delete items[templateVersionId];
    return { ...column, items };
  }

  static filterItemsByTemplateVersionIds(
    column: BoardColumn,
    templateVersionIds: Set<string>,
  ): BoardColumn {
    return {
      ...column,
      items: Object.fromEntries(
        Object.entries(column.items).filter(([templateVersionId]) =>
          templateVersionIds.has(templateVersionId),
        ),
      ),
    };
  }

  static hasItems(column: BoardColumnDraft): boolean {
    return Object.keys(JsonColumn.getItems(column)).length > 0;
  }

  /** Verifies a draft column has every field a saved BoardColumn requires, narrowing its type. */
  static isReadyToSave(column: BoardColumnDraft): column is BoardColumn {
    return (
      column.type != null &&
      column.size != null &&
      column.label != null &&
      column.label.trim().length > 0
    );
  }
}
