import { WidgetType } from "@/types/widget";
import {
  DISPLAY_TYPE_REGISTRY,
  WIDGET_DISPLAY_TYPE_REGISTRY,
} from "./display-type.registry";
import { DisplayType } from "@/types/display-type";

describe("DISPLAY_TYPE_REGISTRY", () => {
  it("has an entry for every DisplayType", () => {
    Object.values(DisplayType).forEach((type) => {
      expect(DISPLAY_TYPE_REGISTRY[type]).toBeDefined();
      expect(DISPLAY_TYPE_REGISTRY[type].type).toBe(type);
    });
  });
});

describe("WIDGET_DISPLAY_TYPE_REGISTRY", () => {
  it("has an entry for every WidgetType", () => {
    Object.values(WidgetType).forEach((type) => {
      expect(WIDGET_DISPLAY_TYPE_REGISTRY[type]).toBeDefined();
    });
  });

  it("marks structural widgets as not selectable", () => {
    expect(WIDGET_DISPLAY_TYPE_REGISTRY[WidgetType.LABEL]).toEqual([]);
    expect(WIDGET_DISPLAY_TYPE_REGISTRY[WidgetType.BUTTON]).toEqual([]);
    expect(WIDGET_DISPLAY_TYPE_REGISTRY[WidgetType.SESSION]).toEqual([]);
  });

  it("lets a Date widget be shown as date, text, or number", () => {
    expect(WIDGET_DISPLAY_TYPE_REGISTRY[WidgetType.DATE]).toEqual([
      DisplayType.DATE,
      DisplayType.TEXT,
      DisplayType.NUMBER,
    ]);
  });
});
