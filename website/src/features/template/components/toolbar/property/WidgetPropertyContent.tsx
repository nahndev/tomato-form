"use client";

import { WIDGET_PROPERTY_REGISTRY } from "@/features/template/components/property/registry";
import { useWidgetActions } from "@/features/template/sync/hooks/useWidgetActions";
import type { Widget } from "@/types/template";

interface WidgetPropertyContentProps {
  widget: Widget;
}

/** Inline property editor for the selected widget, backed directly by the yjs doc. */
export function WidgetPropertyContent({ widget }: WidgetPropertyContentProps) {
  const { setProperty } = useWidgetActions();
  const descriptors = WIDGET_PROPERTY_REGISTRY[widget.type];

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
          value={widget[descriptor.key]}
          onChange={(value) => setProperty(widget.id, descriptor.key, value)}
        />
      ))}
    </div>
  );
}
