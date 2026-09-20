"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
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
import { formatItemKey, parseItemKey } from "@/features/board/utils/itemKey";
import { WidgetItems } from "@/features/template/constants/widget/widgetItems";
import type { BoardColumnItem } from "@/types/board";
import type { DisplayType } from "@/types/display-type";
import type { Template, Widget } from "@/types/template";
import { TomatoIcon } from "@tomato/icon";
import { useMemo } from "react";

/** Radix Select.Item forbids an empty-string value, so a sentinel stands in for "no widget picked". */
const UNSELECTED_WIDGET = "__unselected__";
/** Bucket key for widgets that aren't placed in any session. */
const UNGROUPED_SESSION = "__ungrouped__";

interface WidgetOption {
  itemKey: string;
  widget: Widget;
  valueType: ValueType;
}

interface OptionGroup {
  sessionId: string;
  sessionName: string | null;
  options: WidgetOption[];
}

export interface TemplateWidgetSelectProps {
  template: Template;
  allowDisplayTypes: DisplayType[] | null;
  value: BoardColumnItem | null;
  onChange: (item: BoardColumnItem | null) => void;
}

/**
 * Widget + value-type picker for one linked template, grouped by session: a widget with
 * only one value type (the common case) shows once, a widget with more than one (e.g.
 * `datetime`) shows once per value type it exposes that fits `allowDisplayTypes`, tagged
 * with a badge (e.g. "Date" / "Time") rather than folded into the label text.
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

  const groups = useMemo(() => {
    const bySession = new Map<string, OptionGroup>();

    widgets.forEach((widget) => {
      const valueTypes = getWidgetValueTypes(widget.type).filter(
        (valueType) =>
          allowDisplayTypes === null ||
          getValueTypeDisplayTypes(widget.type, valueType).some((type) =>
            allowDisplayTypes.includes(type),
          ),
      );
      if (valueTypes.length === 0) return;

      const sessionId = snapshot.widgetToSession[widget.id] ?? UNGROUPED_SESSION;
      const sessionName = snapshot.sessions[sessionId]?.name ?? null;

      const group = bySession.get(sessionId) ?? { sessionId, sessionName, options: [] };
      valueTypes.forEach((valueType) =>
        group.options.push({
          itemKey: formatItemKey(widget.id, valueType),
          widget,
          valueType,
        }),
      );
      bySession.set(sessionId, group);
    });

    return Array.from(bySession.values());
  }, [widgets, snapshot, allowDisplayTypes]);

  const hasOptions = groups.some((group) => group.options.length > 0);
  const showGroupLabels = groups.length > 1;

  const selectedKey = value
    ? formatItemKey(value.widgetId, value.property as ValueType)
    : UNSELECTED_WIDGET;

  return (
    <Select
      value={selectedKey}
      onValueChange={(selected) =>
        onChange(selected === UNSELECTED_WIDGET ? null : parseItemKey(selected))
      }
      disabled={!hasOptions}
    >
      <SelectTrigger aria-label={ariaLabel}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={UNSELECTED_WIDGET}>
          {hasOptions ? "Select widget" : "No matching widget"}
        </SelectItem>
        {groups.map((group, index) => (
          <SelectGroup key={group.sessionId}>
            {index > 0 && <SelectSeparator />}
            {showGroupLabels && (
              <SelectLabel>{group.sessionName ?? "Other"}</SelectLabel>
            )}
            {group.options.map((option) => (
              <SelectItem key={option.itemKey} value={option.itemKey}>
                <span className="flex min-w-0 items-center gap-2">
                  <TomatoIcon
                    icon={WidgetItems[option.widget.type].icon}
                    className="size-4 shrink-0 text-muted-foreground"
                  />
                  <span className="truncate" title={option.widget.label}>
                    {option.widget.label}
                  </span>
                  {option.valueType !== ValueType.DEFAULT && (
                    <span className="shrink-0 rounded bg-muted px-1 py-0.5 text-tiny font-medium uppercase text-muted-foreground">
                      {VALUE_TYPE_LABELS[option.valueType]}
                    </span>
                  )}
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TemplateWidgetSelect;
