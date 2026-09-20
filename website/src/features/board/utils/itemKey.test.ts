import { ValueType } from "@/features/board/constants/column/valueTypes";
import { formatItemKey, parseItemKey } from "@/features/board/utils/itemKey";

describe("formatItemKey / parseItemKey", () => {
  it("formats and parses a widgetId:property compound key", () => {
    const key = formatItemKey("widget-1", ValueType.DATE);

    expect(key).toBe("widget-1:date");
    expect(parseItemKey(key)).toEqual({
      widgetId: "widget-1",
      property: ValueType.DATE,
    });
  });
});
