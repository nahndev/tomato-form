"use client";

import { WidgetItemList } from "@/features/template/constants/widget/widgetItems";
import { useTemplateState } from "@/features/template/hooks/state/useTemplateState";
import { useWidgetActions } from "@/features/template/sync/hooks/useWidgetActions";
import type { WidgetProperties } from "@/types/template";
import type { WidgetType } from "@/types/widget";
import { useAgentContext, useFrontendTool } from "@copilotkit/react-core/v2";
import { v4 } from "uuid";
import { z } from "zod";

/** Properties with a plain scalar value - the ones a chat message can set safely. */
const COPILOT_PROPERTY_KEYS = ["label", "placeholder", "required"] as const;
type CopilotPropertyKey = (typeof COPILOT_PROPERTY_KEYS)[number];

const WIDGET_TYPES = WidgetItemList.map((def) => def.type);

const addWidgetParameters = z.object({
  type: z.string().describe("The widget type to add."),
  beforeWidgetId: z
    .string()
    .optional()
    .describe("Id of the widget to insert before. Omit to add at the end."),
});

const removeWidgetParameters = z.object({
  widgetId: z.string().describe("Id of the widget to remove."),
});

const setWidgetPropertyParameters = z.object({
  widgetId: z.string().describe("Id of the widget to change."),
  key: z.enum(COPILOT_PROPERTY_KEYS).describe("The property to change."),
  value: z.string().describe('The new value. For `required`, "true" or "false".'),
});

function isWidgetType(type: string): type is WidgetType {
  return (WIDGET_TYPES as readonly string[]).includes(type);
}

function parsePropertyValue(
  key: CopilotPropertyKey,
  raw: string,
): WidgetProperties[CopilotPropertyKey] | undefined {
  if (key !== "required") return raw;
  if (raw === "true") return true;
  if (raw === "false") return false;
  return undefined;
}

/**
 * Registers what the copilot can see (the template's widgets, the widget
 * types) and do (add / remove / set property tools) - the "widget functions" of the
 * builder. Renders nothing. Handlers return a plain sentence on success and
 * failure so the model reports the real outcome back to the user.
 */
export const WidgetCopilotFunctions: React.FC = () => {
  const { widgets } = useTemplateState();
  const { addWidget, removeWidget, setProperty } = useWidgetActions();

  useAgentContext({
    description:
      "Widgets currently in the template. Use `id` for tools; refer to widgets to the user by `label`.",
    value: Object.values(widgets).map((widget) => ({
      id: widget.id,
      type: widget.type,
      label: widget.label,
      placeholder: widget.placeholder ?? null,
      required: widget.required ?? null,
    })),
  });

  useAgentContext({
    description: "Widget types that can be added to the template.",
    value: WidgetItemList.map((def) => ({
      type: def.type,
      label: def.label,
      description: def.description,
    })),
  });

  useFrontendTool(
    {
      name: "addWidget",
      description: "Add a new widget to the template.",
      parameters: addWidgetParameters,
      handler: async ({ type, beforeWidgetId }) => {
        if (!isWidgetType(type)) return `Error: unknown widget type "${type}".`;
        const before = beforeWidgetId ? widgets[beforeWidgetId] : undefined;
        if (beforeWidgetId && !before) {
          return `Error: no widget with id "${beforeWidgetId}".`;
        }

        const id = v4();
        addWidget(id, type, before ?? null);
        return `Added ${type} widget with id ${id}.`;
      },
    },
    [widgets, addWidget],
  );

  useFrontendTool(
    {
      name: "removeWidget",
      description: "Remove a widget from the template.",
      parameters: removeWidgetParameters,
      handler: async ({ widgetId }) => {
        if (!widgets[widgetId]) return `Error: no widget with id "${widgetId}".`;
        removeWidget(widgetId);
        return `Removed widget ${widgetId}.`;
      },
    },
    [widgets, removeWidget],
  );

  useFrontendTool(
    {
      name: "setWidgetProperty",
      description: "Change the label, placeholder or required flag of a widget.",
      parameters: setWidgetPropertyParameters,
      handler: async ({ widgetId, key, value }) => {
        if (!widgets[widgetId]) return `Error: no widget with id "${widgetId}".`;

        const parsed = parsePropertyValue(key, value);
        if (parsed === undefined) {
          return `Error: "${value}" is not a valid value for ${key}.`;
        }
        setProperty(widgetId, key, parsed);
        return `Set ${key} of widget ${widgetId}.`;
      },
    },
    [widgets, setProperty],
  );

  return null;
};
