import { JsonColumn } from "@/features/board/utils/column";
import {
  getMockBoardColumn,
  getMockBoardColumnDraft,
} from "@/features/board/testing/board.factory";
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
