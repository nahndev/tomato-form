import { SubmissionSearchDoc } from "../../submission-search.types";
import { DateMapper } from "./date.mapper";

function getMockDoc(overrides?: Partial<SubmissionSearchDoc>): SubmissionSearchDoc {
  return { id: "s1", tags: [], date: [], text: [], ...overrides };
}

describe("DateMapper", () => {
  it("parses an ISO string value into an epoch-ms timestamp", () => {
    const doc = new DateMapper().map(getMockDoc(), "w1", "2024-01-01T00:00:00.000Z");

    expect(doc.date).toEqual([{ key: "w1", value: Date.parse("2024-01-01T00:00:00.000Z") }]);
  });

  it("skips a value that isn't a valid date", () => {
    const doc = new DateMapper().map(getMockDoc(), "w1", "not-a-date");

    expect(doc.date).toEqual([]);
  });

  it("skips a non-string, non-number value", () => {
    const doc = new DateMapper().map(getMockDoc(), "w1", true);

    expect(doc.date).toEqual([]);
  });
});
