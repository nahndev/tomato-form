import { TomatoIconKey } from "@tomato/icon";
import { editorStateToText } from "./copilotWidgetProperties";
import { sessionPropertiesInput, toSessionPatch, toSessionProperties } from "./copilotSession";

describe("sessionPropertiesInput", () => {
  it("accepts a persisted icon key", () => {
    const result = sessionPropertiesInput.safeParse({
      name: "Contact",
      icon: TomatoIconKey.Clock,
    });
    expect(result.success).toBe(true);
  });

  it("rejects an unknown icon key", () => {
    const result = sessionPropertiesInput.safeParse({ name: "Contact", icon: "not-an-icon" });
    expect(result.success).toBe(false);
  });

  it("rejects a blank name", () => {
    expect(sessionPropertiesInput.safeParse({ name: "   " }).success).toBe(false);
  });
});

describe("toSessionProperties", () => {
  it("keeps only the given fields and trims the name", () => {
    expect(toSessionProperties({ name: "  Contact  " })).toEqual({ name: "Contact" });
  });

  it("turns the plain-text description into editor state", () => {
    const { description } = toSessionProperties({ name: "Contact", description: "Line 1\nLine 2" });
    expect(description && editorStateToText(description)).toBe("Line 1\nLine 2");
  });

  it("does not store an empty description", () => {
    expect(toSessionProperties({ name: "Contact", description: "" })).toEqual({ name: "Contact" });
  });
});

describe("toSessionPatch", () => {
  it("only carries the fields the model sent", () => {
    expect(toSessionPatch({ icon: TomatoIconKey.Clock })).toEqual({ icon: TomatoIconKey.Clock });
  });

  it("clears the description when it is an empty string", () => {
    expect(toSessionPatch({ description: "" })).toStrictEqual({ description: undefined });
  });

  it("returns an empty patch when nothing is given", () => {
    expect(toSessionPatch({})).toEqual({});
  });
});
