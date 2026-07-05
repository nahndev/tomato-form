"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { WidgetPropertyFieldProps } from "@/features/template/components/toolbar/property/types";
import { useToggleProperty } from "@/hooks/useConditionValue";
import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react";
import { CSSProperties } from "react";

export function useBold(
  value: CSSProperties | undefined,
  onChange: (value: CSSProperties) => void,
) {
  return useToggleProperty(
    value?.fontWeight,
    (fontWeight) => onChange({ ...value, fontWeight }),
    "bold",
    "normal",
  );
}

export function useItalic(
  value: CSSProperties | undefined,
  onChange: (value: CSSProperties) => void,
) {
  return useToggleProperty(
    value?.fontStyle,
    (fontStyle) => onChange({ ...value, fontStyle }),
    "italic",
    "none",
  );
}

export function useUnderline(
  value: CSSProperties | undefined,
  onChange: (value: CSSProperties) => void,
) {
  return useToggleProperty(
    value?.textDecoration,
    (textDecoration) => onChange({ ...value, textDecoration }),
    "underline",
    "none",
  );
}

/** Field label, shown for every widget type. */
export function TextFormatDescriptor({
  value,
  onChange,
}: WidgetPropertyFieldProps) {
  const [isBold, toggleBold] = useBold(value.labelStyle, onChange);
  const [isItalic, toggleItalic] = useItalic(value.labelStyle, onChange);
  const [isUnderline, toggleUnderline] = useUnderline(
    value.labelStyle,
    onChange,
  );

  console.log(value);
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="prop-label">Label</Label>
      <div>
        <Button
          className="size-10"
          variant={isBold ? "default" : "ghost"}
          onClick={toggleBold}
        >
          <BoldIcon />
        </Button>
        <Button
          className="size-10"
          variant={isItalic ? "default" : "ghost"}
          onClick={toggleItalic}
        >
          <ItalicIcon />
        </Button>
        <Button
          className="size-10"
          variant={isUnderline ? "default" : "ghost"}
          onClick={toggleUnderline}
        >
          <UnderlineIcon />
        </Button>
      </div>
    </div>
  );
}
