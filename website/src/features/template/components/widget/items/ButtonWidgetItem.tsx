"use client";

import { Button } from "@/components/ui/button";
import { useRunButtonAction } from "@/features/template/components/widget/ButtonActionContext";
import { ButtonActionType } from "@/types/button-action";
import type { FieldComponentProps } from "@/types/widget";
import { useMemo } from "react";

/** A clickable action button. Never collects a value. */
export function ButtonWidgetItem({ properties }: FieldComponentProps<unknown>) {
  const containerStyle = useMemo(
    () => properties.containerStyle ?? {},
    [properties],
  );
  const labelStyle = useMemo(() => properties.textStyle ?? {}, [properties]);
  const runAction = useRunButtonAction();

  // Legacy templates only ever had a single `url` field - treat that as an
  // implicit single LINK action when no `actions` list has been configured.
  const actions =
    properties.actions ??
    (properties.url
      ? [{ type: ButtonActionType.LINK as const, url: properties.url }]
      : []);

  async function handleClick() {
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
      <span style={labelStyle}>{properties.label || "Click me"}</span>
    </Button>
  );
}
