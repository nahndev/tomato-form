"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  VALUE_TYPE_LABELS,
  ValueType,
  getValueTypeDisplayTypes,
  getWidgetValueTypes,
} from "@/features/board/constants/column/valueTypes";
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
 * Widget + value-type picker for one linked template, flattened into a single select:
 * a widget with only one value type (the common case) shows once, a widget with more than
 * one (e.g. `datetime`) shows once per value type it exposes that fits `allowDisplayTypes`
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

        return getWidgetValueTypes(widget.type)
          .filter(
            (valueType) =>
              allowDisplayTypes === null ||
              getValueTypeDisplayTypes(widget.type, valueType).some((type) =>
                allowDisplayTypes.includes(type),
              ),
          )
          .map((valueType) => ({
            itemKey: formatItemKey(widget.id, valueType),
            label:
              valueType === ValueType.DEFAULT
                ? widgetLabel
                : `${widgetLabel} as ${VALUE_TYPE_LABELS[valueType]}`,
          }));
      }),
    [widgets, snapshot, allowDisplayTypes],
  );

  const selectedKey = value
    ? formatItemKey(value.widgetId, value.property as ValueType)
    : UNSELECTED_WIDGET;

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
