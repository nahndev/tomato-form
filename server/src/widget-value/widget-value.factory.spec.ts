import type { Widget } from "@/template/template.types";
import { MappingContext } from "./mapping-context";
import { WidgetValueFactory } from "./widget-value.factory";

function getMockWidget(overrides?: Partial<Widget>): Widget {
  return { id: "w1", type: "text", label: "Field", ...overrides };
}

function getMappedDoc(widget: Widget, raw: unknown) {
  const context = new MappingContext({ data: { [widget.id]: raw } });
  const value = WidgetValueFactory.getValue(widget.type);
  value.map(context, widget);
  return context.getDoc();
}

describe("WidgetValueFactory", () => {
  describe("entity widget types (select/checkbox/radio/users/submitted-by)", () => {
    it.each(["select", "checkbox", "radio", "users", "submitted-by"])(
      "maps '%s' into a default entity property",
      (widgetType) => {
        const widget = getMockWidget({ type: widgetType });

        expect(getMappedDoc(widget, "approved")).toEqual({ w1: { default: { entity: ["approved"] } } });
      },
    );

    it.each(["select", "checkbox", "radio", "users", "submitted-by"])(
      "defaults '%s' to an empty array when the value is missing",
      (widgetType) => {
        const widget = getMockWidget({ type: widgetType });

        expect(getMappedDoc(widget, undefined)).toEqual({ w1: { default: { entity: [] } } });
      },
    );

    it.each(["select", "checkbox", "radio", "users", "submitted-by"])(
      "validates '%s' against a string, an array of strings, or nothing",
      (widgetType) => {
        const value = WidgetValueFactory.getValue(widgetType);

        expect(value.validate("approved")).toBe(true);
        expect(value.validate(["approved", "pending"])).toBe(true);
        expect(value.validate(null)).toBe(true);
        expect(value.validate(undefined)).toBe(true);
        expect(value.validate(42)).toBe(false);
        expect(value.validate(["approved", 42])).toBe(false);
      },
    );
  });

  describe("date-family widget types (date/time/created-at)", () => {
    it.each(["date", "time", "created-at"])(
      "maps '%s' into a default property carrying an epoch-ms date and a text fallback",
      (widgetType) => {
        const widget = getMockWidget({ type: widgetType });

        expect(getMappedDoc(widget, 1700000000000)).toEqual({
          w1: { default: { date: 1700000000000, text: expect.any(String) } },
        });
      },
    );

    it.each(["date", "time", "created-at"])(
      "defaults '%s' to null/empty-string when the value isn't a number",
      (widgetType) => {
        const widget = getMockWidget({ type: widgetType });

        expect(getMappedDoc(widget, null)).toEqual({ w1: { default: { date: null, text: "" } } });
      },
    );

    it.each(["date", "time", "created-at"])(
      "validates '%s' against a number or nothing",
      (widgetType) => {
        const value = WidgetValueFactory.getValue(widgetType);

        expect(value.validate(1700000000000)).toBe(true);
        expect(value.validate(null)).toBe(true);
        expect(value.validate(undefined)).toBe(true);
        expect(value.validate("1700000000000")).toBe(false);
      },
    );

    it("formats 'date' and 'created-at' text as a locale date string", () => {
      const expectedText = new Date(1700000000000).toLocaleDateString();

      expect(getMappedDoc(getMockWidget({ type: "date" }), 1700000000000)).toEqual({
        w1: { default: { date: 1700000000000, text: expectedText } },
      });
      expect(getMappedDoc(getMockWidget({ type: "created-at" }), 1700000000000)).toEqual({
        w1: { default: { date: 1700000000000, text: expectedText } },
      });
    });

    it("formats 'time' text as a locale time string, distinct from a locale date string", () => {
      const doc = getMappedDoc(getMockWidget({ type: "time" }), 1700000000000);

      expect(doc.w1.default.text).toBe(new Date(1700000000000).toLocaleTimeString());
      expect(doc.w1.default.text).not.toBe(new Date(1700000000000).toLocaleDateString());
    });
  });

  describe("'datetime'", () => {
    const widget = getMockWidget({ type: "datetime" });

    it("fans out into default/date/time properties, all carrying the same epoch-ms value", () => {
      const doc = getMappedDoc(widget, 1700000000000);

      expect(doc.w1.default.date).toBe(1700000000000);
      expect(doc.w1.date.date).toBe(1700000000000);
      expect(doc.w1.time.date).toBe(1700000000000);
    });

    it("formats each property's text with its own value contract (full, date-only, time-only)", () => {
      const doc = getMappedDoc(widget, 1700000000000);

      expect(doc.w1.default.text).toBe(new Date(1700000000000).toLocaleString());
      expect(doc.w1.date.text).toBe(new Date(1700000000000).toLocaleDateString());
      expect(doc.w1.time.text).toBe(new Date(1700000000000).toLocaleTimeString());
    });

    it("defaults default/date/time properties to null/empty-string when the value is missing", () => {
      const doc = getMappedDoc(widget, null);

      expect(doc).toEqual({
        w1: {
          default: { date: null, text: "" },
          date: { date: null, text: "" },
          time: { date: null, text: "" },
        },
      });
    });
  });

  describe("text widget types (text/text-area)", () => {
    it.each(["text", "text-area"])("maps '%s' into a default text property", (widgetType) => {
      const widget = getMockWidget({ type: widgetType });

      expect(getMappedDoc(widget, "hello world")).toEqual({ w1: { default: { text: "hello world" } } });
    });

    it.each(["text", "text-area"])(
      "defaults '%s' to an empty string when the value is missing",
      (widgetType) => {
        const widget = getMockWidget({ type: widgetType });

        expect(getMappedDoc(widget, undefined)).toEqual({ w1: { default: { text: "" } } });
      },
    );

    it.each(["text", "text-area"])("validates '%s' against a string or nothing", (widgetType) => {
      const value = WidgetValueFactory.getValue(widgetType);

      expect(value.validate("hello world")).toBe(true);
      expect(value.validate(null)).toBe(true);
      expect(value.validate(undefined)).toBe(true);
      expect(value.validate(42)).toBe(false);
    });
  });

  it("falls back to string coercion under the default property for a widget type with no registered value contract", () => {
    const widget = getMockWidget({ type: "signature" });

    expect(getMappedDoc(widget, "data:image/png;base64,...")).toEqual({
      w1: { default: { text: "data:image/png;base64,..." } },
    });
    expect(WidgetValueFactory.getValue("signature").validate("anything")).toBe(true);
  });
});
