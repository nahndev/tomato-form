"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { WidgetPropertyFieldProps } from "@/features/template/components/property/types";
import { cn } from "@/lib/utils";
import type { OptionItem } from "@/types/template";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { isSortable, useSortable } from "@dnd-kit/react/sortable";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import { generateKeyBetween } from "fractional-indexing";
import { useMemo } from "react";
import { v4 } from "uuid";

function sortByIndex(options: OptionItem[]): OptionItem[] {
  return [...options].sort((a, b) => (a.index < b.index ? -1 : 1));
}

/** Options editor (drag-and-drop list) shared by select, checkbox, and radio. */
export function OptionsDescriptor({
  value,
  onChange,
}: WidgetPropertyFieldProps<"options">) {
  const options = useMemo(() => sortByIndex(value ?? []), [value]);

  function update(key: string, text: string) {
    onChange(
      options.map((option) =>
        option.key === key ? { ...option, value: text } : option,
      ),
    );
  }

  function remove(key: string) {
    onChange(options.filter((option) => option.key !== key));
  }

  function add() {
    const index = generateKeyBetween(options.at(-1)?.index ?? null, null);
    onChange([...options, { key: v4(), value: "", index }]);
  }

  function move(sourceKey: string, targetIndex: number) {
    const sourcePos = options.findIndex((option) => option.key === sourceKey);
    if (sourcePos === -1 || sourcePos === targetIndex) return;

    const reordered = [...options];
    const [moved] = reordered.splice(sourcePos, 1);
    reordered.splice(targetIndex, 0, moved);

    const before = reordered[targetIndex - 1]?.index ?? null;
    const after = reordered[targetIndex + 1]?.index ?? null;
    const nextIndex = generateKeyBetween(before, after);

    onChange(
      options.map((option) =>
        option.key === sourceKey ? { ...option, index: nextIndex } : option,
      ),
    );
  }

  function handleDragEnd(event: DragEndEvent) {
    const { source, target } = event.operation;
    const sourceKey = source?.id;
    if (typeof sourceKey !== "string" || !target || !isSortable(target)) {
      return;
    }
    move(sourceKey, target.index);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label>Options</Label>
      <DragDropProvider onDragEnd={handleDragEnd}>
        <div className="flex flex-col gap-1">
          {options.length === 0 && (
            <span className="text-xs text-muted-foreground">
              No options yet
            </span>
          )}
          {options.map((option, index) => (
            <OptionRow
              key={option.key}
              option={option}
              index={index}
              onChangeText={(text) => update(option.key, text)}
              onRemove={() => remove(option.key)}
            />
          ))}
        </div>
      </DragDropProvider>
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <TomatoIcon icon={TomatoIconKey.Plus} className="mr-1.5 size-4" />
        Add option
      </Button>
    </div>
  );
}

function OptionRow({
  option,
  index,
  onChangeText,
  onRemove,
}: {
  option: OptionItem;
  index: number;
  onChangeText: (text: string) => void;
  onRemove: () => void;
}) {
  const { ref, handleRef, isDragging } = useSortable({
    id: option.key,
    index,
  });

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-1 rounded-md border border-input bg-background p-1",
        isDragging && "opacity-50",
      )}
    >
      <button
        ref={handleRef}
        type="button"
        className="flex size-8 shrink-0 cursor-grab items-center justify-center text-muted-foreground active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <TomatoIcon icon={TomatoIconKey.Move} className="size-4" />
      </button>
      <Input
        value={option.value}
        onChange={(e) => onChangeText(e.target.value)}
        placeholder={`Option ${index + 1}`}
      />
      <Button
        type="button"
        variant="ghost"
        className="size-8 shrink-0"
        onClick={onRemove}
        aria-label="Remove option"
      >
        <TomatoIcon icon={TomatoIconKey.Trash} className="size-4" />
      </Button>
    </div>
  );
}
