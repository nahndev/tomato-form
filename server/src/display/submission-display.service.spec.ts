import type { TemplateVersionSnapshot, Widget } from "@/template/template.types";
import { SubmissionDisplayService } from "./submission-display.service";

function getMockWidget(overrides?: Partial<Widget>): Widget {
  return {
    id: "w1",
    type: "text",
    label: "Field",
    ...overrides,
  };
}

function getMockSnapshot(widgets: Record<string, Widget>): TemplateVersionSnapshot {
  return { widgets } as TemplateVersionSnapshot;
}

describe("SubmissionDisplayService", () => {
  const service = new SubmissionDisplayService();

  it("sets a select widget's value as an entity", () => {
    const snapshot = getMockSnapshot({ w1: getMockWidget({ type: "select" }) });

    const doc = service.buildDisplayDoc({ data: { w1: "approved" } }, snapshot);

    expect(doc).toEqual({ w1: { entity: ["approved"] } });
  });

  it("backfills a widget with no matching data using its display-type default", () => {
    const snapshot = getMockSnapshot({
      w1: getMockWidget({ type: "text" }),
      w2: getMockWidget({ id: "w2", type: "date" }),
    });

    const doc = service.buildDisplayDoc({ data: {} }, snapshot);

    expect(doc).toEqual({ w1: { text: "" }, w2: { date: null } });
  });

  it("skips a widget whose type isn't displayable yet", () => {
    const snapshot = getMockSnapshot({ w1: getMockWidget({ type: "signature" }) });

    const doc = service.buildDisplayDoc({ data: { w1: "data:image/png;base64,..." } }, snapshot);

    expect(doc).toEqual({});
  });

  it("ignores a data key with no matching widget", () => {
    const snapshot = getMockSnapshot({ w1: getMockWidget({ type: "text" }) });

    const doc = service.buildDisplayDoc({ data: { w1: "hello", orphan: "value" } }, snapshot);

    expect(doc).toEqual({ w1: { text: "hello" } });
  });
});
