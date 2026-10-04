import type { SessionProperties } from "@/types/template";
import { TomatoIconKey } from "@tomato/icon";
import { z } from "zod";
import { toEditorState } from "./copilotWidgetProperties";

/**
 * A session's editable fields in the shape a model can produce reliably: the
 * icon is one of the persisted keys, the description is plain text. `condition`
 * is left out on purpose - the copilot does not edit it.
 */
export const sessionPropertiesInput = z.object({
  name: z
    .string()
    .trim()
    .min(1)
    .describe("Title of the session (wizard step), shown to the people filling the form."),
  icon: z
    .nativeEnum(TomatoIconKey)
    .optional()
    .describe("Icon of the session, one of the supported icon keys."),
  description: z
    .string()
    .optional()
    .describe("Text under the title. A new line starts a new paragraph."),
});

/** Same fields, all optional: the ones left out keep their current value. */
export const sessionPatchInput = sessionPropertiesInput.partial();

export type SessionPropertiesInput = z.infer<typeof sessionPropertiesInput>;
export type SessionPatchInput = z.infer<typeof sessionPatchInput>;

/** Stored properties of a new session. An empty description is not stored. */
export function toSessionProperties(input: SessionPropertiesInput): SessionProperties {
  const { description, name, ...scalars } = input;
  const properties: SessionProperties = { ...scalars, name: name.trim() };
  if (!description) return properties;
  return { ...properties, description: toEditorState(description) };
}

/**
 * Only the keys the model sent, so the result can be spread over a session.
 * An empty description clears the stored one.
 */
export function toSessionPatch(input: SessionPatchInput): Partial<SessionProperties> {
  const { description, name, ...scalars } = input;
  const patch: Partial<SessionProperties> = { ...scalars };
  if (name !== undefined) patch.name = name.trim();
  if (description !== undefined) {
    patch.description = description ? toEditorState(description) : undefined;
  }
  return patch;
}
