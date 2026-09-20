"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTemplateWidgetsByDisplayTypes } from "@/features/board/hooks/useTemplateWidgetsByDisplayTypes";
import { getWidgetOptionLabel } from "@/features/board/utils/boardColumnWidgets";
import {
  VALUE_PROPERTY_LABELS,
  getWidgetValueProperties,
} from "@/features/template/constants/widget/valueProperties";
import type { ValueProperty } from "@/features/template/constants/widget/valueProperties";
import type { BoardColumnItem } from "@/types/board";
import type { DisplayType } from "@/types/display-type";
import type { Template } from "@/types/template";

/** Radix Select.Item forbids an empty-string value, so a sentinel stands in for "no widget picked". */
const UNSELECTED_WIDGET = "__unselected__";

export interface TemplateWidgetSelectProps {
  template: Template;
  allowDisplayTypes: DisplayType[] | null;
  value: BoardColumnItem | null;
  onChange: (item: BoardColumnItem | null) => void;
}

/** Widget (+ value-property, when the widget has more than one) picker for one linked template, restricted to widgets sharing a display type with the widgets already picked in sibling selects. */
const TemplateWidgetSelect: React.FC<TemplateWidgetSelectProps> = ({
  template,
  allowDisplayTypes,
  value,
  onChange,
}) => {
  const ariaLabel = `Widget for ${template.name}`;
  const options = useTemplateWidgetsByDisplayTypes(template, allowDisplayTypes);

  const snapshot = template.snapshot;
  const selectedWidget = value ? snapshot.widgets[value.widgetId] : undefined;
  const properties = selectedWidget ? getWidgetValueProperties(selectedWidget.type) : [];

  function pickWidget(widgetId: string | null) {
    if (widgetId === null) {
      onChange(null);
      return;
    }
    const widget = snapshot.widgets[widgetId];
    const [defaultProperty] = widget ? getWidgetValueProperties(widget.type) : [];
    onChange(defaultProperty ? { widgetId, property: defaultProperty } : null);
  }

  function pickProperty(property: ValueProperty) {
    if (!value) return;
    onChange({ widgetId: value.widgetId, property });
  }

  return (
    <>
      <Select
        value={value?.widgetId ?? UNSELECTED_WIDGET}
        onValueChange={(selected) =>
          pickWidget(selected === UNSELECTED_WIDGET ? null : selected)
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
          {options.map((widget) => (
            <SelectItem key={widget.id} value={widget.id}>
              {getWidgetOptionLabel(snapshot, widget.id)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {value && properties.length > 1 && (
        <Select value={value.property} onValueChange={pickProperty}>
          <SelectTrigger aria-label={`Value property for ${template.name}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {properties.map((property) => (
              <SelectItem key={property} value={property}>
                {VALUE_PROPERTY_LABELS[property]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </>
  );
};

export default TemplateWidgetSelect;
