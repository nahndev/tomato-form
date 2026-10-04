"use client";

import { Button } from "@/components/ui/button";
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
} from "@/features/board/constants/column/valueTypes";
import { useTemplateWidgetsByDisplayTypes } from "@/features/board/hooks/useTemplateWidgetsByDisplayTypes";
import { parseItemKey, formatItemKey } from "@/features/board/utils/itemKey";
import {
  groupWidgetOptions,
  type WidgetOption,
  type WidgetOptionEntry,
} from "@/features/board/utils/widgetOptionGroups";
import { WidgetItems } from "@/features/template/constants/widget/widgetItems";
import { cn } from "@/lib/utils";
import type { BoardColumnItem } from "@/types/board";
import type { DisplayType } from "@/types/display-type";
import type { Template } from "@/types/template";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import { useMemo, useState } from "react";

/** Radix Select.Item forbids an empty-string value, so a sentinel stands in for "no widget picked". */
const UNSELECTED_WIDGET = "__unselected__";

export interface TemplateWidgetSelectProps {
  template: Template;
  allowDisplayTypes: DisplayType[] | null;
  value: BoardColumnItem | null;
  onChange: (item: BoardColumnItem | null) => void;
}

const OptionLabel: React.FC<{ option: WidgetOption }> = ({ option }) => (
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
);

interface WidgetEntryRowsProps {
  entry: WidgetOptionEntry;
  expanded: boolean;
  onToggle: () => void;
}

/** A widget row (selects its first value type) with, when it has more, a chevron folding the other value types under it. */
const WidgetEntryRows: React.FC<WidgetEntryRowsProps> = ({
  entry,
  expanded,
  onToggle,
}) => {
  const { primary, variants } = entry;
  const expandable = variants.length > 0;

  return (
    <>
      <div className="flex items-center">
        {expandable ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            tabIndex={-1}
            aria-expanded={expanded}
            aria-label={`${expanded ? "Collapse" : "Expand"} ${primary.widget.label}`}
            onClick={onToggle}
          >
            <TomatoIcon
              icon={TomatoIconKey.ChevronRight}
              className={cn("transition-transform", expanded && "rotate-90")}
            />
          </Button>
        ) : (
          <span className="size-6 shrink-0" aria-hidden />
        )}
        <SelectItem
          value={primary.itemKey}
          className="min-w-0 flex-1"
          onKeyDown={(event) => {
            if (!expandable) return;
            if (event.key === "ArrowRight" && !expanded) onToggle();
            if (event.key === "ArrowLeft" && expanded) onToggle();
          }}
        >
          <OptionLabel option={primary} />
        </SelectItem>
      </div>
      {expanded &&
        variants.map((variant) => (
          <SelectItem
            key={variant.itemKey}
            value={variant.itemKey}
            className="ml-8 w-auto"
          >
            <span className="truncate">{VALUE_TYPE_LABELS[variant.valueType]}</span>
          </SelectItem>
        ))}
    </>
  );
};

/**
 * Widget + value-type picker for one linked template, grouped by session. Every widget
 * is one row; a widget with more than one value type (e.g. `datetime`) gets a chevron
 * that expands its other value types (e.g. "Date" / "Time") beneath it. Groups start
 * collapsed, except the one holding the current value.
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
  /** User toggles by widget id; an untouched widget is expanded only while it holds the current value. */
  const [toggled, setToggled] = useState<Record<string, boolean>>({});

  const groups = useMemo(
    () => groupWidgetOptions(widgets, snapshot, allowDisplayTypes),
    [widgets, snapshot, allowDisplayTypes],
  );

  const hasOptions = groups.length > 0;
  const showGroupLabels = groups.length > 1;

  const selectedKey = value
    ? formatItemKey(value.widgetId, value.property as ValueType)
    : UNSELECTED_WIDGET;
  const selectedOption = useMemo(
    () =>
      groups
        .flatMap((group) => group.entries)
        .flatMap((entry) => [entry.primary, ...entry.variants])
        .find((option) => option.itemKey === selectedKey),
    [groups, selectedKey],
  );

  const isExpanded = (entry: WidgetOptionEntry) =>
    toggled[entry.primary.widget.id] ??
    value?.widgetId === entry.primary.widget.id;

  const toggleEntry = (entry: WidgetOptionEntry) =>
    setToggled((current) => ({
      ...current,
      [entry.primary.widget.id]: !isExpanded(entry),
    }));

  return (
    <Select
      value={selectedKey}
      onValueChange={(selected) =>
        onChange(selected === UNSELECTED_WIDGET ? null : parseItemKey(selected))
      }
      disabled={!hasOptions}
    >
      <SelectTrigger aria-label={ariaLabel}>
        {/* Explicit content: a collapsed group unmounts its items, so Radix could not mirror the selected one. */}
        <SelectValue>
          {selectedOption ? (
            <OptionLabel option={selectedOption} />
          ) : (
            !value && (hasOptions ? "Select widget" : "No matching widget")
          )}
        </SelectValue>
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
            {group.entries.map((entry) => (
              <WidgetEntryRows
                key={entry.primary.widget.id}
                entry={entry}
                expanded={isExpanded(entry)}
                onToggle={() => toggleEntry(entry)}
              />
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TemplateWidgetSelect;
