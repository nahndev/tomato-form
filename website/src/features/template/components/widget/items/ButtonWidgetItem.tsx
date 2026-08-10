"use client";

import { Button } from "@/components/ui/button";
import type { FieldComponentProps } from "@/features/template/components/widget/types";
import { useMemo } from "react";

/** A clickable action button. Never collects a value. */
export function ButtonWidgetItem({ properties }: FieldComponentProps<unknown>) {
  const containerStyle = useMemo(
    () => properties.containerStyle ?? {},
    [properties],
  );
  const labelStyle = useMemo(() => properties.textStyle ?? {}, [properties]);
  console;

  function handleClick() {
    if (properties.url) {
      window.open(properties.url, "_blank", "noopener,noreferrer");
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
