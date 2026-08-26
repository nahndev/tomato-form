"use client";

import { Label } from "@/components/ui/label";
import { useSubmissionActions } from "@/features/submission/hooks/actions/useSubmissionActions";
import { useSubmissionValues } from "@/features/submission/hooks/state/useSubmissionValues";
import { WidgetProvider } from "@/features/template/components/widget/WidgetProvider";
import { WidgetComponents } from "@/features/template/components/widget/registry";
import { WidgetItems } from "@/features/template/constants/widget/widgetItems";
import type { Widget } from "@/types/template";

interface SubmissionWidgetItemProps {
  widget: Widget;
}

export function SubmissionWidgetItem({ widget }: SubmissionWidgetItemProps) {
  return (
    <WidgetProvider widgetId={widget.id}>
      <SubmissionWidgetField widget={widget} />
    </WidgetProvider>
  );
}

function SubmissionWidgetField({ widget }: { widget: Widget }) {
  const values = useSubmissionValues();
  const { setValue } = useSubmissionActions();
  const def = WidgetItems[widget.type];
  const Field = WidgetComponents[widget.type];

  return (
    <div className="p-2 flex flex-col gap-1.5">
      {def.isDataField && (
        <Label htmlFor={widget.id}>
          {widget.label || "(no label)"}
          {widget.required ? " *" : ""}
        </Label>
      )}
      <Field
        widget={widget}
        value={values[widget.id]}
        onChange={(value) => setValue(widget.id, value)}
      />
    </div>
  );
}
