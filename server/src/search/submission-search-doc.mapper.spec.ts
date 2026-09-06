import type { Widget } from "@/template/template.types";
import { buildSubmissionSearchDoc } from "./submission-search-doc.mapper";

function getMockWidget(overrides?: Partial<Widget>): Widget {
  return {
    id: "w1",
    type: "text",
    label: "Field",
    ...overrides,
  };
}

describe("buildSubmissionSearchDoc", () => {
  it("buckets a select widget's value as a tag", () => {
    const widgets = { w1: getMockWidget({ type: "select" }) };

    const doc = buildSubmissionSearchDoc({ submissionId: "s1", data: { w1: "approved" }, widgets });

    expect(doc).toEqual({ id: "s1", tags: ["w1:approved"], date: [], text: [] });
  });

  it("emits one tag per entry for a multi-value (checkbox) widget", () => {
    const widgets = { w1: getMockWidget({ type: "checkbox" }) };

    const doc = buildSubmissionSearchDoc({ submissionId: "s1", data: { w1: ["a", "b"] }, widgets });

    expect(doc.tags).toEqual(["w1:a", "w1:b"]);
  });

  it("buckets a date widget's epoch-ms value under date", () => {
    const widgets = { w1: getMockWidget({ type: "date" }) };

    const doc = buildSubmissionSearchDoc({ submissionId: "s1", data: { w1: 1700000000000 }, widgets });

    expect(doc.date).toEqual([{ key: "w1", value: 1700000000000 }]);
  });

  it("parses a date widget's ISO string value into a timestamp", () => {
    const widgets = { w1: getMockWidget({ type: "date" }) };

    const doc = buildSubmissionSearchDoc({
      submissionId: "s1",
      data: { w1: "2024-01-01T00:00:00.000Z" },
      widgets,
    });

    expect(doc.date).toEqual([{ key: "w1", value: Date.parse("2024-01-01T00:00:00.000Z") }]);
  });

  it("buckets a text widget's value under text", () => {
    const widgets = { w1: getMockWidget({ type: "text-area" }) };

    const doc = buildSubmissionSearchDoc({ submissionId: "s1", data: { w1: "hello world" }, widgets });

    expect(doc.text).toEqual([{ key: "w1", value: "hello world" }]);
  });

  it("skips a value whose widget type isn't indexed", () => {
    const widgets = { w1: getMockWidget({ type: "signature" }) };

    const doc = buildSubmissionSearchDoc({
      submissionId: "s1",
      data: { w1: "data:image/png;base64,..." },
      widgets,
    });

    expect(doc).toEqual({ id: "s1", tags: [], date: [], text: [] });
  });

  it("skips a key with no matching widget", () => {
    const doc = buildSubmissionSearchDoc({ submissionId: "s1", data: { orphan: "value" }, widgets: {} });

    expect(doc).toEqual({ id: "s1", tags: [], date: [], text: [] });
  });

  it("skips null and undefined values", () => {
    const widgets = {
      w1: getMockWidget({ type: "text" }),
      w2: getMockWidget({ id: "w2", type: "text" }),
    };

    const doc = buildSubmissionSearchDoc({ submissionId: "s1", data: { w1: null, w2: undefined }, widgets });

    expect(doc.text).toEqual([]);
  });
});
