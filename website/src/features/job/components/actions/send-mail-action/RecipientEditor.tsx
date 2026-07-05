"use client";

import { useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useUserStore } from "@/store/user.store";
import { Recipient, RecipientType } from "@/types/job";

export type RecipientFieldErrors = Partial<Record<keyof Recipient, string>>;

export type RecipientEditorErrors = string | (RecipientFieldErrors | undefined)[];

export type RecipientEditorProps = {
  idPrefix: string;
  recipients: Recipient[];
  onChange: (recipients: Recipient[]) => void;
  errors?: RecipientEditorErrors;
};

const RecipientEditor: React.FC<RecipientEditorProps> = ({
  idPrefix,
  recipients,
  onChange,
  errors,
}) => {
  const users = useUserStore((s) => s.users);
  const initUsers = useUserStore((s) => s.init);

  useEffect(() => {
    initUsers();
  }, [initUsers]);

  function updateRecipient(index: number, patch: Partial<Recipient>) {
    onChange(
      recipients.map((recipient, i) =>
        i === index ? { ...recipient, ...patch } : recipient,
      ),
    );
  }

  function addRecipient() {
    onChange([...recipients, { type: RecipientType.MAIL, value: "" }]);
  }

  function removeRecipient(index: number) {
    onChange(recipients.filter((_, i) => i !== index));
  }

  function fieldError(index: number, field: keyof Recipient) {
    if (!Array.isArray(errors)) return undefined;
    return errors[index]?.[field];
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Label>Recipients</Label>
        <Button type="button" variant="outline" size="sm" onClick={addRecipient}>
          <Plus className="mr-1 size-3.5" />
          Add Recipient
        </Button>
      </div>

      {typeof errors === "string" && (
        <p className="text-xs text-destructive">{errors}</p>
      )}

      {recipients.map((recipient, index) => (
        <div key={index} className="flex items-start gap-2">
          <div className="w-28 shrink-0">
            <Select
              id={`${idPrefix}-recipient-type-${index}`}
              aria-label="Recipient type"
              value={recipient.type}
              onChange={(e) =>
                updateRecipient(index, {
                  type: e.target.value as RecipientType,
                  value: "",
                })
              }
            >
              <option value={RecipientType.MAIL}>Mail</option>
              <option value={RecipientType.USER}>User</option>
            </Select>
          </div>

          <div className="flex-1">
            {recipient.type === RecipientType.USER ? (
              <Select
                id={`${idPrefix}-recipient-value-${index}`}
                aria-label="Recipient user"
                value={recipient.value}
                onChange={(e) => updateRecipient(index, { value: e.target.value })}
                error={fieldError(index, "value")}
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
                id={`${idPrefix}-recipient-value-${index}`}
                aria-label="Recipient email"
                type="email"
                value={recipient.value}
                onChange={(e) => updateRecipient(index, { value: e.target.value })}
                placeholder="e.g. jane@example.com"
                error={fieldError(index, "value")}
              />
            )}
          </div>

          <button
            type="button"
            onClick={() => removeRecipient(index)}
            disabled={recipients.length === 1}
            className="shrink-0 rounded p-1.5 text-muted-foreground hover:text-destructive disabled:opacity-40"
            aria-label="Remove recipient"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default RecipientEditor;
