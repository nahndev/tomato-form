"use client";

import { Badge } from "@/components/ui/badge";
import { useWidgetSelection } from "@/features/template/components/provider/TemplateProvider";
import { WidgetProvider } from "@/features/template/components/provider/WidgetProvider";
import { WIDGET_REGISTRY } from "@/features/template/components/widget/registry";
import { useWidgetState } from "@/features/template/hooks/state/useWidgetState";
import type { Widget } from "@/types/template";
import clsx from "clsx";

interface WidgetItemProps {
  widget: Widget;
}

export function WidgetItem({ widget }: WidgetItemProps) {
  const { isSelected, select } = useWidgetSelection();
  return (
    <WidgetProvider widgetId={widget.id}>
      <div className="p-1">
        <div
          className={clsx(
            "border border-dashed rounded-md",
            isSelected(widget) ? "border-orange-500" : "border-transparent",
          )}
          onClick={() => select(widget)}
        >
          <div className="min-w-0 flex-1 bg-white rounded-md p-4">
            <WidgetItemHeader widget={widget} />
            <WidgetPreview widget={widget} />
          </div>
        </div>
      </div>
    </WidgetProvider>
  );
}

function WidgetItemHeader({ widget }: { widget: Widget }) {
  const { properties } = useWidgetState();
  return (
    <div className="flex items-center gap-2">
      <p className="truncate text-sm font-medium">
        {properties?.label || "(no label)"}
      </p>
      <Badge variant="secondary" className="shrink-0 text-[10px]">
        {widget.type}
      </Badge>
      {properties?.required && (
        <span className="text-xs text-destructive">*</span>
      )}
    </div>
  );
}

function WidgetPreview({ widget }: { widget: Widget }) {
  const { properties } = useWidgetState();
  const def = WIDGET_REGISTRY[widget.type];
  const Field = def.Field;
  return (
    <Field
      widgetId={widget.id}
      properties={properties ?? def.defaultSettings}
      mode="preview"
    />
  );
}
