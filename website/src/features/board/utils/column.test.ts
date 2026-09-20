import { ValueProperty } from "@/features/board/constants/column/valueProperties";
import {
  getMockBoardColumn,
  getMockBoardColumnDraft,
} from "@/features/board/testing/board.factory";
import { JsonColumn } from "@/features/board/utils/column";
import { DisplayType } from "@/types/display-type";

describe("JsonColumn.isReadyToSave", () => {
  it("returns true when type, size, and label are all present", () => {
    const column = getMockBoardColumn();

    expect(JsonColumn.isReadyToSave(column)).toBe(true);
  });

  it("returns false when type is missing", () => {
    const column = getMockBoardColumnDraft({
      size: { width: 150 },
      label: "Column",
    });

    expect(JsonColumn.isReadyToSave(column)).toBe(false);
  });

  it("returns false when size is missing", () => {
    const column = getMockBoardColumnDraft({
      type: DisplayType.TEXT,
      label: "Column",
    });

    expect(JsonColumn.isReadyToSave(column)).toBe(false);
  });

  it("returns false when label is missing", () => {
    const column = getMockBoardColumnDraft({
      type: DisplayType.TEXT,
      size: { width: 150 },
    });

    expect(JsonColumn.isReadyToSave(column)).toBe(false);
  });

  it("returns false when label is blank", () => {
    const column = getMockBoardColumnDraft({
      type: DisplayType.TEXT,
      size: { width: 150 },
      label: "   ",
    });

    expect(JsonColumn.isReadyToSave(column)).toBe(false);
  });
});

describe("JsonColumn items", () => {
  it("returns null for an unset item", () => {
    const column = getMockBoardColumnDraft();

    expect(JsonColumn.getItem(column, "template-1")).toBeNull();
    expect(JsonColumn.getItemWidgetId(column, "template-1")).toBeNull();
    expect(JsonColumn.getItemProperty(column, "template-1")).toBeNull();
  });

  it("formats and parses a widgetId:property compound key", () => {
    const key = JsonColumn.formatItemKey("widget-1", ValueProperty.DATE);

    expect(key).toBe("widget-1:date");
    expect(JsonColumn.parseItemKey(key)).toEqual({
      widgetId: "widget-1",
      property: ValueProperty.DATE,
    });
  });

  it("sets and reads back a widget + property for a template", () => {
    const column = JsonColumn.setItem(
      getMockBoardColumnDraft(),
      "template-1",
      JsonColumn.formatItemKey("widget-1", ValueProperty.DATE),
    );

    expect(JsonColumn.getItem(column, "template-1")).toBe("widget-1:date");
    expect(JsonColumn.getItemWidgetId(column, "template-1")).toBe("widget-1");
    expect(JsonColumn.getItemProperty(column, "template-1")).toBe(ValueProperty.DATE);
  });

  it("overwrites a template's item when set again", () => {
    let column = JsonColumn.setItem(
      getMockBoardColumnDraft(),
      "template-1",
      JsonColumn.formatItemKey("widget-1", ValueProperty.DEFAULT),
    );
    column = JsonColumn.setItem(
      column,
      "template-1",
      JsonColumn.formatItemKey("widget-2", ValueProperty.TIME),
    );

    expect(JsonColumn.getItem(column, "template-1")).toBe("widget-2:time");
  });

  it("removes an item", () => {
    const withItem = JsonColumn.setItem(
      getMockBoardColumnDraft(),
      "template-1",
      JsonColumn.formatItemKey("widget-1", ValueProperty.DEFAULT),
    );

    const column = JsonColumn.removeItem(withItem, "template-1");

    expect(JsonColumn.getItem(column, "template-1")).toBeNull();
  });
});
