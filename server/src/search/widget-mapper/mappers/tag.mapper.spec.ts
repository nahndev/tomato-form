import { SubmissionSearchDoc } from "../../submission-search.types";
import { TagMapper } from "./tag.mapper";

function getMockDoc(overrides?: Partial<SubmissionSearchDoc>): SubmissionSearchDoc {
  return { id: "s1", tags: [], date: [], text: [], ...overrides };
}

describe("TagMapper", () => {
  it("pushes a single key:value tag for a scalar value", () => {
    const doc = new TagMapper().map(getMockDoc(), "w1", "approved");

    expect(doc.tags).toEqual(["w1:approved"]);
  });

  it("pushes one tag per entry for an array value", () => {
    const doc = new TagMapper().map(getMockDoc(), "w1", ["a", "b"]);

    expect(doc.tags).toEqual(["w1:a", "w1:b"]);
  });
});
