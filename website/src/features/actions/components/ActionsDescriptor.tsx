"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ACTION_REGISTRY, getActionDefinition } from "@/features/actions/registry";
import type { WidgetPropertyFieldProps } from "@/features/template/components/property/types";
import { ButtonActionType, type ButtonAction } from "@/types/button-action";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";

/** Ordered list of actions a `button` widget runs (in order) when clicked. */
export function ActionsDescriptor({
  value,
  onChange,
}: WidgetPropertyFieldProps<"actions">) {
  const actions = value ?? [];

  function update(index: number, next: ButtonAction) {
    onChange(actions.map((action, i) => (i === index ? next : action)));
  }

  function remove(index: number) {
    onChange(actions.filter((_, i) => i !== index));
  }

  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= actions.length) return;
    const next = [...actions];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function add() {
    onChange([...actions, ACTION_REGISTRY[ButtonActionType.LINK].createDefault()]);
  }

  function setType(index: number, type: ButtonActionType) {
    update(index, ACTION_REGISTRY[type].createDefault());
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label>Actions</Label>
      <div className="flex flex-col gap-2">
        {actions.map((action, index) => {
          const { SetupComponent } = getActionDefinition(action);
          return (
            <div
              key={index}
              className="flex flex-col gap-2 rounded-md border border-input p-2"
            >
              <div className="flex items-center gap-1">
                <Select
                  value={action.type}
                  onValueChange={(value) => setType(index, value as ButtonActionType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ACTION_REGISTRY).map(([type, definition]) => (
                      <SelectItem key={type} value={type}>
                        {definition.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="ghost"
                  className="size-8 shrink-0"
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                >
                  <TomatoIcon icon={TomatoIconKey.ChevronUp} className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="size-8 shrink-0"
                  disabled={index === actions.length - 1}
                  onClick={() => move(index, 1)}
                >
                  <TomatoIcon icon={TomatoIconKey.ChevronDown} className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="size-8 shrink-0"
                  onClick={() => remove(index)}
                >
                  <TomatoIcon icon={TomatoIconKey.Trash} className="size-4" />
                </Button>
              </div>
              <SetupComponent action={action} onChange={(next) => update(index, next)} />
            </div>
          );
        })}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <TomatoIcon icon={TomatoIconKey.Plus} className="mr-1.5 size-4" />
        Add action
      </Button>
    </div>
  );
}
