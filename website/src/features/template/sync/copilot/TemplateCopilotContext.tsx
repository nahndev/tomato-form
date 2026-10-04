"use client";

import { useWidgetSelection } from "@/features/template/components/provider/TemplateProvider";
import { useTemplateMeta } from "@/features/template/hooks/state/useTemplateMeta";
import { useTemplateState } from "@/features/template/hooks/state/useTemplateState";
import { useAgentContext } from "@copilotkit/react-core/v2";
import { useMemo } from "react";
import {
  describeGrid,
  describePropertyMeanings,
  describeSelection,
  describeSessions,
  describeTemplate,
  describeWidgetTypes,
} from "./copilotTemplateContext";

/**
 * Registers what the copilot knows about the form beyond its widgets: the
 * template, the grid and layout, what each widget type and property is, and
 * the widget selected in the builder. Renders nothing. The widgets themselves
 * are registered by `WidgetCopilotFunctions`.
 */
export const TemplateCopilotContext: React.FC = () => {
  const { name, sessions, layouts, widgets, widgetToSession } = useTemplateState();
  const { version } = useTemplateMeta();
  const { selected } = useWidgetSelection();

  // Fixed by the registries, so computed once.
  const grid = useMemo(describeGrid, []);
  const widgetTypes = useMemo(describeWidgetTypes, []);
  const propertyMeanings = useMemo(describePropertyMeanings, []);

  useAgentContext({
    description:
      "The form template being built. A template is a form: a list of sessions (wizard steps) holding widgets (fields) that people fill in and submit.",
    value: describeTemplate(name, version),
  });

  useAgentContext({
    description:
      "The grid widgets are placed on. Use it to judge widths and which widgets share a row.",
    value: grid,
  });

  useAgentContext({
    description:
      "Every widget type: whether it produces a value, the value types it exposes, the properties it supports (`settableProperties`) and its default grid layout. Only set properties a type supports; use a type for what it is meant for.",
    value: widgetTypes,
  });

  useAgentContext({
    description: "What each widget property means.",
    value: propertyMeanings,
  });

  useAgentContext({
    description:
      "The template's sessions and, in placement order (top to bottom), the widgets in each with their grid column, span, full-width and static flags. Properties of a widget are in the widgets context, by `widgetId`.",
    value: useMemo(
      () => describeSessions({ sessions, layouts, widgets, widgetToSession }),
      [sessions, layouts, widgets, widgetToSession],
    ),
  });

  useAgentContext({
    description:
      "The widget the user has selected in the builder (its properties are open for editing), or null. Requests like \"this field\" or \"the selected widget\" mean this one.",
    value: describeSelection(selected),
  });

  return null;
};
