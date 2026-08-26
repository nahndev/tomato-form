"use client";

import { Separator } from "@/components/ui/separator";
import { useWidgetSelection } from "@/features/template/components/provider/TemplateProvider";
import { WidgetPropertyContent } from "@/features/template/components/toolbar/property/WidgetPropertyContent";
import { WidgetItems } from "@/features/template/constants/widget/widgetItems";

export type WidgetPropertyBoxProps = {};

/** Toolbar panel that inlines `WidgetPropertyContent` for the selected widget. */
export function WidgetPropertyBox({}: WidgetPropertyBoxProps) {
  const { selected } = useWidgetSelection();

  if (!selected) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Select a widget to edit its properties.
      </p>
    );
  }

  const def = WidgetItems[selected.type];

  return (
    <div className="flex flex-col gap-4 p-3">
      <div>
        <p className="truncate text-sm font-medium">
          {selected.label || "(no label)"}
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
