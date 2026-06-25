"use client";

import { Badge } from "@/components/ui/badge";
import {
  useWidgetContext,
  WidgetProvider,
} from "@/features/template/components/provider/WidgetProvider";
import { WIDGET_REGISTRY } from "@/features/template/components/widget/registry";
import type { Widget } from "@/types/template";

interface WidgetItemProps {
  widget: Widget;
}

export function WidgetItem({ widget }: WidgetItemProps) {
  return (
    <WidgetProvider widget={widget}>
      <div className="p-1">
        <div className="min-w-0 flex-1 bg-white rounded-md p-4">
          <WidgetItemHeader widget={widget} />
          <WidgetPreview widget={widget} />
        </div>
      </div>
    </WidgetProvider>
  );
}

function WidgetItemHeader({ widget }: { widget: Widget }) {
  const { properties } = useWidgetContext();
  return (
    <div className="flex items-center gap-2">
      <p className="truncate text-sm font-medium">
        {properties.label || "(no label)"}
      </p>
      <Badge variant="secondary" className="shrink-0 text-[10px]">
        {widget.type}
      </Badge>
      {properties.required && (
        <span className="text-xs text-destructive">*</span>
      )}
    </div>
  );
}

function WidgetPreview({ widget }: { widget: Widget }) {
  const { properties } = useWidgetContext();
  const def = WIDGET_REGISTRY[widget.type];
  const Field = def.Field;
  return <Field widgetId={widget.id} properties={properties} mode="preview" />;
}
