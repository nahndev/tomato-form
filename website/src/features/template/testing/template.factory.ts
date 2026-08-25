import { WidgetType } from "@/types/widget";
import type {
  Template,
  TemplateVersion,
  TemplateVersionSnapshot,
  Widget,
} from "@/types/template";
import { mockId } from "@/lib/testing/mockId";

export function getMockWidget(overrides?: Partial<Widget>): Widget {
  return {
    id: mockId("widget"),
    type: WidgetType.TEXT,
    label: "Widget",
    ...overrides,
  };
}

export function getMockTemplateVersionSnapshot(
  overrides?: Partial<TemplateVersionSnapshot>,
): TemplateVersionSnapshot {
  return {
    widgets: {},
    layouts: {},
    widgetToSession: {},
    sessions: {},
    ...overrides,
  };
}

export function getMockTemplateVersion(
  overrides?: Partial<TemplateVersion>,
): TemplateVersion {
  return {
    id: mockId("template-version"),
    templateId: mockId("template"),
    version: "1.0.0",
    snapshot: getMockTemplateVersionSnapshot(),
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

export function getMockTemplate(overrides?: Partial<Template>): Template {
  return {
    id: mockId("template"),
    name: "Template",
    templateVersions: [],
    ...overrides,
  };
}
