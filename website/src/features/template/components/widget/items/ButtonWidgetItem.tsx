"use client";

import { Button } from "@/components/ui/button";
import type { FieldComponentProps } from "@/features/template/components/widget/types";

/** A clickable action button. Never collects a value. */
export function ButtonWidgetItem({
  properties,
  mode,
}: FieldComponentProps<unknown>) {
  const containerStyle = properties.containerStyle ?? {};

  function handleClick() {
    if (properties.url) {
      window.open(properties.url, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <Button
      type="button"
      disabled={mode === "preview"}
      onClick={handleClick}
      className="w-full p-4"
      style={containerStyle}
    >
      {properties.label || "Click me"}
    </Button>
  );
}
