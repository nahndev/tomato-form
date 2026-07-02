"use client";

import { Separator } from "@/components/ui/separator";
import { useWidgetSelection } from "@/features/template/components/provider/TemplateProvider";
import { WidgetPropertyContent } from "@/features/template/components/toolbar/property/WidgetPropertyContent";
import { WIDGET_REGISTRY } from "@/features/template/components/widget/registry";
import { useTemplateState } from "@/features/template/hooks/state/useTemplateState";

export type WidgetPropertyBoxProps = {};

/** Toolbar panel that inlines `WidgetPropertyContent` for the selected widget. */
export function WidgetPropertyBox({}: WidgetPropertyBoxProps) {
  const { selected } = useWidgetSelection();
  const { properties } = useTemplateState();

  if (!selected) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Select a widget to edit its properties.
      </p>
    );
  }

  const def = WIDGET_REGISTRY[selected.type];
  const widgetProperties = properties[selected.id] ?? def.defaultSettings;

  return (
    <div className="flex flex-col gap-4 p-3">
      <div>
        <p className="truncate text-sm font-medium">
          {widgetProperties.label || "(no label)"}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Type: <span className="font-medium text-foreground">{def.label}</span>
        </p>
      </div>

      <Separator />
      <WidgetPropertyContent widget={selected} />
    </div>
  );
}
