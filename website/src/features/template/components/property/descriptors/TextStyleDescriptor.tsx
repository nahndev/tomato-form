"use client";

import { Button } from "@/components/ui/button";
import { ColorPicker } from "@/components/ui/color-picker";
import { Label } from "@/components/ui/label";
import type { WidgetPropertyFieldProps } from "@/features/template/components/property/types";
import { useToggleProperty } from "@/features/template/hooks/useConditionValue";
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
} from "lucide-react";
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

export function useAlignLeft(
  value: CSSProperties | undefined,
  onChange: (value: CSSProperties) => void,
) {
  return useToggleProperty(
    value?.textAlign,
    (textAlign: CSSProperties["textAlign"]) => onChange({ ...value, textAlign }),
    "start",
    "start",
  );
}

export function useAlignCenter(
  value: CSSProperties | undefined,
  onChange: (value: CSSProperties) => void,
) {
  return useToggleProperty(
    value?.textAlign,
    (textAlign: CSSProperties["textAlign"]) => onChange({ ...value, textAlign }),
    "center",
    "center",
  );
}

export function useAlignRight(
  value: CSSProperties | undefined,
  onChange: (value: CSSProperties) => void,
) {
  return useToggleProperty(
    value?.textAlign,
    (textAlign: CSSProperties["textAlign"]) => onChange({ ...value, textAlign }),
    "end",
    "end",
  );
}

export function useAlignJustify(
  value: CSSProperties | undefined,
  onChange: (value: CSSProperties) => void,
) {
  return useToggleProperty(
    value?.textAlign,
    (textAlign: CSSProperties["textAlign"]) => onChange({ ...value, textAlign }),
    "justify",
    "justify",
  );
}

/** Field label, shown for every widget type. */
export function TextStyleDescriptor({
  value,
  onChange,
}: WidgetPropertyFieldProps<"textStyle">) {
  const [isBold, toggleBold] = useBold(value, onChange);
  const [isItalic, toggleItalic] = useItalic(value, onChange);
  const [isUnderline, toggleUnderline] = useUnderline(value, onChange);
  const [isAlignLeft, toggleAlignLeft] = useAlignLeft(value, onChange);
  const [isAlignCenter, toggleAlignCenter] = useAlignCenter(value, onChange);
  const [isAlignRight, toggleAlignRight] = useAlignRight(value, onChange);
  const [isAlignJustify, toggleAlignJustify] = useAlignJustify(
    value,
    onChange,
  );

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="prop-label">Text styles</Label>
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
        <Button
          className="size-10"
          variant={isAlignLeft ? "default" : "ghost"}
          onClick={toggleAlignLeft}
        >
          <AlignLeftIcon />
        </Button>
        <Button
          className="size-10"
          variant={isAlignCenter ? "default" : "ghost"}
          onClick={toggleAlignCenter}
        >
          <AlignCenterIcon />
        </Button>
        <Button
          className="size-10"
          variant={isAlignRight ? "default" : "ghost"}
          onClick={toggleAlignRight}
        >
          <AlignRightIcon />
        </Button>
        <Button
          className="size-10"
          variant={isAlignJustify ? "default" : "ghost"}
          onClick={toggleAlignJustify}
        >
          <AlignJustifyIcon />
        </Button>
        <ColorPicker
          value={value?.color as string | undefined}
          onChange={(color) => onChange({ ...value, color })}
        />
      </div>
    </div>
  );
}
