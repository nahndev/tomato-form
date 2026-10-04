import { parseLabelDisplayValue } from "@/features/board/utils/submissionDisplayValue";

describe("parseLabelDisplayValue", () => {
  it("returns null when there is no display value", () => {
    expect(parseLabelDisplayValue(undefined)).toBeNull();
    expect(parseLabelDisplayValue({})).toBeNull();
  });

  it("returns the text bucket when only text exists", () => {
    expect(parseLabelDisplayValue({ text: "hello" })).toBe("hello");
    expect(parseLabelDisplayValue({ text: "" })).toBeNull();
  });

  it("falls back to the entity bucket joined when only entity exists", () => {
    expect(parseLabelDisplayValue({ entity: ["a", "b"] })).toBe("a, b");
    expect(parseLabelDisplayValue({ entity: [] })).toBeNull();
  });

  it("prefers the text bucket when both exist", () => {
    expect(parseLabelDisplayValue({ entity: ["u1"], text: "Alice" })).toBe("Alice");
  });

  it("does not fall back to raw entity keys when text resolved to nothing (e.g. a deleted user)", () => {
    expect(parseLabelDisplayValue({ entity: ["u1"], text: "" })).toBeNull();
  });
});
