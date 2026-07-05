"use client";

import { Badge } from "@/components/ui/badge";
import {
  useTemplateMode,
  useWidgetSelection,
} from "@/features/template/components/provider/TemplateProvider";
import { WidgetProvider } from "@/features/template/components/provider/WidgetProvider";
import { WIDGET_REGISTRY } from "@/features/template/components/widget/registry";
import { useWidgetState } from "@/features/template/hooks/state/useWidgetState";
import { TemplateMode, type Widget } from "@/types/template";
import clsx from "clsx";

interface WidgetItemProps {
  widget: Widget;
}

export function WidgetItem({ widget }: WidgetItemProps) {
  const mode = useTemplateMode();
  const { isSelected, select } = useWidgetSelection();
  const isShowSelectedBorder = mode === TemplateMode.EDIT && isSelected(widget);
  return (
    <WidgetProvider widgetId={widget.id}>
      <div className="p-1">
        <div
          className={clsx(
            "border border-dashed rounded-md",
            isShowSelectedBorder ? "border-orange-500" : "border-transparent",
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
  const mode = useTemplateMode();
  const { properties } = useWidgetState();

  return (
    <div
      className={clsx(
        "flex items-center gap-2",
        properties?.compact && "hidden",
      )}
    >
      <p className="truncate text-sm font-medium">
        {properties?.label || "(no label)"}
      </p>
      <Badge
        variant="secondary"
        className={clsx(
          "shrink-0 text-[10px]",
          mode === TemplateMode.VIEW && "hidden",
        )}
      >
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
