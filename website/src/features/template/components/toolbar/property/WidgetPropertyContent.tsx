"use client";

import { PROPERTY_DESCRIPTOR_REGISTRY } from "@/features/template/components/property/descriptors/registry";
import { WIDGET_PROPERTY_REGISTRY } from "@/features/template/components/property/registry";
import { useWidgetActions } from "@/features/template/sync/hooks/useWidgetActions";
import type { Widget } from "@/types/template";

interface WidgetPropertyContentProps {
  widget: Widget;
}

/** Inline property editor for the selected widget, backed directly by the yjs doc. */
export function WidgetPropertyContent({ widget }: WidgetPropertyContentProps) {
  const { setProperty } = useWidgetActions();
  const keys = WIDGET_PROPERTY_REGISTRY[widget.type];

  if (keys.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        This widget has no configurable properties.
      </p>
    );
  }

  return (
    <div key={widget.id} className="flex flex-col gap-4">
      {keys.map((key) => {
        const descriptor = PROPERTY_DESCRIPTOR_REGISTRY[key];
        if (!descriptor) return null;

        const { Component } = descriptor;
        return (
          <Component
            key={key}
            widgetType={widget.type}
            value={widget[key]}
            onChange={(value) => setProperty(widget.id, key, value)}
          />
        );
      })}
    </div>
  );
}
