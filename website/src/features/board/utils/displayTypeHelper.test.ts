import { ValueProperty } from "@/features/board/constants/column/valueProperties";
import { getCommonDisplayTypes } from "@/features/board/utils/displayTypeHelper";
import { DisplayType } from "@/types/display-type";
import { WidgetType } from "@/types/widget";

describe("getCommonDisplayTypes", () => {
  it("returns null when there are no entries (unrestricted)", () => {
    expect(getCommonDisplayTypes([])).toBeNull();
  });

  it("returns a single-entry property's allowed types", () => {
    const result = getCommonDisplayTypes([
      { widgetType: WidgetType.TEXT, property: ValueProperty.DEFAULT },
    ]);

    expect(result).toEqual([DisplayType.TEXT]);
  });

  it("intersects allowed types across multiple entries", () => {
    const result = getCommonDisplayTypes([
      { widgetType: WidgetType.DATE, property: ValueProperty.DEFAULT },
      { widgetType: WidgetType.CREATED_AT, property: ValueProperty.DEFAULT },
    ]);

    expect(result).toEqual([DisplayType.DATE, DisplayType.TEXT]);
  });

  it("returns an empty array when entries share nothing", () => {
    const result = getCommonDisplayTypes([
      { widgetType: WidgetType.TEXT, property: ValueProperty.DEFAULT },
      { widgetType: WidgetType.NUMBER, property: ValueProperty.DEFAULT },
    ]);

    expect(result).toEqual([]);
  });

  it("treats datetime's three properties as one DisplayType option each, all narrowing to DATE when paired with a plain date widget", () => {
    const dateOnly = getCommonDisplayTypes([
      { widgetType: WidgetType.DATETIME, property: ValueProperty.DATE },
      { widgetType: WidgetType.DATE, property: ValueProperty.DEFAULT },
    ]);
    expect(dateOnly).toEqual([DisplayType.DATE, DisplayType.TEXT]);

    const timeOnly = getCommonDisplayTypes([
      { widgetType: WidgetType.DATETIME, property: ValueProperty.TIME },
      { widgetType: WidgetType.TIME, property: ValueProperty.DEFAULT },
    ]);
    expect(timeOnly).toEqual([DisplayType.TIME, DisplayType.TEXT]);

    const fullDefault = getCommonDisplayTypes([
      { widgetType: WidgetType.DATETIME, property: ValueProperty.DEFAULT },
    ]);
    expect(fullDefault).toEqual([
      DisplayType.DATETIME,
      DisplayType.TEXT,
      DisplayType.DATE,
      DisplayType.TIME,
    ]);
  });
});
