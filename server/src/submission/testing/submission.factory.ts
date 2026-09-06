import type { TemplateVersionSnapshot } from "@/template/template.types";

interface MockSubmissionEventRow {
  data: Record<string, unknown>;
  dataClocks: Record<string, number>;
  templateVersion: { snapshot: Partial<TemplateVersionSnapshot> };
}

interface MockSubmissionEventRowOverrides {
  data?: Record<string, unknown>;
  dataClocks?: Record<string, number>;
  snapshot?: Partial<TemplateVersionSnapshot>;
}

export function getMockSubmissionEventRow(overrides?: MockSubmissionEventRowOverrides): MockSubmissionEventRow {
  return {
    data: overrides?.data ?? {},
    dataClocks: overrides?.dataClocks ?? {},
    templateVersion: { snapshot: overrides?.snapshot ?? { widgets: {} } },
  };
}
