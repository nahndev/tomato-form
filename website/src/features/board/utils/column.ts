import { DEFAULT_COLUMN_SIZE } from "@/features/board/components/display/constants/size";
import type { BoardColumn, ColumnSize } from "@/types/board";
import type { DisplayType } from "@/types/display-type";
import { v4 } from "uuid";

/**
 * Single point of access for the BoardColumn json shape: creating a column
 * and every read/write of its fields goes through here, so a future shape
 * change (like items array -> map) only touches this file.
 */
export class JsonColumn {
  static create(): BoardColumn {
    return {
      id: v4(),
      type: null,
      size: DEFAULT_COLUMN_SIZE,
      label: null,
      items: {},
    };
  }

  static getId(column: BoardColumn): string {
    return column.id;
  }

  static getType(column: BoardColumn): DisplayType | null {
    return column.type;
  }

  static setType(column: BoardColumn, type: DisplayType): BoardColumn {
    return { ...column, type };
  }

  static getSize(column: BoardColumn): ColumnSize | null {
    return column.size;
  }

  static setSize(column: BoardColumn, size: ColumnSize): BoardColumn {
    return { ...column, size };
  }

  static getLabel(column: BoardColumn): string | null {
    return column.label;
  }

  static setLabel(column: BoardColumn, label: string): BoardColumn {
    return { ...column, label };
  }

  static getItems(column: BoardColumn): Record<string, string> {
    return column.items;
  }

  static getItemWidgetId(
    column: BoardColumn,
    templateVersionId: string,
  ): string | null {
    return column.items[templateVersionId] ?? null;
  }

  static setItem(
    column: BoardColumn,
    templateVersionId: string,
    widgetId: string,
  ): BoardColumn {
    return {
      ...column,
      size: column.size ?? DEFAULT_COLUMN_SIZE,
      items: { ...column.items, [templateVersionId]: widgetId },
    };
  }

  static removeItem(column: BoardColumn, templateVersionId: string): BoardColumn {
    const items = { ...column.items };
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

  static hasItems(column: BoardColumn): boolean {
    return Object.keys(column.items).length > 0;
  }

  static isReadyToSave(column: BoardColumn): boolean {
    return column.type !== null && column.size !== null;
  }
}
