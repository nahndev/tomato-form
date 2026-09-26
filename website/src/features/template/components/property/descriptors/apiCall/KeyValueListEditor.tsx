"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WidgetPicker } from "@/features/template/components/property/descriptors/apiCall/WidgetPicker";
import { ApiCallValueSource, type ApiCallKeyValue } from "@/types/api-call";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import { v4 } from "uuid";

interface KeyValueListEditorProps {
  label: string;
  widgetId: string;
  value: ApiCallKeyValue[];
  onChange: (rows: ApiCallKeyValue[]) => void;
}

/**
 * Shared row editor for `params` and `headers`: a key plus either a literal
 * value or another widget's value (ticket: "can fill or choice component
 * value"), with duplicate/delete actions.
 */
export function KeyValueListEditor({
  label,
  widgetId,
  value,
  onChange,
}: KeyValueListEditorProps) {
  function update(id: string, patch: Partial<ApiCallKeyValue>) {
    onChange(value.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }

  function remove(id: string) {
    onChange(value.filter((row) => row.id !== id));
  }

  function duplicate(id: string) {
    const row = value.find((r) => r.id === id);
    if (!row) return;
    onChange([...value, { ...row, id: v4() }]);
  }

  function add() {
    onChange([
      ...value,
      { id: v4(), key: "", source: ApiCallValueSource.STATIC, value: "" },
    ]);
  }

  function toggleSource(id: string) {
    const row = value.find((r) => r.id === id);
    if (!row) return;
    const source =
      row.source === ApiCallValueSource.STATIC
        ? ApiCallValueSource.WIDGET
        : ApiCallValueSource.STATIC;
    update(id, { source });
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      <div className="flex flex-col gap-1">
        {value.length === 0 && (
          <span className="text-xs text-muted-foreground">None yet</span>
        )}
        {value.map((row) => (
          <div key={row.id} className="flex items-center gap-1">
            <Input
              value={row.key}
              placeholder="Key"
              onChange={(e) => update(row.id, { key: e.target.value })}
            />
            <Button
              type="button"
              variant="ghost"
              className="size-8 shrink-0"
              onClick={() => toggleSource(row.id)}
              aria-label={
                row.source === ApiCallValueSource.STATIC
                  ? "Switch to component value"
                  : "Switch to static value"
              }
              title={
                row.source === ApiCallValueSource.STATIC
                  ? "Switch to component value"
                  : "Switch to static value"
              }
            >
              <TomatoIcon
                icon={
                  row.source === ApiCallValueSource.STATIC
                    ? TomatoIconKey.Code
                    : TomatoIconKey.Database
                }
                className="size-4"
              />
            </Button>
            {row.source === ApiCallValueSource.STATIC ? (
              <Input
                value={row.value ?? ""}
                placeholder="Value"
                onChange={(e) => update(row.id, { value: e.target.value })}
              />
            ) : (
              <WidgetPicker
                excludeWidgetId={widgetId}
                value={row.widgetId}
                onChange={(id) => update(row.id, { widgetId: id })}
              />
            )}
            <Button
              type="button"
              variant="ghost"
              className="size-8 shrink-0"
              onClick={() => duplicate(row.id)}
              aria-label="Duplicate"
            >
              <TomatoIcon icon={TomatoIconKey.Copy} className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="size-8 shrink-0"
              onClick={() => remove(row.id)}
              aria-label="Delete"
            >
              <TomatoIcon icon={TomatoIconKey.Trash} className="size-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <TomatoIcon icon={TomatoIconKey.Plus} className="mr-1.5 size-4" />
        Add {label.toLowerCase()}
      </Button>
    </div>
  );
}
