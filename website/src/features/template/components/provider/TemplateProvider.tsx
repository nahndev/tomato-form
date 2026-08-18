"use client";

import { TemplateDocProvider } from "@/features/template/components/provider/TemplateDocProvider";
import { TemplateLiveStateProvider } from "@/features/template/components/provider/TemplateLiveStateProvider";
import {
  TemplateMetaContext,
  useTemplateMeta,
} from "@/features/template/hooks/state/useTemplateMeta";
import { useTemplateState } from "@/features/template/hooks/state/useTemplateState";
import { useSelection } from "@/features/template/hooks/useSelection";
import { useCurrentVersion } from "@/features/template/hooks/useTemplateVersion";
import type { Template, TemplateVersion, Widget } from "@/types/template";
import { createContext, useContext } from "react";
import { values } from "remeda";

export interface TemplateProviderProps {
  template: Template;
  children: React.ReactNode;
}

/**
 * Public composition root for the template feature: wires up the yjs doc
 * connection, the (non-yjs) id/version meta context, and widget selection.
 * Builder-only concerns (mode) live in `TemplateBuilderProvider`.
 */
export const TemplateProvider: React.FC<TemplateProviderProps> = ({
  template,
  children,
}) => {
  const version = useCurrentVersion(template);
  return (
    <TemplateDocProvider uuid={template.id} version={version}>
      <TemplateLiveStateProvider>
        <TemplateMetaContext.Provider value={{ id: template.id, version, template }}>
          <WidgetSelectionProvider>{children}</WidgetSelectionProvider>
        </TemplateMetaContext.Provider>
      </TemplateLiveStateProvider>
    </TemplateDocProvider>
  );
};

type WidgetSelection = ReturnType<typeof useSelection<Widget, "id">>;
const WidgetSelectionContext = createContext<WidgetSelection | null>(null);

const WidgetSelectionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { widgets } = useTemplateState();
  const selection = useSelection(values(widgets), "id");

  return (
    <WidgetSelectionContext.Provider value={selection}>
      {children}
    </WidgetSelectionContext.Provider>
  );
};

export function useTemplateId(): string {
  return useTemplateMeta().id;
}

export function useTemplateVersion(): string | undefined {
  return useTemplateMeta().version;
}

export function useTemplateVersions(): TemplateVersion[] {
  return useTemplateMeta().template.templateVersions ?? [];
}

export function useWidgetSelection(): WidgetSelection {
  const ctx = useContext(WidgetSelectionContext);
  if (!ctx) {
    throw new Error("useWidgetSelection must be used inside TemplateProvider");
  }
  return ctx;
}
