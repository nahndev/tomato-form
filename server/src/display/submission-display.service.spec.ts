import type { Submission } from "@/database/prisma-client";
import type { TemplateSnapshot, Widget } from "@/template/template.types";
import type { UserService } from "@/user/user.service";
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

function getMockSubmission(data: Record<string, unknown>): Submission {
  return { data, createdAt: new Date(1700000000000) } as unknown as Submission;
}

describe("SubmissionDisplayService", () => {
  const findAll = jest.fn();
  const service = new SubmissionDisplayService({ findAll } as unknown as UserService);

  beforeEach(() => {
    findAll.mockReset().mockResolvedValue([]);
  });

  it("sets a select widget's value as an entity", async () => {
    const snapshot = getMockSnapshot({ w1: getMockWidget({ type: "select" }) });

    const doc = await service.buildDisplayDoc(getMockSubmission({ w1: "approved" }), snapshot);

    expect(doc).toEqual({ w1: { default: { entity: ["approved"], text: "" } } });
  });

  it("backfills a widget with no matching data using its value contract's default", async () => {
    const snapshot = getMockSnapshot({
      w1: getMockWidget({ type: "text" }),
      w2: getMockWidget({ id: "w2", type: "date" }),
    });

    const doc = await service.buildDisplayDoc(getMockSubmission({}), snapshot);

    expect(doc).toEqual({
      w1: { default: { text: "" } },
      w2: { default: { date: null, text: "" } },
    });
  });

  it("fans a datetime widget out into default/date/time doc entries", async () => {
    const snapshot = getMockSnapshot({ w1: getMockWidget({ type: "datetime" }) });

    const doc = await service.buildDisplayDoc(getMockSubmission({ w1: 1700000000000 }), snapshot);

    expect(doc.w1.default).toEqual({ date: 1700000000000, text: new Date(1700000000000).toLocaleString() });
    expect(doc.w1.date).toEqual({ date: 1700000000000, text: new Date(1700000000000).toLocaleDateString() });
    expect(doc.w1.time).toEqual({ date: 1700000000000, text: new Date(1700000000000).toLocaleTimeString() });
  });

  it("falls back to string coercion for a widget whose type has no registered value contract", async () => {
    const snapshot = getMockSnapshot({ w1: getMockWidget({ type: "signature" }) });

    const doc = await service.buildDisplayDoc(getMockSubmission({ w1: "data:image/png;base64,..." }), snapshot);

    expect(doc).toEqual({ w1: { default: { text: "data:image/png;base64,..." } } });
  });

  it("ignores a data key with no matching widget", async () => {
    const snapshot = getMockSnapshot({ w1: getMockWidget({ type: "text" }) });

    const doc = await service.buildDisplayDoc(getMockSubmission({ w1: "hello", orphan: "value" }), snapshot);

    expect(doc).toEqual({ w1: { default: { text: "hello" } } });
  });

  it("resolves users and submitted-by uuids to names, loading users once", async () => {
    findAll.mockResolvedValue([
      { uuid: "u1", name: "Alice" },
      { uuid: "u2", name: "Bob" },
    ]);
    const snapshot = getMockSnapshot({
      w1: getMockWidget({ type: "users" }),
      w2: getMockWidget({ id: "w2", type: "submitted-by" }),
    });

    const doc = await service.buildDisplayDoc(getMockSubmission({ w1: ["u1", "u2"], w2: "u2" }), snapshot);

    expect(doc).toEqual({
      w1: { default: { entity: ["u1", "u2"], text: "Alice, Bob" } },
      w2: { default: { entity: ["u2"], text: "Bob" } },
    });
    expect(findAll).toHaveBeenCalledTimes(1);
  });

  it("does not load users when the template has no user-reference widget", async () => {
    const snapshot = getMockSnapshot({ w1: getMockWidget({ type: "text" }) });

    await service.buildDisplayDoc(getMockSubmission({ w1: "hello" }), snapshot);

    expect(findAll).not.toHaveBeenCalled();
  });
});
