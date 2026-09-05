"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { WidgetPropertyFieldProps } from "@/features/template/components/property/types";
import { useUserStore } from "@/store/user.store";
import {
  ButtonActionType,
  RecipientType,
  type ButtonAction,
  type Recipient,
} from "@/types/button-action";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import { useEffect } from "react";

const ACTION_LABELS: Record<ButtonActionType, string> = {
  [ButtonActionType.LINK]: "Open link",
  [ButtonActionType.MAIL]: "Send mail",
};

function defaultActionFor(type: ButtonActionType): ButtonAction {
  switch (type) {
    case ButtonActionType.LINK:
      return { type, url: "" };
    case ButtonActionType.MAIL:
      return { type, recipients: [], subject: "", body: "" };
  }
}

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
    onChange([...actions, defaultActionFor(ButtonActionType.LINK)]);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label>Actions</Label>
      <div className="flex flex-col gap-2">
        {actions.map((action, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 rounded-md border border-input p-2"
          >
            <div className="flex items-center gap-1">
              <Select
                value={action.type}
                onValueChange={(value) =>
                  update(index, defaultActionFor(value as ButtonActionType))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ButtonActionType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {ACTION_LABELS[type]}
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
            <ActionFields action={action} onChange={(next) => update(index, next)} />
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <TomatoIcon icon={TomatoIconKey.Plus} className="mr-1.5 size-4" />
        Add action
      </Button>
    </div>
  );
}

function ActionFields({
  action,
  onChange,
}: {
  action: ButtonAction;
  onChange: (next: ButtonAction) => void;
}) {
  switch (action.type) {
    case ButtonActionType.LINK:
      return (
        <Input
          value={action.url}
          onChange={(e) => onChange({ ...action, url: e.target.value })}
          placeholder="https://…"
        />
      );
    case ButtonActionType.MAIL:
      return (
        <div className="flex flex-col gap-2">
          <RecipientsEditor
            recipients={action.recipients}
            onChange={(recipients) => onChange({ ...action, recipients })}
          />
          <Input
            value={action.subject}
            onChange={(e) => onChange({ ...action, subject: e.target.value })}
            placeholder="Subject"
          />
          <textarea
            value={action.body}
            onChange={(e) => onChange({ ...action, body: e.target.value })}
            rows={3}
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            placeholder="Mail content…"
          />
        </div>
      );
  }
}

function RecipientsEditor({
  recipients,
  onChange,
}: {
  recipients: Recipient[];
  onChange: (recipients: Recipient[]) => void;
}) {
  const { users, init } = useUserStore();

  useEffect(() => {
    init();
  }, [init]);

  function update(index: number, next: Recipient) {
    onChange(recipients.map((r, i) => (i === index ? next : r)));
  }

  function remove(index: number) {
    onChange(recipients.filter((_, i) => i !== index));
  }

  function add() {
    onChange([...recipients, { type: RecipientType.MAIL, value: "" }]);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label>Recipients</Label>
      {recipients.map((recipient, index) => (
        <div key={index} className="flex items-center gap-1">
          <Select
            value={recipient.type}
            onValueChange={(value) =>
              update(index, {
                type: value as RecipientType,
                value: "",
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={RecipientType.MAIL}>Email</SelectItem>
              <SelectItem value={RecipientType.USER}>User</SelectItem>
            </SelectContent>
          </Select>
          {recipient.type === RecipientType.USER ? (
            <Select
              value={recipient.value}
              onValueChange={(value) =>
                update(index, { ...recipient, value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a user…" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.uuid} value={user.uuid}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              value={recipient.value}
              onChange={(e) => update(index, { ...recipient, value: e.target.value })}
              placeholder="jane@example.com"
            />
          )}
          <Button
            type="button"
            variant="ghost"
            className="size-8 shrink-0"
            onClick={() => remove(index)}
          >
            <TomatoIcon icon={TomatoIconKey.Trash} className="size-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <TomatoIcon icon={TomatoIconKey.Plus} className="mr-1.5 size-4" />
        Add recipient
      </Button>
    </div>
  );
}
