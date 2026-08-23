"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { WidgetPropertyFieldProps } from "@/features/template/components/property/types";
import { useTemplateState } from "@/features/template/hooks/state/useTemplateState";
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
  [ButtonActionType.SUBMIT]: "Submit (go to session)",
  [ButtonActionType.RETURN]: "Return (previous session)",
  [ButtonActionType.RESET]: "Reset session",
};

function defaultActionFor(type: ButtonActionType): ButtonAction {
  switch (type) {
    case ButtonActionType.LINK:
      return { type, url: "" };
    case ButtonActionType.MAIL:
      return { type, recipients: [], subject: "", body: "" };
    case ButtonActionType.SUBMIT:
      return { type };
    case ButtonActionType.RETURN:
      return { type };
    case ButtonActionType.RESET:
      return { type };
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
                onChange={(e) =>
                  update(
                    index,
                    defaultActionFor(e.target.value as ButtonActionType),
                  )
                }
              >
                {Object.values(ButtonActionType).map((type) => (
                  <option key={type} value={type}>
                    {ACTION_LABELS[type]}
                  </option>
                ))}
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
    case ButtonActionType.SUBMIT:
      return (
        <SessionPicker
          value={action.toSessionId}
          onChange={(toSessionId) => onChange({ ...action, toSessionId })}
        />
      );
    case ButtonActionType.RETURN:
    case ButtonActionType.RESET:
      return null;
  }
}

function SessionPicker({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (sessionId: string | undefined) => void;
}) {
  const { sessions, sessionProperties } = useTemplateState();

  return (
    <Select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value || undefined)}
    >
      <option value="">(next session)</option>
      {Object.values(sessions).map((session) => (
        <option key={session.id} value={session.id}>
          {sessionProperties[session.id]?.name}
        </option>
      ))}
    </Select>
  );
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
            onChange={(e) =>
              update(index, {
                type: e.target.value as RecipientType,
                value: "",
              })
            }
          >
            <option value={RecipientType.MAIL}>Email</option>
            <option value={RecipientType.USER}>User</option>
          </Select>
          {recipient.type === RecipientType.USER ? (
            <Select
              value={recipient.value}
              onChange={(e) => update(index, { ...recipient, value: e.target.value })}
            >
              <option value="">Select a user…</option>
              {users.map((user) => (
                <option key={user.uuid} value={user.uuid}>
                  {user.name}
                </option>
              ))}
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
