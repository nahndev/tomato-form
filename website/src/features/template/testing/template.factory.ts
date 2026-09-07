import { WidgetType } from "@/types/widget";
import type { Template, TemplateSnapshot, Widget } from "@/types/template";
import { mockId } from "@/lib/testing/mockId";

export function getMockWidget(overrides?: Partial<Widget>): Widget {
  return {
    id: mockId("widget"),
    type: WidgetType.TEXT,
    label: "Widget",
    ...overrides,
  };
}

export function getMockTemplateSnapshot(
  overrides?: Partial<TemplateSnapshot>,
): TemplateSnapshot {
  return {
    widgets: {},
    layouts: {},
    widgetToSession: {},
    sessions: {},
    ...overrides,
  };
}

export function getMockTemplate(overrides?: Partial<Template>): Template {
  return {
    id: mockId("template"),
    name: "Template",
    snapshot: getMockTemplateSnapshot(),
    ...overrides,
  };
}
