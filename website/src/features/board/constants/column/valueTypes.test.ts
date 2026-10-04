import {
  getValueTypeDisplayTypes,
  getWidgetDisplayTypes,
  getWidgetValueTypes,
  ValueType,
  WIDGET_VALUE_TYPE_REGISTRY,
} from "@/features/board/constants/column/valueTypes";
import { DisplayType } from "@/types/display-type";
import { WidgetType } from "@/types/widget";

describe("WIDGET_VALUE_TYPE_REGISTRY", () => {
  it.each(Object.values(WidgetType))(
    "has an entry for the %s widget type",
    (type) => {
      expect(WIDGET_VALUE_TYPE_REGISTRY[type]).toBeDefined();
      expect(() => getWidgetDisplayTypes(type)).not.toThrow();
      expect(() => getWidgetValueTypes(type)).not.toThrow();
    },
  );

  it("exposes no display types for widgets that hold no value", () => {
    expect(getWidgetDisplayTypes(WidgetType.API_CALL)).toEqual([]);
    expect(getWidgetValueTypes(WidgetType.API_CALL)).toEqual([]);
    expect(getValueTypeDisplayTypes(WidgetType.API_CALL, ValueType.DEFAULT)).toEqual([]);
  });

  it("dedups display types across the value types of a widget", () => {
    expect(getWidgetDisplayTypes(WidgetType.DATETIME)).toEqual([
      DisplayType.DATETIME,
      DisplayType.TEXT,
      DisplayType.DATE,
      DisplayType.TIME,
    ]);
  });

  it.each([WidgetType.SELECT, WidgetType.CHECKBOX, WidgetType.RADIO])(
    "exposes a text value type next to default for the %s choice widget",
    (type) => {
      expect(getWidgetValueTypes(type)).toEqual([ValueType.DEFAULT, ValueType.TEXT]);
      expect(getValueTypeDisplayTypes(type, ValueType.TEXT)).toEqual([DisplayType.TEXT]);
    },
  );

  it("keeps the text value type off widgets that have no option text to resolve", () => {
    expect(getWidgetValueTypes(WidgetType.TEXT)).toEqual([ValueType.DEFAULT]);
    expect(getValueTypeDisplayTypes(WidgetType.TEXT, ValueType.TEXT)).toEqual([]);
  });
});
