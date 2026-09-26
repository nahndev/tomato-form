"use client";

import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { insertToken, stripTokensForValidation } from "./componentToken";
import { useTemplateState } from "@/features/template/hooks/state/useTemplateState";
import { WidgetType } from "@/types/widget";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import { useRef, useState } from "react";

interface UrlEditorProps {
  widgetId: string;
  value: string;
  onChange: (value: string) => void;
}

/**
 * Plain `Input` rather than a Lexical-based rich editor (no `RichEditor`
 * component exists in this codebase - see `docs/v1.1.0/add-widget-api-call.md`).
 * Supports inserting `{{widget.label}}` tokens via the trailing dropdown.
 */
export function UrlEditor({ widgetId, value, onChange }: UrlEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const cursorRef = useRef(value.length);
  const [warning, setWarning] = useState<string | undefined>();
  const { widgets } = useTemplateState();
  const options = Object.values(widgets).filter(
    (widget) => widget.id !== widgetId && widget.type !== WidgetType.BREAK,
  );

  function handleInsert(label: string) {
    const { text, cursorPos } = insertToken(value, cursorRef.current, label);
    onChange(text);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(cursorPos, cursorPos);
    });
  }

  function handleBlur() {
    const stripped = stripTokensForValidation(value);
    setWarning(/\{\{|\}\}/.test(stripped) ? "Check the {{…}} syntax" : undefined);
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        <Input
          ref={inputRef}
          value={value}
          placeholder="/path/{{widget}}"
          onChange={(e) => onChange(e.target.value)}
          onSelect={(e) => {
            cursorRef.current = e.currentTarget.selectionStart ?? value.length;
          }}
          onBlur={handleBlur}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex size-9 shrink-0 items-center justify-center rounded-md border border-input text-muted-foreground hover:bg-accent"
              aria-label="Insert component value"
            >
              <TomatoIcon icon={TomatoIconKey.Code} className="size-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {options.length === 0 && (
              <p className="px-2 py-1.5 text-xs text-muted-foreground">
                No other components yet
              </p>
            )}
            {options.map((widget) => (
              <DropdownMenuItem
                key={widget.id}
                onSelect={() => handleInsert(widget.label || widget.id)}
              >
                {widget.label || "(no label)"}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {warning && <p className="text-xs text-destructive">{warning}</p>}
    </div>
  );
}
