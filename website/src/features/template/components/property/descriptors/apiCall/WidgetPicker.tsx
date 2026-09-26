"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTemplateState } from "@/features/template/hooks/state/useTemplateState";
import { WidgetType } from "@/types/widget";

interface WidgetPickerProps {
  /** The widget being configured - excluded from the list so it can't reference itself. */
  excludeWidgetId: string;
  value: string | undefined;
  onChange: (widgetId: string) => void;
  placeholder?: string;
}

/**
 * Lists sibling widgets to fill/reference. Deliberately not filtered to
 * `isDataField` widgets only - `LABEL` must stay selectable as a
 * display-only target (see `docs/v1.1.0/add-widget-api-call.md`).
 */
export function WidgetPicker({
  excludeWidgetId,
  value,
  onChange,
  placeholder = "Choose a component…",
}: WidgetPickerProps) {
  const { widgets } = useTemplateState();
  const options = Object.values(widgets).filter(
    (widget) => widget.id !== excludeWidgetId && widget.type !== WidgetType.BREAK,
  );

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger size="sm">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.length === 0 && (
          <p className="px-2 py-1.5 text-xs text-muted-foreground">
            No other components yet
          </p>
        )}
        {options.map((widget) => (
          <SelectItem key={widget.id} value={widget.id}>
            {widget.label || "(no label)"}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
