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
import { findLatestVersion } from "@/features/template/utils/findLatestVersion";
import type { DisplayType } from "@/types/display-type";
import type { Template } from "@/types/template";

/** Radix Select.Item forbids an empty-string value, so a sentinel stands in for "no widget picked". */
const UNSELECTED_WIDGET = "__unselected__";

export interface TemplateWidgetSelectProps {
  template: Template;
  allowDisplayTypes: DisplayType[] | null;
  value: string | null;
  onChange: (widgetId: string | null) => void;
}

/** Widget picker for one template, restricted to widgets sharing a display type with the widgets already picked in sibling selects. */
const TemplateWidgetSelect: React.FC<TemplateWidgetSelectProps> = ({
  template,
  allowDisplayTypes,
  value,
  onChange,
}) => {
  const ariaLabel = `Widget for ${template.name}`;
  const latestVersion = findLatestVersion(template.templateVersions ?? []);
  const options = useTemplateWidgetsByDisplayTypes(template, allowDisplayTypes);

  if (!latestVersion) {
    return (
      <Select disabled>
        <SelectTrigger aria-label={ariaLabel}>
          <SelectValue placeholder="No published version" />
        </SelectTrigger>
        <SelectContent />
      </Select>
    );
  }

  const snapshot = latestVersion.snapshot;

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
        {options.map((widget) => (
          <SelectItem key={widget.id} value={widget.id}>
            {getWidgetOptionLabel(snapshot, widget.id)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TemplateWidgetSelect;
