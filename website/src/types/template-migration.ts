import type { TemplateSnapshot } from "@/types/template";

export interface TemplateMigration {
  id: string;
  templateId: string;
  fromSnapshot: TemplateSnapshot;
  toSnapshot: TemplateSnapshot;
  /** Conflicts requiring user resolution. Detection isn't implemented yet - always empty today. */
  conflicts: unknown[];
  resolutions?: Record<string, unknown> | null;
  resolvedAt?: string | null;
  createdAt: string;
}

export interface ResolveTemplateMigrationInput {
  resolutions?: Record<string, unknown>;
}
