import { WidgetType } from "@/types/widget";
import type {
  OptionItem,
  Template,
  TemplateSnapshot,
  Widget,
} from "@/types/template";
import { mockId } from "@/lib/testing/mockId";
import { generateKeyBetween } from "fractional-indexing";

export function getMockWidget(overrides?: Partial<Widget>): Widget {
  return {
    id: mockId("widget"),
    type: WidgetType.TEXT,
    label: "Widget",
    ...overrides,
  };
}

let lastMockOptionIndex: string | null = null;

/** `index` defaults to a valid `fractional-indexing` key, ordered by call. */
export function getMockOption(overrides?: Partial<OptionItem>): OptionItem {
  const index = generateKeyBetween(lastMockOptionIndex, null);
  lastMockOptionIndex = index;
  return {
    key: mockId("option"),
    value: "Option",
    index,
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
