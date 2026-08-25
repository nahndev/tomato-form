"use client";

import { Button } from "@/components/ui/button";
import { useRunButtonAction } from "@/features/template/components/widget/ButtonActionContext";
import { ButtonActionType } from "@/types/button-action";
import type { FieldComponentProps } from "@/types/widget";
import { useMemo } from "react";

/**
 * A clickable action button. Doesn't collect a value itself, but records a
 * truthy value on click (via `onChange`) so a session's `BUTTON_CLICKED`
 * condition can read it back off `submission.data` (see `sessionCondition.ts`).
 */
export function ButtonWidgetItem({
  widget,
  onChange,
}: FieldComponentProps<unknown>) {
  const containerStyle = useMemo(
    () => widget.containerStyle ?? {},
    [widget.containerStyle],
  );
  const labelStyle = useMemo(() => widget.textStyle ?? {}, [widget.textStyle]);
  const runAction = useRunButtonAction();

  // Legacy templates only ever had a single `url` field - treat that as an
  // implicit single LINK action when no `actions` list has been configured.
  const actions =
    widget.actions ??
    (widget.url
      ? [{ type: ButtonActionType.LINK as const, url: widget.url }]
      : []);

  async function handleClick() {
    onChange?.(true);
    for (const action of actions) {
      await runAction(action);
    }
  }

  return (
    <Button
      type="button"
      onClick={handleClick}
      className="w-full p-4"
      style={containerStyle}
    >
      <span style={labelStyle}>{widget.label || "Click me"}</span>
    </Button>
  );
}
