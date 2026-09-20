import { BoardViewType } from "@/types/board-view";
import { BOARD_VIEW_TYPE_REGISTRY } from "./boardViewTypes";

describe("BOARD_VIEW_TYPE_REGISTRY", () => {
  it("has an entry for every BoardViewType value", () => {
    Object.values(BoardViewType).forEach((type) => {
      expect(BOARD_VIEW_TYPE_REGISTRY[type]).toBeDefined();
      expect(BOARD_VIEW_TYPE_REGISTRY[type].type).toBe(type);
    });
  });

  it("marks chart as configurable", () => {
    expect(BOARD_VIEW_TYPE_REGISTRY[BoardViewType.CHART].isConfigurable).toBe(true);
  });

  it("marks calendar and dashboard as not yet configurable", () => {
    expect(BOARD_VIEW_TYPE_REGISTRY[BoardViewType.CALENDAR].isConfigurable).toBe(false);
    expect(BOARD_VIEW_TYPE_REGISTRY[BoardViewType.DASHBOARD].isConfigurable).toBe(false);
  });
});
