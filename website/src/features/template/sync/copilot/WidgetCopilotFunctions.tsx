"use client";

import { WidgetItemList, WidgetItems } from "@/features/template/constants/widget/widgetItems";
import { useTemplateState } from "@/features/template/hooks/state/useTemplateState";
import { useSessionActions } from "@/features/template/sync/hooks/useSessionActions";
import { useWidgetActions } from "@/features/template/sync/hooks/useWidgetActions";
import type { WidgetType } from "@/types/widget";
import { useTransaction } from "@tomato/sync";
import { useAgentContext, useFrontendTool } from "@copilotkit/react-core/v2";
import { v4 } from "uuid";
import { z } from "zod";
import {
  describeWidget,
  toWidgetProperties,
  widgetPropertiesInput,
} from "./copilotWidgetProperties";
import { findLayoutError, toPlacementLayout, widgetLayoutInput } from "./copilotWidgetLayout";
import { WidgetLayoutCopilotFunctions } from "./WidgetLayoutCopilotFunctions";
import { WidgetPropertyCopilotFunctions } from "./WidgetPropertyCopilotFunctions";

const WIDGET_TYPES = WidgetItemList.map((def) => def.type);

const addWidgetParameters = z.object({
  type: z.string().describe("The widget type to add."),
  afterWidgetId: z
    .string()
    .optional()
    .describe("Id of the widget to insert right after. Omit to add at the end."),
  properties: widgetPropertiesInput
    .optional()
    .describe(
      "Properties to create the widget with. Omitted ones keep the widget type's defaults.",
    ),
  layout: widgetLayoutInput
    .optional()
    .describe(
      "Grid column / span / full width to create the widget with. Omitted ones keep the widget type's default layout.",
    ),
});

const removeWidgetParameters = z.object({
  widgetId: z.string().describe("Id of the widget to remove."),
});

function isWidgetType(type: string): type is WidgetType {
  return (WIDGET_TYPES as readonly string[]).includes(type);
}

/**
 * Registers what the copilot can see (the template's widgets, the widget
 * types) and do (add / remove tools) - the "widget functions" of the
 * builder; editing an existing widget is `WidgetPropertyCopilotFunctions`
 * (properties) and `WidgetLayoutCopilotFunctions` (grid placement).
 * Renders nothing. Handlers return a plain sentence on success and failure
 * so the model reports the real outcome back to the user.
 */
export const WidgetCopilotFunctions: React.FC = () => {
  const { widgets } = useTemplateState();
  const { addWidget, removeWidget, setProperties } = useWidgetActions();
  const { placeWidget } = useSessionActions();
  const transact = useTransaction();

  useAgentContext({
    description:
      "Widgets currently in the template. Use `id` for tools; refer to widgets to the user by `label`.",
    // A JSON string: it drops the unset (undefined) properties, which the
    // context's JSON value type does not accept.
    value: JSON.stringify(Object.values(widgets).map(describeWidget)),
  });

  useFrontendTool(
    {
      name: "addWidget",
      description:
        "Add a new widget to the template, optionally with its properties and grid layout already set.",
      parameters: addWidgetParameters,
      handler: async ({ type, afterWidgetId, properties, layout }) => {
        if (!isWidgetType(type)) return `Error: unknown widget type "${type}".`;
        const after = afterWidgetId ? widgets[afterWidgetId] : undefined;
        if (afterWidgetId && !after) {
          return `Error: no widget with id "${afterWidgetId}".`;
        }
        const layoutError = layout
          ? findLayoutError(layout, WidgetItems[type].defaultLayout)
          : null;
        if (layoutError) return layoutError;

        const id = v4();
        // One transaction: the new widget is one undo step, however much it is set up.
        transact(() => {
          addWidget(id, type, after ?? null);
          if (properties) setProperties(id, toWidgetProperties(properties));
          if (layout) placeWidget(id, { layout: toPlacementLayout(layout) });
        });
        return `Added ${type} widget with id ${id}.`;
      },
    },
    [widgets, addWidget, setProperties, placeWidget, transact],
  );

  useFrontendTool(
    {
      name: "removeWidget",
      description: "Remove a widget from the template.",
      parameters: removeWidgetParameters,
      handler: async ({ widgetId }) => {
        if (!widgets[widgetId])
          return `Error: no widget with id "${widgetId}".`;
        removeWidget(widgetId);
        return `Removed widget ${widgetId}.`;
      },
    },
    [widgets, removeWidget],
  );

  return (
    <>
      <WidgetPropertyCopilotFunctions />
      <WidgetLayoutCopilotFunctions />
    </>
  );
};
