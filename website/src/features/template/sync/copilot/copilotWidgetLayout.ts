import type { WidgetPlacement } from "@/features/template/sync/handlers/LayoutHandler";
import type { GridLayout } from "@/types/template";
import { GRID_COLUMNS } from "@tomato/grid";
import { z } from "zod";

/**
 * The grid fields of a widget in the vocabulary of the copilot tools. Every
 * field is optional: the ones left out keep the widget's current value (or,
 * for a new widget, its type's default).
 */
export const widgetLayoutInput = z.object({
  column: z
    .number()
    .int()
    .min(0)
    .max(GRID_COLUMNS - 1)
    .optional()
    .describe(`First column the widget covers, 0 to ${GRID_COLUMNS - 1}.`),
  span: z
    .number()
    .int()
    .min(1)
    .max(GRID_COLUMNS)
    .optional()
    .describe(
      `How many columns the widget covers, 1 to ${GRID_COLUMNS}; column + span must not exceed ${GRID_COLUMNS}.`,
    ),
  fullWidth: z
    .boolean()
    .optional()
    .describe("Cover the whole row; column and span are then ignored."),
});

export type WidgetLayoutInput = z.infer<typeof widgetLayoutInput>;

/** An `Error: ...` sentence when the layout would not fit the grid, otherwise `null`. */
export function findLayoutError(
  input: WidgetLayoutInput,
  current: Omit<GridLayout, "idx">,
): string | null {
  const isFullWidth = input.fullWidth ?? current.isFullWidth ?? false;
  if (isFullWidth) return null;

  const column = input.column ?? current.column;
  const span = input.span ?? current.span;
  if (column + span <= GRID_COLUMNS) return null;
  return `Error: column ${column} + span ${span} exceeds the ${GRID_COLUMNS} columns of the grid.`;
}

/** Only the fields the model gave, so the rest of the layout is not overwritten with `undefined`. */
export function toPlacementLayout(input: WidgetLayoutInput): WidgetPlacement["layout"] {
  return {
    ...(input.column !== undefined && { column: input.column }),
    ...(input.span !== undefined && { span: input.span }),
    ...(input.fullWidth !== undefined && { isFullWidth: input.fullWidth }),
  };
}
