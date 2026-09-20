import type { TemplateSnapshot, Widget } from "@/template/template.types";
import { SubmissionDisplayService } from "./submission-display.service";

function getMockWidget(overrides?: Partial<Widget>): Widget {
  return {
    id: "w1",
    type: "text",
    label: "Field",
    ...overrides,
  };
}

function getMockSnapshot(widgets: Record<string, Widget>): TemplateSnapshot {
  return { widgets } as TemplateSnapshot;
}

describe("SubmissionDisplayService", () => {
  const service = new SubmissionDisplayService();

  it("sets a select widget's value as an entity", () => {
    const snapshot = getMockSnapshot({ w1: getMockWidget({ type: "select" }) });

    const doc = service.buildDisplayDoc({ data: { w1: "approved" } }, snapshot);

    expect(doc).toEqual({ w1: { default: { entity: ["approved"] } } });
  });

  it("backfills a widget with no matching data using its value contract's default", () => {
    const snapshot = getMockSnapshot({
      w1: getMockWidget({ type: "text" }),
      w2: getMockWidget({ id: "w2", type: "date" }),
    });

    const doc = service.buildDisplayDoc({ data: {} }, snapshot);

    expect(doc).toEqual({
      w1: { default: { text: "" } },
      w2: { default: { date: null, text: "" } },
    });
  });

  it("fans a datetime widget out into default/date/time doc entries", () => {
    const snapshot = getMockSnapshot({ w1: getMockWidget({ type: "datetime" }) });

    const doc = service.buildDisplayDoc({ data: { w1: 1700000000000 } }, snapshot);

    expect(doc.w1.default).toEqual({ date: 1700000000000, text: new Date(1700000000000).toLocaleString() });
    expect(doc.w1.date).toEqual({ date: 1700000000000, text: new Date(1700000000000).toLocaleDateString() });
    expect(doc.w1.time).toEqual({ date: 1700000000000, text: new Date(1700000000000).toLocaleTimeString() });
  });

  it("falls back to string coercion for a widget whose type has no registered value contract", () => {
    const snapshot = getMockSnapshot({ w1: getMockWidget({ type: "signature" }) });

    const doc = service.buildDisplayDoc({ data: { w1: "data:image/png;base64,..." } }, snapshot);

    expect(doc).toEqual({ w1: { default: { text: "data:image/png;base64,..." } } });
  });

  it("ignores a data key with no matching widget", () => {
    const snapshot = getMockSnapshot({ w1: getMockWidget({ type: "text" }) });

    const doc = service.buildDisplayDoc({ data: { w1: "hello", orphan: "value" } }, snapshot);

    expect(doc).toEqual({ w1: { default: { text: "hello" } } });
  });
});
