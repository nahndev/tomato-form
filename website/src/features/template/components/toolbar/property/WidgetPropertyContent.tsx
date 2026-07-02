"use client";

import { WIDGET_PROPERTY_REGISTRY } from "@/features/template/components/toolbar/property/registry";
import { WIDGET_REGISTRY } from "@/features/template/components/widget/registry";
import { useWidgetActions } from "@/features/template/hooks/actions/useWidgetActions";
import { useTemplateState } from "@/features/template/hooks/state/useTemplateState";
import type { Widget } from "@/types/template";

interface WidgetPropertyContentProps {
  widget: Widget;
}

/** Inline property editor for the selected widget, backed directly by the yjs doc. */
export function WidgetPropertyContent({ widget }: WidgetPropertyContentProps) {
  const { properties } = useTemplateState();
  const { setProperty } = useWidgetActions();
  const def = WIDGET_REGISTRY[widget.type];
  const descriptors = WIDGET_PROPERTY_REGISTRY[widget.type];
  const widgetProperties = properties[widget.id] ?? def.defaultSettings;

  if (descriptors.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        This widget has no configurable properties.
      </p>
    );
  }

  return (
    <div key={widget.id} className="flex flex-col gap-4">
      {descriptors.map((descriptor) => (
        <descriptor.Component
          key={descriptor.key}
          widgetType={widget.type}
          value={widgetProperties}
          onChange={(value) => setProperty(widget.id, descriptor.key, value)}
        />
      ))}
    </div>
  );
}
