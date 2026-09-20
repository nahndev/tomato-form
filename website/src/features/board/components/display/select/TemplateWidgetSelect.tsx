"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTemplateWidgetsByDisplayTypes } from "@/features/board/hooks/useTemplateWidgetsByDisplayTypes";
import { JsonColumn } from "@/features/board/utils/column";
import { getWidgetOptionLabel } from "@/features/board/utils/boardColumnWidgets";
import {
  VALUE_PROPERTY_LABELS,
  ValueProperty,
  getPropertyDisplayTypes,
  getWidgetValueProperties,
} from "@/features/template/constants/widget/valueProperties";
import type { DisplayType } from "@/types/display-type";
import type { Template } from "@/types/template";
import { useMemo } from "react";

/** Radix Select.Item forbids an empty-string value, so a sentinel stands in for "no widget picked". */
const UNSELECTED_WIDGET = "__unselected__";

export interface TemplateWidgetSelectProps {
  template: Template;
  allowDisplayTypes: DisplayType[] | null;
  /** The selected `widgetId:property` compound key, or null. */
  value: string | null;
  onChange: (itemKey: string | null) => void;
}

/**
 * Widget + value-property picker for one linked template, flattened into a single select:
 * a widget with only one property (the common case) shows once, a widget with more than
 * one (e.g. `datetime`) shows once per property it exposes that fits `allowDisplayTypes`
 * (e.g. "Meeting time" / "Meeting time as Date" / "Meeting time as Time").
 */
const TemplateWidgetSelect: React.FC<TemplateWidgetSelectProps> = ({
  template,
  allowDisplayTypes,
  value,
  onChange,
}) => {
  const ariaLabel = `Widget for ${template.name}`;
  const widgets = useTemplateWidgetsByDisplayTypes(template, allowDisplayTypes);
  const snapshot = template.snapshot;

  const options = useMemo(
    () =>
      widgets.flatMap((widget) => {
        const widgetLabel = getWidgetOptionLabel(snapshot, widget.id);

        return getWidgetValueProperties(widget.type)
          .filter(
            (property) =>
              allowDisplayTypes === null ||
              getPropertyDisplayTypes(widget.type, property).some((type) =>
                allowDisplayTypes.includes(type),
              ),
          )
          .map((property) => ({
            itemKey: JsonColumn.formatItemKey(widget.id, property),
            label:
              property === ValueProperty.DEFAULT
                ? widgetLabel
                : `${widgetLabel} as ${VALUE_PROPERTY_LABELS[property]}`,
          }));
      }),
    [widgets, snapshot, allowDisplayTypes],
  );

  return (
    <Select
      value={value ?? UNSELECTED_WIDGET}
      onValueChange={(selected) =>
        onChange(selected === UNSELECTED_WIDGET ? null : selected)
      }
      disabled={options.length === 0}
    >
      <SelectTrigger aria-label={ariaLabel}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={UNSELECTED_WIDGET}>
          {options.length === 0 ? "No matching widget" : "Select widget"}
        </SelectItem>
        {options.map((option) => (
          <SelectItem key={option.itemKey} value={option.itemKey}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TemplateWidgetSelect;
