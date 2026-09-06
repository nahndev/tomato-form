import type { TemplateVersionSnapshot, Widget } from "@/template/template.types";
import { DisplayMapperFactory } from "./display-mapper.factory";
import { DisplayMapperContext, SubmissionDisplayDoc } from "./display-mapper.types";

function getMockWidget(overrides?: Partial<Widget>): Widget {
  return {
    id: "w1",
    type: "text",
    label: "Field",
    ...overrides,
  };
}

function getMockContext(data: Record<string, unknown>): DisplayMapperContext {
  return {
    submission: { data },
    snapshot: { widgets: {} } as TemplateVersionSnapshot,
  };
}

function getMockDoc(overrides?: SubmissionDisplayDoc): SubmissionDisplayDoc {
  return { ...overrides };
}

describe("DisplayMapperFactory", () => {
  it.each(["select", "checkbox", "radio", "users", "submitted-by"])(
    "resolves an entity mapper for '%s' that sets a string-array value",
    (widgetType) => {
      const widget = getMockWidget({ type: widgetType });
      const mapper = DisplayMapperFactory.getMapper(widget);

      const doc = mapper?.map(getMockDoc(), widget, getMockContext({ w1: "approved" }));

      expect(doc?.w1).toEqual({ entity: ["approved"] });
    },
  );

  it.each(["select", "checkbox", "radio", "users", "submitted-by"])(
    "defaults an entity mapper for '%s' to an empty array when the value is missing",
    (widgetType) => {
      const widget = getMockWidget({ type: widgetType });
      const mapper = DisplayMapperFactory.getMapper(widget);

      const doc = mapper?.map(getMockDoc(), widget, getMockContext({}));

      expect(doc?.w1).toEqual({ entity: [] });
    },
  );

  it.each(["date", "datetime", "time", "created-at"])(
    "resolves a date mapper for '%s' that sets an epoch-ms timestamp",
    (widgetType) => {
      const widget = getMockWidget({ type: widgetType });
      const mapper = DisplayMapperFactory.getMapper(widget);

      const doc = mapper?.map(getMockDoc(), widget, getMockContext({ w1: 1700000000000 }));

      expect(doc?.w1).toEqual({ date: 1700000000000 });
    },
  );

  it.each(["date", "datetime", "time", "created-at"])(
    "defaults a date mapper for '%s' to null when the value is missing",
    (widgetType) => {
      const widget = getMockWidget({ type: widgetType });
      const mapper = DisplayMapperFactory.getMapper(widget);

      const doc = mapper?.map(getMockDoc(), widget, getMockContext({ w1: null }));

      expect(doc?.w1).toEqual({ date: null });
    },
  );

  it.each(["text", "text-area"])("resolves a text mapper for '%s' that sets a string value", (widgetType) => {
    const widget = getMockWidget({ type: widgetType });
    const mapper = DisplayMapperFactory.getMapper(widget);

    const doc = mapper?.map(getMockDoc(), widget, getMockContext({ w1: "hello world" }));

    expect(doc?.w1).toEqual({ text: "hello world" });
  });

  it.each(["text", "text-area"])(
    "defaults a text mapper for '%s' to an empty string when the value is missing",
    (widgetType) => {
      const widget = getMockWidget({ type: widgetType });
      const mapper = DisplayMapperFactory.getMapper(widget);

      const doc = mapper?.map(getMockDoc(), widget, getMockContext({}));

      expect(doc?.w1).toEqual({ text: "" });
    },
  );

  it("returns undefined for a widget type that isn't displayable yet", () => {
    expect(DisplayMapperFactory.getMapper(getMockWidget({ type: "signature" }))).toBeUndefined();
  });
});
