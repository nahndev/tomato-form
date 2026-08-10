"use client";

import { ColorPicker } from "@/components/ui/color-picker";
import { Label } from "@/components/ui/label";
import type { WidgetPropertyFieldProps } from "@/features/template/components/property/types";

export function ContainerStyleDescriptor({
  value,
  onChange,
}: WidgetPropertyFieldProps<"containerStyle">) {
  const containerStyle = value ?? {};

  return (
    <div className="flex flex-row items-center gap-2">
      <ColorPicker
        value={containerStyle.background as string | undefined}
        onChange={(background) => onChange({ ...containerStyle, background })}
      />
      <Label htmlFor="prop-container-style">Background color</Label>
    </div>
  );
}
