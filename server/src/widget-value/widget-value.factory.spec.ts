import type { Widget } from "@/template/template.types";
import { Test } from "@nestjs/testing";
import { MappingContext } from "./mapping-context";
import { WidgetValueFactory } from "./widget-value.factory";
import { WidgetValueModule } from "./widget-value.module";

let factory: WidgetValueFactory;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [WidgetValueModule],
  }).compile();
  factory = moduleRef.get(WidgetValueFactory);
});

function getMockWidget(overrides?: Partial<Widget>): Widget {
  return { id: "w1", type: "text", label: "Field", ...overrides };
}

function getMappedDoc(widget: Widget, raw: unknown, users?: ReadonlyMap<string, string>) {
  const context = new MappingContext({
    data: { [widget.id]: raw },
    meta: { createdAt: new Date(1700000000000) },
    widgets: [widget],
    users,
  });
  const value = factory.getValue(widget.type);
  value.map(context, widget);
  return context.getDoc();
}

describe("WidgetValueFactory", () => {
  describe("user widget types (users/submitted-by)", () => {
    const users = new Map([
      ["u1", "Alice"],
      ["u2", "Bob"],
      ["u3", "Carol"],
    ]);

    it.each(["users", "submitted-by"])(
      "maps '%s' into a single default property, with the uuids under entity",
      (widgetType) => {
        const widget = getMockWidget({ type: widgetType });
        const doc = getMappedDoc(widget, ["u1", "u2"], users);

        expect(Object.keys(doc.w1)).toEqual(["default"]);
        expect(doc.w1.default.entity).toEqual(["u1", "u2"]);
      },
    );

    it.each(["users", "submitted-by"])(
      "resolves '%s' uuids to user names under text, comma-joined in selection order",
      (widgetType) => {
        const widget = getMockWidget({ type: widgetType });

        expect(getMappedDoc(widget, "u2", users).w1.default.text).toBe("Bob");
        expect(getMappedDoc(widget, ["u3", "u1"], users).w1.default.text).toBe("Carol, Alice");
      },
    );

    it("skips uuids that no longer match a user", () => {
      const widget = getMockWidget({ type: "users" });

      expect(getMappedDoc(widget, ["u1", "gone", "u2"], users).w1.default.text).toBe("Alice, Bob");
      expect(getMappedDoc(widget, "gone", users).w1.default.text).toBe("");
    });

    it.each([undefined, null, []])("defaults to empty entity and text when the value is %p", (raw) => {
      const widget = getMockWidget({ type: "users" });

      expect(getMappedDoc(widget, raw, users).w1.default).toEqual({ entity: [], text: "" });
    });

    it("defaults text to an empty string when no users were provided", () => {
      const widget = getMockWidget({ type: "users" });

      expect(getMappedDoc(widget, "u1").w1.default).toEqual({ entity: ["u1"], text: "" });
    });

    it.each(["users", "submitted-by"])(
      "validates '%s' against a string, an array of strings, or nothing",
      (widgetType) => {
        const value = factory.getValue(widgetType);

        expect(value.validate("u1")).toBe(true);
        expect(value.validate(["u1", "u2"])).toBe(true);
        expect(value.validate(null)).toBe(true);
        expect(value.validate(undefined)).toBe(true);
        expect(value.validate(42)).toBe(false);
        expect(value.validate(["u1", 42])).toBe(false);
      },
    );
  });

  describe("choice widget types (select/checkbox/radio)", () => {
    const options = [
      { key: "k1", value: "Apple", index: "a0" },
      { key: "k2", value: "Banana", index: "a1" },
      { key: "k3", value: "Cherry", index: "a2" },
    ];

    it.each(["select", "checkbox", "radio"])(
      "maps '%s' into a single default property, with the raw option keys under entity",
      (widgetType) => {
        const widget = getMockWidget({ type: widgetType, options });

        expect(Object.keys(getMappedDoc(widget, "k1").w1)).toEqual(["default"]);
        expect(getMappedDoc(widget, "k1").w1.default.entity).toEqual(["k1"]);
        expect(getMappedDoc(widget, ["k1", "k2"]).w1.default.entity).toEqual(["k1", "k2"]);
      },
    );

    it.each(["select", "checkbox", "radio"])(
      "maps '%s' text bucket to the option text of a single key",
      (widgetType) => {
        const widget = getMockWidget({ type: widgetType, options });

        expect(getMappedDoc(widget, "k2").w1.default.text).toBe("Banana");
      },
    );

    it.each(["select", "checkbox", "radio"])(
      "joins the option texts of multiple keys of '%s' with a comma and space",
      (widgetType) => {
        const widget = getMockWidget({ type: widgetType, options });

        expect(getMappedDoc(widget, ["k1", "k3"]).w1.default.text).toBe("Apple, Cherry");
      },
    );

    it("keeps the order of the selected keys, not the order of the options", () => {
      const widget = getMockWidget({ type: "checkbox", options });

      expect(getMappedDoc(widget, ["k3", "k1"]).w1.default.text).toBe("Cherry, Apple");
    });

    it("skips keys that no longer match an option", () => {
      const widget = getMockWidget({ type: "checkbox", options });

      expect(getMappedDoc(widget, ["k1", "gone", "k2"]).w1.default.text).toBe("Apple, Banana");
      expect(getMappedDoc(widget, "gone").w1.default.text).toBe("");
    });

    it.each([undefined, null, []])("defaults the text bucket to an empty string when the value is %p", (raw) => {
      const widget = getMockWidget({ type: "select", options });

      expect(getMappedDoc(widget, raw).w1.default.text).toBe("");
    });

    it("defaults the text bucket to an empty string when the widget has no options", () => {
      const widget = getMockWidget({ type: "select" });

      expect(getMappedDoc(widget, "k1").w1.default.text).toBe("");
    });

    it.each(["select", "checkbox", "radio"])(
      "validates '%s' against a string, an array of strings, or nothing",
      (widgetType) => {
        const value = factory.getValue(widgetType);

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
        const value = factory.getValue(widgetType);

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
      const value = factory.getValue(widgetType);

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
    expect(factory.getValue("signature").validate("anything")).toBe(true);
  });
});
