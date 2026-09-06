import { SubmissionSearchDoc } from "../submission-search.types";
import { WidgetMapperFactory } from "./widget-mapper.factory";

function getMockDoc(overrides?: Partial<SubmissionSearchDoc>): SubmissionSearchDoc {
  return { id: "s1", tags: [], date: [], text: [], ...overrides };
}

describe("WidgetMapperFactory", () => {
  it.each(["select", "checkbox", "radio", "users", "submitted-by"])(
    "resolves a tag mapper for '%s' that pushes key:value tags",
    (widgetType) => {
      const mapper = WidgetMapperFactory.getMapper(widgetType);

      const doc = mapper?.map(getMockDoc(), "w1", "approved");

      expect(doc?.tags).toEqual(["w1:approved"]);
    },
  );

  it.each(["date", "datetime", "time", "created-at"])(
    "resolves a date mapper for '%s' that pushes an epoch-ms timestamp",
    (widgetType) => {
      const mapper = WidgetMapperFactory.getMapper(widgetType);

      const doc = mapper?.map(getMockDoc(), "w1", 1700000000000);

      expect(doc?.date).toEqual([{ key: "w1", value: 1700000000000 }]);
    },
  );

  it.each(["text", "text-area"])("resolves a text mapper for '%s' that pushes a string value", (widgetType) => {
    const mapper = WidgetMapperFactory.getMapper(widgetType);

    const doc = mapper?.map(getMockDoc(), "w1", "hello world");

    expect(doc?.text).toEqual([{ key: "w1", value: "hello world" }]);
  });

  it("returns undefined for a widget type that isn't indexed yet", () => {
    expect(WidgetMapperFactory.getMapper("signature")).toBeUndefined();
  });
});
