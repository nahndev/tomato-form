"use client";

import { Button } from "@/components/ui/button";
import type { FieldComponentProps } from "@/features/template/components/widget/types";

/** A clickable action button. Never collects a value. */
export function Field({ properties, mode }: FieldComponentProps<unknown>) {
  function handleClick() {
    if (properties.url) {
      window.open(properties.url, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      disabled={mode === "preview"}
      onClick={handleClick}
      className="mt-2"
    >
      {properties.label || "Click me"}
    </Button>
  );
}
