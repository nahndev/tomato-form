import type { TemplateSnapshot } from "@/template/template.types";

interface MockSubmissionEventRow {
  data: Record<string, unknown>;
  dataClocks: Record<string, number>;
  template: { snapshot: Partial<TemplateSnapshot> };
}

interface MockSubmissionEventRowOverrides {
  data?: Record<string, unknown>;
  dataClocks?: Record<string, number>;
  snapshot?: Partial<TemplateSnapshot>;
}

export function getMockSubmissionEventRow(overrides?: MockSubmissionEventRowOverrides): MockSubmissionEventRow {
  return {
    data: overrides?.data ?? {},
    dataClocks: overrides?.dataClocks ?? {},
    template: { snapshot: overrides?.snapshot ?? { widgets: {} } },
  };
}
