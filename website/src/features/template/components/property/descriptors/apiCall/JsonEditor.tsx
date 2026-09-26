"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { useTemplateState } from "@/features/template/hooks/state/useTemplateState";
import { WidgetType } from "@/types/widget";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import { useRef, useState } from "react";
import { insertToken, stripTokensForValidation } from "./componentToken";

interface JsonEditorProps {
  widgetId: string;
  value: string | undefined;
  onChange: (value: string) => void;
}

/** Textarea-based JSON payload editor with `{{widget.label}}` token insertion. */
export function JsonEditor({ widgetId, value, onChange }: JsonEditorProps) {
  const text = value ?? "";
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cursorRef = useRef(text.length);
  const [error, setError] = useState<string | undefined>();
  const { widgets } = useTemplateState();
  const options = Object.values(widgets).filter(
    (widget) => widget.id !== widgetId && widget.type !== WidgetType.BREAK,
  );

  function handleInsert(label: string) {
    const { text: nextText, cursorPos } = insertToken(text, cursorRef.current, label);
    onChange(nextText);
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(cursorPos, cursorPos);
    });
  }

  function handleBlur() {
    if (!text.trim()) {
      setError(undefined);
      return;
    }
    try {
      JSON.parse(stripTokensForValidation(text));
      setError(undefined);
    } catch {
      setError("Not valid JSON");
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-start gap-1">
        <Textarea
          ref={textareaRef}
          value={text}
          placeholder={'{ "name": "{{Full name}}" }'}
          className="min-h-24 font-mono text-xs"
          onChange={(e) => onChange(e.target.value)}
          onSelect={(e) => {
            cursorRef.current = e.currentTarget.selectionStart ?? text.length;
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
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
