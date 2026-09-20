"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  VALUE_PROPERTY_LABELS,
  ValueProperty,
  getPropertyDisplayTypes,
  getWidgetValueProperties,
} from "@/features/board/constants/column/valueProperties";
import { useTemplateWidgetsByDisplayTypes } from "@/features/board/hooks/useTemplateWidgetsByDisplayTypes";
import { getWidgetOptionLabel } from "@/features/board/utils/boardColumnWidgets";
import { formatItemKey, parseItemKey } from "@/features/board/utils/itemKey";
import type { BoardColumnItem } from "@/types/board";
import type { DisplayType } from "@/types/display-type";
import type { Template } from "@/types/template";
import { useMemo } from "react";

/** Radix Select.Item forbids an empty-string value, so a sentinel stands in for "no widget picked". */
const UNSELECTED_WIDGET = "__unselected__";

export interface TemplateWidgetSelectProps {
  template: Template;
  allowDisplayTypes: DisplayType[] | null;
  value: BoardColumnItem | null;
  onChange: (item: BoardColumnItem | null) => void;
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
            itemKey: formatItemKey(widget.id, property),
            label:
              property === ValueProperty.DEFAULT
                ? widgetLabel
                : `${widgetLabel} as ${VALUE_PROPERTY_LABELS[property]}`,
          }));
      }),
    [widgets, snapshot, allowDisplayTypes],
  );

  const selectedKey = value ? formatItemKey(value.widgetId, value.property as ValueProperty) : UNSELECTED_WIDGET;

  return (
    <Select
      value={selectedKey}
      onValueChange={(selected) =>
        onChange(selected === UNSELECTED_WIDGET ? null : parseItemKey(selected))
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
